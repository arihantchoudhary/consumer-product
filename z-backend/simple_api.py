#!/usr/bin/env python3
"""Simplified API - All in one file for easy management"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os
from dotenv import load_dotenv
import json
import logging
import uvicorn

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Consumer Product API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class CreateAgentRequest(BaseModel):
    name: str
    firstMessage: Optional[str] = ""
    systemPrompt: Optional[str] = "You are a helpful AI assistant."
    language: Optional[str] = "en"

class CreateAgentResponse(BaseModel):
    success: bool
    agent_id: str
    name: str

# ElevenLabs API
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"

# Routes
@app.get("/")
async def root():
    return {"message": "Consumer Product API", "version": "1.0.0"}

@app.post("/api/agents/create", response_model=CreateAgentResponse)
async def create_agent(request: CreateAgentRequest):
    """Create a new ElevenLabs agent"""
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    # Build agent config
    agent_config = {"conversation_config": {}}
    
    if request.name:
        agent_config["name"] = request.name
    
    if request.systemPrompt or request.firstMessage:
        agent_config["conversation_config"]["agent"] = {}
        
        if request.firstMessage:
            agent_config["conversation_config"]["agent"]["first_message"] = request.firstMessage
        
        if request.systemPrompt:
            agent_config["conversation_config"]["agent"]["prompt"] = {"prompt": request.systemPrompt}
        
        if request.language:
            agent_config["conversation_config"]["agent"]["language"] = request.language
    
    # Call ElevenLabs API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ELEVENLABS_BASE_URL}/convai/agents/create",
                headers={"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"},
                json=agent_config,
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"ElevenLabs error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"ElevenLabs API error: {response.text}")
            
            data = response.json()
            agent_id = data.get("agent_id")
            
            if not agent_id:
                raise HTTPException(status_code=500, detail="No agent_id received")
            
            return CreateAgentResponse(success=True, agent_id=agent_id, name=request.name)
            
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Timeout calling ElevenLabs API")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Delete an agent from ElevenLabs"""
    logger.info(f"Delete request received for agent: {agent_id}")
    
    if not ELEVENLABS_API_KEY:
        logger.error("ELEVENLABS_API_KEY not configured")
        raise HTTPException(status_code=500, detail="API key not configured")
    
    async with httpx.AsyncClient() as client:
        try:
            delete_url = f"{ELEVENLABS_BASE_URL}/convai/agents/{agent_id}"
            logger.info(f"Calling ElevenLabs delete API: {delete_url}")
            
            response = await client.delete(
                delete_url,
                headers={"xi-api-key": ELEVENLABS_API_KEY},
                timeout=30.0
            )
            
            logger.info(f"ElevenLabs response status: {response.status_code}")
            logger.info(f"ElevenLabs response text: {response.text}")
            
            if response.status_code not in [200, 204]:
                logger.error(f"ElevenLabs delete error - Status: {response.status_code}, Response: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"ElevenLabs API error: {response.text}")
            
            return {"success": True, "message": "Agent deleted successfully"}
            
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP Status Error: {e.response.status_code} - {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except Exception as e:
            logger.error(f"Unexpected error deleting agent: {type(e).__name__}: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/conversations")
async def get_conversations(
    cursor: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    agent_ids: Optional[str] = Query(None, description="Comma-separated agent IDs")
):
    """Get conversations for specified agents"""
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    # Build query parameters
    params = {"limit": str(limit)}
    if cursor:
        params["cursor"] = cursor
    if agent_ids:
        params["agent_ids"] = agent_ids
    
    # Call ElevenLabs API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{ELEVENLABS_BASE_URL}/convai/conversations",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
                params=params,
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"ElevenLabs error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"ElevenLabs API error: {response.text}")
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Error fetching conversations: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("simple_api:app", host="0.0.0.0", port=8001, reload=True)