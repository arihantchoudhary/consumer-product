# Stack Auth OTP Implementation Guide

## Overview
This project now includes OTP (One-Time Password) authentication using Stack Auth. Users must authenticate with their email to receive an OTP before accessing the application. Each user is automatically routed to their designated page after authentication.

## Features
- ✅ Email-based OTP authentication
- ✅ User-specific routing (option1 for Savar, option2 for Arihant)
- ✅ Session expires on page refresh (requires re-authentication)
- ✅ Controlled user access (allowlist)
- ✅ Protected routes
- ✅ Automatic redirection based on user role

## Project Structure
```
src/
├── app/
│   ├── (protected)/          # Protected routes group
│   │   ├── layout.tsx         # Authentication wrapper
│   │   ├── page.tsx          # Main calendar page
│   │   ├── option1/          # Savar's page
│   │   │   └── page.tsx
│   │   └── option2/          # Arihant's page
│   │       └── page.tsx
│   ├── sign-in/              # Authentication page
│   │   └── page.tsx
│   ├── layout.tsx            # Root layout with Stack Provider
│   └── page.tsx              # Root page (handles routing)
├── lib/
│   ├── stack.ts              # Stack Auth client configuration
│   └── user-config.ts        # User allowlist and routing config
└── middleware.ts             # Route protection middleware
```

## How to Add New Users

### Method 1: Update Configuration File (Recommended for Development)

1. Open `src/lib/user-config.ts`
2. Add a new user to the `ALLOWED_USERS` array:

```typescript
{
  email: 'newuser@example.com',
  route: 'option1',  // or 'option2' depending on which page they should access
  name: 'User Name',
  agentId: 'agent_xxxxx', // Optional: ElevenLabs agent ID if different
}
```

### Method 2: Stack Auth Dashboard (Recommended for Production)

1. **Access Stack Auth Dashboard**
   - Go to [Stack Auth Dashboard](https://app.stack-auth.com)
   - Sign in with your account

2. **Navigate to Your Project**
   - Select your project (ID: `66e19cc0-43ce-41c6-a75e-932dc5d1f521`)

3. **Create New User**
   - Go to "Users" section
   - Click "Create User"
   - Enter user's email
   - Add metadata:
     ```json
     {
       "route": "option1",  // or "option2"
       "name": "User Name",
       "agentId": "agent_xxxxx"  // Optional
     }
     ```

4. **Configure Authentication Settings**
   - Enable "Magic Link" authentication
   - Set session duration to minimum (for refresh requirement)
   - Enable "Require existing user" to prevent unauthorized signups

### Method 3: Programmatic API (For Automation)

Create an API endpoint or script:

```typescript
// api/admin/add-user.ts
import { StackServerApp } from "@stackframe/stack";

const stackAdmin = new StackServerApp({
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
});

export async function addUser(email: string, route: string, name: string) {
  try {
    const user = await stackAdmin.createUser({
      primaryEmail: email,
      emailVerified: false,
      clientMetadata: {
        route,
        name,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}
```

## User Flow

1. **User visits the site** → Redirected to `/sign-in`
2. **User enters email** → OTP sent via Stack Auth magic link
3. **User clicks magic link in email** → Authenticated
4. **System checks user metadata** → Routes to designated page:
   - Savar → `/option1`
   - Arihant → `/option2`
5. **User refreshes page** → Session cleared, redirected to sign-in

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_STACK_PROJECT_ID=66e19cc0-43ce-41c6-a75e-932dc5d1f521
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_y5ypwywtawbrzh70ayesnksxkc0akx7066se11fv49cf8
STACK_SECRET_SERVER_KEY=ssk_bm6aed12b1zwy75nnpxwa4xwqty1ebj024v2gpt3add98
```

## Testing the Implementation

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test authentication flow:**
   - Visit http://localhost:3000
   - You'll be redirected to sign-in
   - Enter an allowed email (from user-config.ts)
   - Check email for magic link
   - Click the link to authenticate
   - Verify you're routed to the correct page

3. **Test session expiry:**
   - After authentication, refresh the page
   - Verify you're redirected back to sign-in

## Security Considerations

1. **Session Management:**
   - Sessions are not persisted across page refreshes
   - No cookies or localStorage for auth tokens
   - Each session requires fresh authentication

2. **Access Control:**
   - Only emails in the allowlist can authenticate
   - Users can only access their designated routes
   - Attempting to access other routes redirects to sign-in

3. **Rate Limiting:**
   - Stack Auth provides built-in rate limiting for OTP requests
   - Configure additional limits in Stack Auth dashboard if needed

## Troubleshooting

### User can't receive OTP
- Verify email is in the allowlist (user-config.ts or Stack Auth dashboard)
- Check Stack Auth dashboard for email delivery status
- Ensure email provider isn't blocking Stack Auth emails

### User is redirected to wrong page
- Check user metadata in Stack Auth dashboard
- Verify route configuration in user-config.ts
- Clear browser cache and try again

### Session persists after refresh
- Check that protected layout is clearing session on mount
- Verify Stack Auth token storage is set to "nextjs-cookie"
- Clear all browser data and test again

## Support

For issues with:
- **Stack Auth**: Visit [Stack Auth Documentation](https://docs.stack-auth.com)
- **Implementation**: Check the code comments in sign-in/page.tsx and (protected)/layout.tsx
- **User Management**: Refer to user-config.ts for configuration options
