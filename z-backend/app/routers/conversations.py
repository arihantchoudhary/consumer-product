from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import logging

from ..models.conversation import ConversationListResponse
from ..services.elevenlabs import elevenlabs_service
from ..storage.memory_store import memory_store
from .auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/agents", tags=["conversations"])

@router.get("/conversations", response_model=ConversationListResponse)
async def get_conversations(
    cursor: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    agent_ids: Optional[str] = Query(None, description="Comma-separated agent IDs"),
    current_user: dict = Depends(get_current_user)
):
    """Get conversations for the current user's agents"""
    try:
        # If agent_ids provided, use those (they should be ElevenLabs IDs from user metadata)
        if agent_ids:
            elevenlabs_agent_ids = [aid.strip() for aid in agent_ids.split(',') if aid.strip()]
            
            # Create a name map from metadata if available
            user_agents = memory_store.get_user_agents(current_user["id"])
            agent_name_map = {
                agent["elevenlabs_agent_id"]: agent["name"] 
                for agent in user_agents
            }
        else:
            # Fallback to getting all user's agents from storage
            user_agents = memory_store.get_user_agents(current_user["id"])
            
            if not user_agents:
                return ConversationListResponse(
                    conversations=[],
                    has_more=False,
                    next_cursor=None
                )
            
            elevenlabs_agent_ids = [agent["elevenlabs_agent_id"] for agent in user_agents]
            agent_name_map = {
                agent["elevenlabs_agent_id"]: agent["name"] 
                for agent in user_agents
            }
        
        # Fetch conversations from ElevenLabs
        elevenlabs_data = await elevenlabs_service.get_conversations(
            agent_ids=elevenlabs_agent_ids,
            cursor=cursor,
            limit=limit
        )
        
        # Enhance conversations with agent names
        conversations = elevenlabs_data.get("conversations", [])
        for conv in conversations:
            agent_id = conv.get("agent_id")
            if agent_id in agent_name_map:
                conv["agent_name"] = agent_name_map[agent_id]
        
        return ConversationListResponse(
            conversations=conversations,
            has_more=elevenlabs_data.get("has_more", False),
            next_cursor=elevenlabs_data.get("next_cursor")
        )
        
    except Exception as e:
        logger.error(f"Error fetching conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))