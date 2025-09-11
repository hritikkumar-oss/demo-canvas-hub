import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { AdminInvitePanel } from '../AdminInvitePanel';
import { sendAdminInvite } from '@/lib/adminInviteApi';

// Mock the API function
vi.mock('@/lib/adminInviteApi', () => ({
  sendAdminInvite: vi.fn()
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockSendAdminInvite = vi.mocked(sendAdminInvite);

describe('AdminInvitePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the invite form correctly', () => {
    const { getByText, getByLabelText, getByRole } = render(<AdminInvitePanel />);
    
    expect(getByText('Send Admin Invite')).toBeInTheDocument();
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('User Metadata (Optional)')).toBeInTheDocument();
    expect(getByRole('button', { name: /send invite/i })).toBeInTheDocument();
  });

  it('requires email to be entered', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<AdminInvitePanel />);
    
    const submitButton = getByRole('button', { name: /send invite/i });
    await user.click(submitButton);

    // Should not call the API without email
    expect(mockSendAdminInvite).not.toHaveBeenCalled();
  });

  it('sends invite with email only', async () => {
    const user = userEvent.setup();
    mockSendAdminInvite.mockResolvedValueOnce({
      ok: true,
      message: 'Invite sent successfully'
    });

    const { getByLabelText, getByRole } = render(<AdminInvitePanel />);
    
    const emailInput = getByLabelText('Email Address');
    const submitButton = getByRole('button', { name: /send invite/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(mockSendAdminInvite).toHaveBeenCalledWith('test@example.com', undefined);
    });
  });

  it('sends invite with email and user metadata', async () => {
    const user = userEvent.setup();
    mockSendAdminInvite.mockResolvedValueOnce({
      ok: true,
      message: 'Invite sent successfully'
    });

    const { getByLabelText, getByRole } = render(<AdminInvitePanel />);
    
    const emailInput = getByLabelText('Email Address');
    const userDataInput = getByLabelText('User Metadata (Optional)');
    const submitButton = getByRole('button', { name: /send invite/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(userDataInput, '{"role": "admin"}');
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(mockSendAdminInvite).toHaveBeenCalledWith('test@example.com', { role: 'admin' });
    });
  });

  it('handles invalid JSON in user metadata', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = render(<AdminInvitePanel />);
    
    const emailInput = getByLabelText('Email Address');
    const userDataInput = getByLabelText('User Metadata (Optional)');
    const submitButton = getByRole('button', { name: /send invite/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(userDataInput, 'invalid json');
    await user.click(submitButton);

    // Should not call the API with invalid JSON
    await vi.waitFor(() => {
      expect(mockSendAdminInvite).not.toHaveBeenCalled();
    });
  });

  it('displays success result', async () => {
    const user = userEvent.setup();
    mockSendAdminInvite.mockResolvedValueOnce({
      ok: true,
      message: 'Invite sent successfully',
      invite: { user: { id: 'user-123' } }
    });

    const { getByLabelText, getByRole, getByText } = render(<AdminInvitePanel />);
    
    const emailInput = getByLabelText('Email Address');
    const submitButton = getByRole('button', { name: /send invite/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(getByText('✅ Success:')).toBeInTheDocument();
      expect(getByText('Invite sent successfully')).toBeInTheDocument();
      expect(getByText('User ID: user-123')).toBeInTheDocument();
    });
  });

  it('displays error result', async () => {
    const user = userEvent.setup();
    mockSendAdminInvite.mockResolvedValueOnce({
      ok: false,
      error: 'invite_failed',
      details: 'User already exists'
    });

    const { getByLabelText, getByRole, getByText } = render(<AdminInvitePanel />);
    
    const emailInput = getByLabelText('Email Address');
    const submitButton = getByRole('button', { name: /send invite/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(getByText('❌ Error:')).toBeInTheDocument();
      expect(getByText('invite_failed')).toBeInTheDocument();
      expect(getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('shows loading state during invite', async () => {
    const user = userEvent.setup();
    // Mock a delayed response
    mockSendAdminInvite.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    const { getByLabelText, getByRole, getByText } = render(<AdminInvitePanel />);
    
    const emailInput = getByLabelText('Email Address');
    const submitButton = getByRole('button', { name: /send invite/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Check loading state
    expect(getByText('Sending Invite...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});