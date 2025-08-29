from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class Conversation(BaseModel):
    conversation_id: str
    agent_id: str
    agent_name: Optional[str] = None
    start_time_unix_secs: int
    call_duration_secs: int
    message_count: int
    transcript_summary: Optional[str] = None
    call_successful: str
    metadata: Optional[dict] = None

class ConversationListResponse(BaseModel):
    conversations: List[Conversation]
    has_more: bool
    next_cursor: Optional[str] = None