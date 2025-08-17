export type PageAccess = 'arihant' | 'savar' | 'sajjad' | 'guy' | 'sasha' | 'neeraj' | 'aaman' | 'parth' | 'srivardhan' | 'transcript-analyzer' | 'legal-assistant';

export interface UserPermissions {
  allowedPages: PageAccess[];
}

// Check if user has access to a specific page
export function hasPageAccess(userMetadata: unknown, page: PageAccess): boolean {
  if (!userMetadata || typeof userMetadata !== 'object' || !('allowedPages' in userMetadata)) {
    return false;
  }
  
  const metadata = userMetadata as { allowedPages: PageAccess[] };
  return metadata.allowedPages.includes(page);
}

// Get all pages a user has access to
export function getUserAllowedPages(userMetadata: unknown): PageAccess[] {
  if (!userMetadata || typeof userMetadata !== 'object' || !('allowedPages' in userMetadata)) {
    return [];
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

// Categorize pages into owned vs accessible based on user email and page mapping
export function categorizeUserPages(userMetadata: unknown, userEmail?: string): {
  ownedPages: PageAccess[];
  otherPages: PageAccess[];
} {
  const allowedPages = getUserAllowedPages(userMetadata);
  
  if (!userEmail) {
    return {
      ownedPages: [],
      otherPages: allowedPages
    };
  }
  
  // Map user emails to their owned page
  const emailToPageMap: Record<string, PageAccess> = {
    'arihant@berkeley.edu': 'arihant',
    'sksareen1@gmail.com': 'savar',
    'neerajagarwala123@gmail.com': 'neeraj',
    'aaman.bilakhia@gmail.com': 'aaman',
    'sasa.krecinic@gmail.com': 'sasha',
    'sajjad@example.com': 'sajjad',
    'guy@ruttenbergiplaw.com': 'guy',
    'parth.behani@gmail.com': 'parth',
    'srivardhanjalan@gmail.com': 'srivardhan'
  };
  
  // Pages that belong to current user regardless of email
  const specialOwnedPages: PageAccess[] = ['transcript-analyzer'];
  
  // Pages that belong only to specific users
  const restrictedOwnedPages: Record<string, PageAccess[]> = {
    'guy@ruttenbergiplaw.com': ['legal-assistant'],
    'arihant@berkeley.edu': ['legal-assistant']
  };
  
  const ownedPage = emailToPageMap[userEmail.toLowerCase()];
  const ownedPages: PageAccess[] = [];
  const otherPages: PageAccess[] = [];
  
  const userRestrictedPages = restrictedOwnedPages[userEmail.toLowerCase()] || [];
  
  allowedPages.forEach(page => {
    if (page === ownedPage || specialOwnedPages.includes(page) || userRestrictedPages.includes(page)) {
      ownedPages.push(page);
    } else {
      otherPages.push(page);
    }
  });
  
  return { ownedPages, otherPages };
}

// Default permissions for new users (you can modify this)
export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  allowedPages: [] // No access by default
};