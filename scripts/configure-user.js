/**
 * StackAuth User Configuration Script
 * 
 * This script helps configure user permissions for the savar-meta project.
 * 
 * Usage:
 * node scripts/configure-user.js arihant@berkeley.edu
 */

const { StackServerApp } = require("@stackframe/stack");

// Configuration for different users
const USER_CONFIGS = {
  'arihant@berkeley.edu': {
    name: 'Arihant Choudhary',
    agentId: 'agent_7701k30qqnxces59w2a4tsxaneq9',
    allowedPages: ['arihant', 'savar', 'sajjad', 'neeraj'], // Full access including Neeraj
    role: 'admin'
  },
  'savar@example.com': {
    name: 'Savar Sareen',
    agentId: 'agent_6501k310pz99fvkts53hqjte6v0p',
    allowedPages: ['savar', 'neeraj'], // Access to own page and Neeraj
    role: 'user'
  },
  'neeraj@example.com': {
    name: 'Neeraj',
    agentId: 'agent_0501k30qjpw9fbharan0mmt0sj03',
    allowedPages: ['neeraj'], // Neeraj keeps access to own page
    role: 'user'
  },
  'aaman.bilakhia@gmail.com': {
    name: 'Aaman',
    agentId: 'agent_6301k2rzxtr7f04ba7z12786rrwr',
    allowedPages: ['aaman', 'neeraj'], // Access to own page and Neeraj
    role: 'user'
  },
  'sasha@example.com': {
    name: 'Sasha',
    agentId: 'agent_0001k1cy1sc3e8ca6v60k01jkkz5',
    allowedPages: ['sasha', 'neeraj'], // Access to own page and Neeraj
    role: 'user'
  },
  'parth.behani@gmail.com': {
    name: 'Parth Behani',
    agentId: 'agent_2101k2t7ysp2frmscya48yrb5w87',
    allowedPages: ['parth', 'neeraj'], // Access to own page and Neeraj
    role: 'user'
  }
};

async function configureUser(email) {
  if (!email) {
    console.error('Please provide an email address');
    console.log('Usage: node scripts/configure-user.js <email>');
    process.exit(1);
  }

  const userConfig = USER_CONFIGS[email.toLowerCase()];
  if (!userConfig) {
    console.error(`No configuration found for ${email}`);
    console.log('Available configurations:');
    Object.keys(USER_CONFIGS).forEach(email => {
      console.log(`  - ${email}`);
    });
    process.exit(1);
  }

  // Check required environment variables
  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
  const clientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
  const clientSecret = process.env.STACK_CLIENT_SECRET;

  if (!projectId || !clientKey || !clientSecret) {
    console.error('Missing required environment variables:');
    console.log('NEXT_PUBLIC_STACK_PROJECT_ID');
    console.log('NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY');
    console.log('STACK_CLIENT_SECRET');
    process.exit(1);
  }

  try {
    // Initialize StackAuth
    const stackServerApp = new StackServerApp({
      projectId,
      clientKey,
      clientSecret
    });

    console.log(`Configuring user: ${email}`);
    console.log('Configuration:', JSON.stringify(userConfig, null, 2));

    // Find user by email
    const users = await stackServerApp.listUsers();
    const user = users.find(u => u.primaryEmail === email);

    if (!user) {
      console.error(`User ${email} not found in StackAuth`);
      console.log('Please create the user in StackAuth dashboard first');
      process.exit(1);
    }

    // Update user metadata
    await stackServerApp.updateUser(user.id, {
      clientMetadata: userConfig
    });

    console.log(`✅ Successfully configured user ${email}`);
    console.log(`User now has access to: ${userConfig.allowedPages.join(', ')}`);

  } catch (error) {
    console.error('Error configuring user:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];
configureUser(email);