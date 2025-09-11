import { supabase } from "@/integrations/supabase/client";

export interface AdminInviteRequest {
  email: string;
  data?: Record<string, any>;
}

export interface AdminInviteResponse {
  ok: boolean;
  invite?: any;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * Send an admin invite using the Supabase Edge Function
 * @param email - Email address to invite
 * @param data - Optional user metadata
 * @param adminKey - Optional admin API key for authentication
 * @returns Promise with invite response
 */
export async function sendAdminInvite(
  email: string, 
  data?: Record<string, any>,
  adminKey?: string
): Promise<AdminInviteResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add admin key if provided
    if (adminKey) {
      headers['x-admin-key'] = adminKey;
    }

    // Get current session for auth header
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const { data: response, error } = await supabase.functions.invoke('admin-invite', {
      body: { email, data },
      headers
    });

    if (error) {
      console.error('Admin invite error:', error);
      return {
        ok: false,
        error: 'function_error',
        details: error.message || String(error)
      };
    }

    return response as AdminInviteResponse;
  } catch (error: any) {
    console.error('Admin invite client error:', error);
    return {
      ok: false,
      error: 'client_error',
      details: error.message || String(error)
    };
  }
}

/**
 * Test helper for admin invite functionality
 */
export class AdminInviteTestHelper {
  constructor(private adminKey?: string) {}

  async inviteUser(email: string, userData?: Record<string, any>) {
    return sendAdminInvite(email, userData, this.adminKey);
  }

  async inviteMultipleUsers(emails: string[], userData?: Record<string, any>) {
    const results = await Promise.allSettled(
      emails.map(email => this.inviteUser(email, userData))
    );

    return results.map((result, index) => ({
      email: emails[index],
      success: result.status === 'fulfilled' && result.value.ok,
      result: result.status === 'fulfilled' ? result.value : { error: result.reason }
    }));
  }

  async testInviteFlow(testEmail: string) {
    console.log('🧪 Testing admin invite flow...');
    
    const result = await this.inviteUser(testEmail, {
      test: true,
      invited_at: new Date().toISOString()
    });

    if (result.ok) {
      console.log('✅ Invite sent successfully:', result);
    } else {
      console.log('❌ Invite failed:', result);
    }

    return result;
  }
}