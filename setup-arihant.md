# Quick Setup for arihant@berkeley.edu

## Manual Setup in StackAuth Dashboard

1. **Login to StackAuth Dashboard**
   - Go to https://app.stack-auth.com
   - Navigate to your savar-meta project

2. **Add User**
   - Go to "Users" section
   - Click "Add User" or "Invite User"
   - Email: `arihant@berkeley.edu`

3. **Set User Metadata**
   - Find the user in the list
   - Click on the user to edit
   - In the "Client Metadata" section, add:

```json
{
  "name": "Arihant Choudhary",
  "agentId": "agent_4001k2e8cqg2f3hswmrnt743wx09",
  "allowedPages": ["arihant", "savar", "sajjad"]
}
```

4. **Save the Changes**

## What This Gives arihant@berkeley.edu

✅ **Full Access to All Pages:**
- `/arihant` - Arihant's personal meeting page
- `/savar` - Savar's personal meeting page  
- `/sajjad` - Sajjad's AI assistant page

✅ **Voice Features:**
- Can use ElevenLabs voice conversations
- Assigned agent ID for personalized interactions

✅ **Admin Navigation:**
- Navigation bar shows all available pages
- Can switch between different user experiences

✅ **Transcript Analysis:**
- Full access to Sajjad's AI transcript analyzer
- Can customize analysis prompts
- Export and email functionality

## Testing Access

1. Have arihant@berkeley.edu sign in at `/sign-in`
2. They should see navigation buttons for all three pages
3. Each page should load without "Access Denied" errors
4. Voice features should work with microphone access

## If You Need API Access

For programmatic setup, install the StackAuth server SDK:

```bash
npm install @stackframe/stack
```

Then use the script:
```bash
# Set environment variables first
export STACK_CLIENT_SECRET="your-secret"
node scripts/configure-user.js arihant@berkeley.edu
```

## Environment Variables Needed

```env
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
ANTHROPIC_API_KEY=your_anthropic_key
```

That's it! arihant@berkeley.edu now has complete access to the entire project.