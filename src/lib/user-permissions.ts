// User permissions and metadata handling

export type PageAccess = 
  | 'savar' 
  | 'arihant' 
  | 'sajjad' 
  | 'neeraj'
  | 'sasha'
  | 'aaman'
  | 'guy'
  | 'parth'
  | 'srivardhan'
  | 'transcript-analyzer'
  | 'legal-assistant'
  | 'dashboard';

export interface UserPermissions {
  allowedPages: PageAccess[];
}

// Check if user has access to a specific page
export function hasPageAccess(userMetadata: unknown, page: PageAccess): boolean {
  const allowedPages = getUserAllowedPages(userMetadata);
  return allowedPages.includes(page);
}

// Get user's allowed pages from metadata
export function getUserAllowedPages(userMetadata: unknown): PageAccess[] {
  if (!userMetadata || typeof userMetadata !== 'object' || !('allowedPages' in userMetadata)) {
    return ['neeraj']; // Default access to Neeraj's page
  }
  
  const metadata = userMetadata as { allowedPages: PageAccess[] };
  return metadata.allowedPages;
}

// Get user's AgentID from metadata
export function getUserAgentId(userMetadata: unknown): string | null {
  if (!userMetadata || typeof userMetadata !== 'object' || !('agentId' in userMetadata)) {
    return null;
  }
  
  const metadata = userMetadata as { agentId: string };
  return metadata.agentId;
}

// Get user's name from metadata
export function getUserName(userMetadata: unknown): string | null {
  if (!userMetadata || typeof userMetadata !== 'object' || !('name' in userMetadata)) {
    return null;
  }
  
  const metadata = userMetadata as { name: string };
  return metadata.name;
}

// Update user metadata
export async function updateUserMetadata(user: any, updates: Partial<{
  agentId: string;
  name: string;
  allowedPages: PageAccess[];
}>): Promise<void> {
  // This function would need to be implemented with Stack Auth API
  // For now, it's a placeholder showing the interface
  console.log('Updating user metadata:', updates);
  // TODO: Implement actual Stack Auth update call
}