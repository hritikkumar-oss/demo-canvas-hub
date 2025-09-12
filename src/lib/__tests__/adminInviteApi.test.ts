import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendAdminInvite } from '../adminInviteApi';

// Mock the Supabase client
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { 
          session: { 
            access_token: 'test-token' 
          } 
        }
      })
    },
    functions: {
      invoke: mockInvoke
    }
  }
}));

describe('sendAdminInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns friendly message for duplicate email', async () => {
    // Mock the edge function to return duplicate error
    mockInvoke.mockResolvedValue({
      data: {
        error: 'This email has already been invited.'
      },
      error: null
    });

    const result = await sendAdminInvite('duplicate@example.com');

    expect(result).toEqual({
      error: 'This email has already been invited.'
    });
    
    expect(mockInvoke).toHaveBeenCalledWith('admin-invite', {
      body: { 
        email: 'duplicate@example.com', 
        data: undefined 
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
  });

  it('returns success for new email', async () => {
    // Mock the edge function to return success
    mockInvoke.mockResolvedValue({
      data: {
        ok: true,
        message: 'Invite sent to new@example.com',
        invite: {
          user: {
            id: 'test-user-id'
          }
        }
      },
      error: null
    });

    const result = await sendAdminInvite('new@example.com', { role: 'user' });

    expect(result).toEqual({
      ok: true,
      message: 'Invite sent to new@example.com',
      invite: {
        user: {
          id: 'test-user-id'
        }
      }
    });
    
    expect(mockInvoke).toHaveBeenCalledWith('admin-invite', {
      body: { 
        email: 'new@example.com', 
        data: { role: 'user' } 
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
  });

  it('handles function errors gracefully', async () => {
    // Mock the edge function to return an error
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: 'Function timeout'
      }
    });

    const result = await sendAdminInvite('test@example.com');

    expect(result).toEqual({
      ok: false,
      error: 'function_error',
      details: 'Function timeout'
    });
  });

  it('handles network errors', async () => {
    // Mock the edge function to throw an error
    mockInvoke.mockRejectedValue(new Error('Network error'));

    const result = await sendAdminInvite('test@example.com');

    expect(result).toEqual({
      ok: false,
      error: 'client_error',
      details: 'Network error'
    });
  });
});