import httpx
import os
import json
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class ElevenLabsService:
    """Service for interacting with ElevenLabs API"""
    
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.base_url = "https://api.elevenlabs.io/v1"
        
    async def create_agent(self, agent_config: Dict[str, Any]) -> Dict[str, Any]:
        """Create an agent in ElevenLabs"""
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY not configured")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/convai/agents/create",
                headers={
                    "xi-api-key": self.api_key,
                    "Content-Type": "application/json"
                },
                json=agent_config,
                timeout=30.0
            )
            
            logger.info(f"ElevenLabs response status: {response.status_code}")
            
            if response.status_code != 200:
                logger.error(f"ElevenLabs error: {response.text}")
                raise Exception(f"ElevenLabs API error: {response.text}")
            
            return response.json()
    
    async def get_conversations(
        self, 
        agent_ids: Optional[list] = None,
        cursor: Optional[str] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        """Get conversations from ElevenLabs"""
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY not configured")
        
        params = {"limit": str(limit)}
        if cursor:
            params["cursor"] = cursor
        if agent_ids:
            params["agent_ids"] = ",".join(agent_ids)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/convai/conversations",
                headers={"xi-api-key": self.api_key},
                params=params,
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"ElevenLabs error: {response.text}")
                raise Exception(f"ElevenLabs API error: {response.text}")
            
            return response.json()
    
    async def get_agent(self, agent_id: str) -> Dict[str, Any]:
        """Get agent details from ElevenLabs"""
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY not configured")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/convai/agents/{agent_id}",
                headers={"xi-api-key": self.api_key},
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"ElevenLabs error: {response.text}")
                raise Exception(f"ElevenLabs API error: {response.text}")
            
            return response.json()
    
    async def delete_agent(self, agent_id: str) -> bool:
        """Delete an agent from ElevenLabs"""
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY not configured")
        
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.base_url}/convai/agents/{agent_id}",
                headers={"xi-api-key": self.api_key},
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"ElevenLabs delete error: {response.text}")
                raise Exception(f"ElevenLabs API error: {response.text}")
            
            return True

# Global instance
elevenlabs_service = ElevenLabsService()