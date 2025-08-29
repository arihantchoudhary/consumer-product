from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import uuid
from datetime import datetime
import logging

from ..models.agent import CreateAgentRequest, CreateAgentResponse, AgentListResponse, Agent
from ..services.elevenlabs import elevenlabs_service
from ..storage.memory_store import memory_store
from .auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/agents", tags=["agents"])

@router.post("/create", response_model=CreateAgentResponse)
async def create_agent(
    request: CreateAgentRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a new agent"""
    try:
        # Build agent configuration for ElevenLabs
        agent_config = {
            "conversation_config": {}
        }
        
        if request.name:
            agent_config["name"] = request.name
        
        if request.systemPrompt or request.firstMessage:
            agent_config["conversation_config"]["agent"] = {}
            
            if request.firstMessage:
                agent_config["conversation_config"]["agent"]["first_message"] = request.firstMessage
            
            if request.systemPrompt:
                agent_config["conversation_config"]["agent"]["prompt"] = {
                    "prompt": request.systemPrompt
                }
            
            if request.language:
                agent_config["conversation_config"]["agent"]["language"] = request.language
        
        logger.info(f"Creating agent for user {current_user['id']} with config: {agent_config}")
        
        # Call ElevenLabs API
        elevenlabs_data = await elevenlabs_service.create_agent(agent_config)
        elevenlabs_agent_id = elevenlabs_data.get("agent_id")
        
        if not elevenlabs_agent_id:
            raise HTTPException(status_code=500, detail="No agent_id received from ElevenLabs")
        
        # Create internal agent record
        agent_id = str(uuid.uuid4())
        agent_data = {
            "id": agent_id,
            "name": request.name,
            "first_message": request.firstMessage,
            "system_prompt": request.systemPrompt,
            "language": request.language,
            "user_id": current_user["id"],
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "elevenlabs_agent_id": elevenlabs_agent_id
        }
        
        # Store agent
        memory_store.create_agent(agent_data)
        
        logger.info(f"Successfully created agent: {agent_id} with ElevenLabs ID: {elevenlabs_agent_id}")
        
        return CreateAgentResponse(
            success=True,
            agent_id=elevenlabs_agent_id,  # Return ElevenLabs ID for frontend compatibility
            name=request.name
        )
        
    except Exception as e:
        logger.error(f"Error creating agent: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list", response_model=AgentListResponse)
async def list_agents(
    current_user: dict = Depends(get_current_user)
):
    """List all agents for the current user"""
    try:
        agents = memory_store.get_user_agents(current_user["id"])
        
        # Convert to Agent models
        agent_models = []
        for agent in agents:
            agent_models.append(Agent(**agent))
        
        return AgentListResponse(
            agents=agent_models,
            total=len(agent_models)
        )
    except Exception as e:
        logger.error(f"Error listing agents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an agent (both from our storage and ElevenLabs)"""
    try:
        # First try to find the agent in our storage by ElevenLabs ID
        all_agents = memory_store.get_user_agents(current_user["id"])
        agent = None
        for a in all_agents:
            if a["elevenlabs_agent_id"] == agent_id:
                agent = a
                break
        
        if not agent:
            # Try direct lookup in case agent_id is our internal ID
            agent = memory_store.get_agent(agent_id)
            if not agent or agent["user_id"] != current_user["id"]:
                raise HTTPException(status_code=404, detail="Agent not found")
        
        # Delete from ElevenLabs first
        try:
            await elevenlabs_service.delete_agent(agent["elevenlabs_agent_id"])
            logger.info(f"Deleted agent from ElevenLabs: {agent['elevenlabs_agent_id']}")
        except Exception as e:
            logger.error(f"Failed to delete from ElevenLabs: {str(e)}")
            # Continue with local deletion even if ElevenLabs fails
        
        # Delete from our storage
        success = memory_store.delete_agent(agent["id"])
        
        return {"success": success, "message": "Agent deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting agent: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))