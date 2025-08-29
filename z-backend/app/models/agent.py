from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Agent(BaseModel):
    id: str
    name: str
    first_message: Optional[str] = ""
    system_prompt: Optional[str] = "You are a helpful AI assistant."
    language: Optional[str] = "en"
    user_id: str
    created_at: datetime
    updated_at: datetime
    elevenlabs_agent_id: str

class CreateAgentRequest(BaseModel):
    name: str
    firstMessage: Optional[str] = ""
    systemPrompt: Optional[str] = "You are a helpful AI assistant."
    language: Optional[str] = "en"

class CreateAgentResponse(BaseModel):
    success: bool
    agent_id: str
    name: str

class AgentListResponse(BaseModel):
    agents: List[Agent]
    total: int