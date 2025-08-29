from typing import Dict, List, Optional
from datetime import datetime
import json
import os
from pathlib import Path

class MemoryStore:
    """Simple in-memory storage with file persistence"""
    
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
        # In-memory storage
        self.users: Dict[str, dict] = {}
        self.agents: Dict[str, dict] = {}
        self.user_agents: Dict[str, List[str]] = {}  # user_id -> [agent_ids]
        
        # Load existing data
        self._load_data()
    
    def _load_data(self):
        """Load data from JSON files"""
        users_file = self.data_dir / "users.json"
        agents_file = self.data_dir / "agents.json"
        user_agents_file = self.data_dir / "user_agents.json"
        
        if users_file.exists():
            with open(users_file, 'r') as f:
                self.users = json.load(f)
        
        if agents_file.exists():
            with open(agents_file, 'r') as f:
                self.agents = json.load(f)
        
        if user_agents_file.exists():
            with open(user_agents_file, 'r') as f:
                self.user_agents = json.load(f)
    
    def _save_data(self):
        """Save data to JSON files"""
        with open(self.data_dir / "users.json", 'w') as f:
            json.dump(self.users, f, indent=2, default=str)
        
        with open(self.data_dir / "agents.json", 'w') as f:
            json.dump(self.agents, f, indent=2, default=str)
        
        with open(self.data_dir / "user_agents.json", 'w') as f:
            json.dump(self.user_agents, f, indent=2)
    
    # User methods
    def get_user(self, user_id: str) -> Optional[dict]:
        return self.users.get(user_id)
    
    def create_user(self, user_id: str, email: str, name: Optional[str] = None) -> dict:
        user = {
            "id": user_id,
            "email": email,
            "name": name,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        self.users[user_id] = user
        self.user_agents[user_id] = []
        self._save_data()
        return user
    
    def update_user(self, user_id: str, updates: dict) -> Optional[dict]:
        if user_id in self.users:
            self.users[user_id].update(updates)
            self.users[user_id]["updated_at"] = datetime.now()
            self._save_data()
            return self.users[user_id]
        return None
    
    # Agent methods
    def get_agent(self, agent_id: str) -> Optional[dict]:
        return self.agents.get(agent_id)
    
    def create_agent(self, agent_data: dict) -> dict:
        agent_id = agent_data["id"]
        user_id = agent_data["user_id"]
        
        # Store agent
        self.agents[agent_id] = agent_data
        
        # Link to user
        if user_id not in self.user_agents:
            self.user_agents[user_id] = []
        self.user_agents[user_id].append(agent_id)
        
        self._save_data()
        return agent_data
    
    def get_user_agents(self, user_id: str) -> List[dict]:
        agent_ids = self.user_agents.get(user_id, [])
        return [self.agents[aid] for aid in agent_ids if aid in self.agents]
    
    def delete_agent(self, agent_id: str) -> bool:
        if agent_id in self.agents:
            agent = self.agents[agent_id]
            user_id = agent["user_id"]
            
            # Remove from agents
            del self.agents[agent_id]
            
            # Remove from user_agents
            if user_id in self.user_agents:
                self.user_agents[user_id] = [
                    aid for aid in self.user_agents[user_id] if aid != agent_id
                ]
            
            self._save_data()
            return True
        return False

# Global instance
memory_store = MemoryStore()