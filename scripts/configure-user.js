/**
 * StackAuth User Configuration Script
 * 
 * This script helps configure user permissions for the project.
 * 
 * Usage:
 * node scripts/configure-user.js <email> [options]
 * 
 * Options:
 * --name <name>           User's display name
 * --agentId <id>         ElevenLabs agent ID
 * --pages <pages>        Comma-separated list of allowed pages
 * --role <role>          User role (admin/user)
 */

const { StackServerApp } = require("@stackframe/stack");

function parseArgs(args) {
  const result = {
    email: args[0],
    name: null,
    agentId: null,
    pages: ['neeraj'], // Default page access
    role: 'user'
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--name':
        result.name = args[++i];
        break;
      case '--agentId':
        result.agentId = args[++i];
        break;
      case '--pages':
        result.pages = args[++i].split(',');
        break;
      case '--role':
        result.role = args[++i];
        break;
    }
  }

  return result;
}

async function configureUser(args) {
  const options = parseArgs(args);
  
  if (!options.email) {
    console.error('Please provide an email address');
    console.log('Usage: node scripts/configure-user.js <email> [options]');
    console.log('Options:');
    console.log('  --name <name>         User display name');
    console.log('  --agentId <id>       ElevenLabs agent ID');
    console.log('  --pages <pages>      Comma-separated list of allowed pages');
    console.log('  --role <role>        User role (admin/user)');
    console.log('\nExample:');
    console.log('  node scripts/configure-user.js john@example.com --name "John Doe" --agentId "agent_123" --pages "john,neeraj,dashboard" --role admin');
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

    console.log(`Configuring user: ${options.email}`);

    // Find user by email
    const users = await stackServerApp.listUsers();
    const user = users.find(u => u.primaryEmail === options.email);

    if (!user) {
      console.error(`User ${options.email} not found in StackAuth`);
      console.log('Please create the user in StackAuth dashboard first');
      process.exit(1);
    }

    // Build metadata object
    const metadata = {
      allowedPages: options.pages,
      role: options.role
    };

    if (options.name) metadata.name = options.name;
    if (options.agentId) metadata.agentId = options.agentId;

    console.log('Configuration:', JSON.stringify(metadata, null, 2));

    // Update user metadata
    await stackServerApp.updateUser(user.id, {
      clientMetadata: metadata
    });

    console.log(`✅ Successfully configured user ${options.email}`);
    console.log(`User now has access to: ${options.pages.join(', ')}`);

  } catch (error) {
    console.error('Error configuring user:', error.message);
    process.exit(1);
  }
}

// Get arguments from command line
const args = process.argv.slice(2);
configureUser(args);