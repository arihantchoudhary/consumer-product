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
    agentId: 'agent_0101k2kap218efft7zq85ej2dwyw', // Savar's ElevenLabs agent
  },
  {
    email: 'arihant@berkeley.edu',
    route: 'option2',
    name: 'Arihant Choudhary',
    agentId: 'agent_4001k2e8cqg2f3hswmrnt743wx09', // Arihant's ElevenLabs agent
  },
  {
    email: 'srivardhanjalan@gmail.com',
    route: 'option1',
    name: 'Srivardhan Jalan',
    agentId: 'agent_0601k2t9dmfqfyrvffgzpqh3vyxy',
  },
  {
    email: 'neerajagarwala123@gmail.com',
    route: 'option1',
    name: 'Neeraj Agarwala',
    agentId: 'agent_3801k2rzfb2tfrks3eqssjbvw4s3',
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
