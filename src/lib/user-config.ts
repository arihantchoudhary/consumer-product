// User configuration for routing and access control
// This file defines which users have access and their designated routes

export interface UserConfig {
  email: string;
  route: 'option1' | 'option2';
  name: string;
  agentId?: string; // Optional ElevenLabs agent ID
}

// Define your allowed users here
export const ALLOWED_USERS: UserConfig[] = [
  {
    email: 'savar@example.com',
    route: 'option1',
    name: 'Savar Sareen',
    agentId: 'agent_6501k310pz99fvkts53hqjte6v0p', // Savar's ElevenLabs agent
  },
  {
    email: 'arihant@berkeley.edu',
    route: 'option2',
    name: 'Arihant Choudhary',
    agentId: 'agent_7701k30qqnxces59w2a4tsxaneq9', // Arihant's ElevenLabs agent
  },
  {
    email: 'srivardhanjalan@gmail.com',
    route: 'option1',
    name: 'Srivardhan Jalan',
    agentId: 'agent_0401k3115wwxeyd9s4pva81bts8q',
  },
  {
    email: 'neerajagarwala123@gmail.com',
    route: 'option1',
    name: 'Neeraj Agarwala',
    agentId: 'agent_0501k30qjpw9fbharan0mmt0sj03',
  },
  // Add more users as needed
];

// Helper function to check if a user is allowed
export function isUserAllowed(email: string): boolean {
  return ALLOWED_USERS.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Helper function to get user configuration
export function getUserConfig(email: string): UserConfig | undefined {
  return ALLOWED_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
}
