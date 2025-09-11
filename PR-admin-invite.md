# Add Secure Admin Invite Endpoint

## Summary
Implements a secure server endpoint for sending Supabase invite emails using the Admin API, with comprehensive testing and documentation.

## Changes Made

### Backend Implementation
- **`supabase/functions/admin-invite/index.ts`**: New edge function that exposes `POST /admin-invite` endpoint
  - Uses Supabase Service Role key for admin operations
  - Accepts JSON body: `{ "email": "user@example.com", "data": { ...optional user_metadata... } }`
  - Normalizes email to lowercase before processing
  - Returns `200` with `{ ok: true, invite: <inviteData> }` on success
  - Returns appropriate error codes and messages on failure
  - Includes comprehensive logging for debugging

### Authentication & Security
- **Multi-layer admin authentication**:
  - Primary: `x-admin-key` header check against `ADMIN_API_KEY` environment variable
  - Fallback: Supabase session-based auth with role checking
  - Domain-based admin check for `@salescode.ai` emails
- **Input validation**: Email format validation and sanitization
- **CORS support**: Proper headers for web app integration

### Client Library & UI
- **`src/lib/adminInviteApi.ts`**: Type-safe client library with helper utilities
  - `sendAdminInvite()` function for making API calls
  - `AdminInviteTestHelper` class for testing scenarios
  - Comprehensive error handling and response typing

- **`src/components/admin-portal/AdminInvitePanel.tsx`**: React UI component
  - Form for email input and optional JSON metadata
  - Real-time validation and error handling
  - Loading states and success/error feedback
  - Toast notifications for user feedback

### Testing Coverage
- **Unit Tests** (`src/components/admin-portal/__tests__/AdminInvitePanel.test.tsx`):
  - Form rendering and interaction
  - Email validation requirements
  - JSON metadata parsing
  - Success/error state handling
  - Loading state behavior

- **E2E Tests** (`cypress/e2e/admin-invite.cy.ts`):
  - Complete invite flow with mocked API
  - Error handling scenarios
  - Form validation edge cases
  - Loading state verification
  - Form clearing after success

## Technical Details

### API Endpoint
```
POST /functions/v1/admin-invite
Headers: 
  - Authorization: Bearer <token> OR x-admin-key: <key>
  - Content-Type: application/json
Body: {
  "email": "user@example.com",
  "data": { "role": "admin", "department": "sales" }
}
```

### Response Format
```json
// Success
{
  "ok": true,
  "invite": { "user": { "id": "...", "email": "..." } },
  "message": "Invite sent to user@example.com"
}

// Error
{
  "ok": false,
  "error": "invite_failed",
  "details": "User already exists"
}
```

### Environment Variables Required
- `SUPABASE_SERVICE_ROLE_KEY`: For admin API access
- `ADMIN_API_KEY`: Optional dedicated admin key for API access
- `SITE_URL`: For redirect URL in invites

## QA Checklist

### Functional Testing
- [ ] Admin can send invite with email only
- [ ] Admin can send invite with email + metadata
- [ ] Non-admin users are properly rejected
- [ ] Invalid emails are rejected with proper error message
- [ ] Invalid JSON metadata shows clear error
- [ ] Duplicate invites are handled gracefully
- [ ] Success responses include invite data and user ID
- [ ] Error responses include helpful details

### Security Testing
- [ ] Endpoint requires proper authentication
- [ ] Admin API key authentication works
- [ ] Session-based admin authentication works
- [ ] Non-admin users cannot access endpoint
- [ ] Input sanitization prevents injection attacks
- [ ] CORS headers are properly configured

### UI/UX Testing
- [ ] Form validates required email field
- [ ] JSON metadata textarea accepts valid JSON
- [ ] Loading state shows during API call
- [ ] Success message displays with invite details
- [ ] Error messages are user-friendly and actionable
- [ ] Form clears after successful invite
- [ ] Toast notifications appear for all outcomes

### Integration Testing
- [ ] Edge function deploys successfully
- [ ] Supabase Admin API integration works
- [ ] Email invites are actually sent by Supabase
- [ ] Invited users can complete registration flow
- [ ] User metadata is properly applied to new accounts

### Performance Testing
- [ ] API response time is acceptable (< 2s)
- [ ] UI remains responsive during API calls
- [ ] Concurrent invites are handled properly
- [ ] Rate limiting works as expected

### Error Handling
- [ ] Network failures show appropriate errors
- [ ] Supabase API errors are properly surfaced
- [ ] Edge function errors include helpful logging
- [ ] Client-side errors don't crash the UI
- [ ] Malformed requests return proper 400 errors

## Deployment Notes
- Edge function auto-deploys with the application
- Ensure `ADMIN_API_KEY` is set in Supabase secrets if using key-based auth
- Test with actual admin users after deployment
- Monitor edge function logs for any issues