# StackAuth User Configuration Guide

This guide explains how to configure user access in StackAuth for the savar-meta project.

## Overview

The project uses StackAuth for authentication and authorization. Users need to be configured with proper permissions to access different pages.

## User Configuration for arihant@berkeley.edu

### Step 1: Add User to StackAuth Dashboard

1. Go to your StackAuth dashboard: https://app.stack-auth.com
2. Navigate to your project
3. Go to the "Users" section
4. Add a new user with email: `arihant@berkeley.edu`

### Step 2: Set User Metadata

The user needs specific metadata to access all pages. Set the following `clientMetadata` for arihant@berkeley.edu:

```json
{
  "name": "Arihant Choudhary",
  "agentId": "agent_4001k2e8cqg2f3hswmrnt743wx09",
  "allowedPages": ["arihant", "savar", "sajjad"]
}
```

### Step 3: Configure via StackAuth API (Alternative)

You can also set this programmatically using the StackAuth API:

```javascript
// Using StackAuth Admin SDK
import { StackServerApp } from "@stackframe/stack";

const stackServerApp = new StackServerApp({
  projectId: "your-project-id",
  clientKey: "your-client-key",
  clientSecret: "your-client-secret"
});

// Update user metadata
await stackServerApp.updateUser("user-id", {
  clientMetadata: {
    name: "Arihant Choudhary",
    agentId: "agent_4001k2e8cqg2f3hswmrnt743wx09",
    allowedPages: ["arihant", "savar", "sajjad"]
  }
});
```

## Available Pages and Access Levels

### Page Access Types:
- `arihant`: Access to Arihant's personal meeting page (`/arihant`)
- `savar`: Access to Savar's personal meeting page (`/savar`) 
- `sajjad`: Access to Sajjad's AI assistant page (`/sajjad`)

### Full Access Configuration:
For complete access to all features, set `allowedPages` to:
```json
["arihant", "savar", "sajjad"]
```

## How Access Control Works

1. **Authentication**: StackAuth handles login/logout
2. **Authorization**: Each protected page checks user's `clientMetadata.allowedPages`
3. **Access Guard**: The `AccessGuard` component enforces page-level permissions
4. **Routing**: Users are redirected based on their permissions

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key

# For API route (transcript processing)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Current User Configuration

The system is already configured for:

1. **arihant@berkeley.edu**: Full access to all pages
   - Can access `/arihant`, `/savar`, `/sajjad`
   - Has ElevenLabs agent ID for voice conversations
   - Admin-level permissions

2. **savar@example.com**: Access to Savar's features
   - Can access Savar-specific functionality

## Adding New Users

To add a new user:

1. Update `src/lib/user-config.ts` to include the new email
2. Add user in StackAuth dashboard
3. Set appropriate `clientMetadata` with `allowedPages` array
4. Optionally add their ElevenLabs `agentId` for voice features

## Troubleshooting

### User Can't Access Pages
- Check user email matches exactly in configuration
- Verify `allowedPages` array in user's `clientMetadata`
- Ensure user is signed in to StackAuth

### Voice Features Not Working
- Verify `agentId` is set in user's `clientMetadata`
- Check ElevenLabs API integration
- Ensure microphone permissions are granted

### API Errors
- Check `ANTHROPIC_API_KEY` environment variable
- Verify API route is properly deployed
- Check browser console for detailed error messages

## Security Notes

- Users only have access to pages explicitly listed in their `allowedPages`
- All protected routes are wrapped with `AccessGuard` components
- User permissions are checked on both client and server side
- API routes validate user authentication before processing requests