import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user ID from the authenticated request
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get stoaId from request body
    const { stoaId } = req.body;

    // Get the Clerk client
    const client = await clerkClient();
    
    // Get current user data
    const user = await client.users.getUser(userId);
    
    // Update the user's publicMetadata with stoaId (null will clear it)
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        stoaId: stoaId || null
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: stoaId ? 'Stoa ID set successfully' : 'Stoa ID cleared successfully',
      stoaId: stoaId || null
    });
  } catch (error) {
    console.error('Error setting/clearing Stoa ID:', error);
    return res.status(500).json({ error: 'Failed to set/clear Stoa ID' });
  }
}