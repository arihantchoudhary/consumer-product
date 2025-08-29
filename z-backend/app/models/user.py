from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    created_agents: List[str] = []
    created_at: datetime
    updated_at: datetime
    
class UserAgentData(BaseModel):
    user_id: str
    agent_ids: List[str]