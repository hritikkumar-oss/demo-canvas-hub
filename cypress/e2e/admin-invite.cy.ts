describe('Admin Invite Flow', () => {
  beforeEach(() => {
    // Visit admin portal (adjust path based on your routes)
    cy.visit('/admin-portal');
    
    // Mock the Supabase edge function call
    cy.intercept('POST', '**/functions/v1/admin-invite', (req) => {
      const { email, data } = req.body;
      
      // Simulate successful invite
      if (email && email.includes('@')) {
        req.reply({
          statusCode: 200,
          body: {
            ok: true,
            message: `Invite sent to ${email}`,
            invite: {
              user: {
                id: 'mock-user-id-123',
                email: email
              }
            }
          }
        });
      } else {
        req.reply({
          statusCode: 400,
          body: {
            ok: false,
            error: 'invalid_email'
          }
        });
      }
    }).as('adminInvite');
  });

  it('should display admin invite panel', () => {
    cy.get('[data-testid="admin-invite-panel"]').should('be.visible');
    cy.contains('Send Admin Invite').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('textarea').should('be.visible');
    cy.get('button').contains('Send Invite').should('be.visible');
  });

  it('should send invite with email only', () => {
    const testEmail = 'test@example.com';
    
    cy.get('input[type="email"]').type(testEmail);
    cy.get('button').contains('Send Invite').click();
    
    cy.wait('@adminInvite').then((interception) => {
      expect(interception.request.body).to.deep.include({
        email: testEmail
      });
    });
    
    cy.contains('✅ Success:').should('be.visible');
    cy.contains(`Invite sent to ${testEmail}`).should('be.visible');
    cy.contains('User ID: mock-user-id-123').should('be.visible');
  });

  it('should send invite with email and metadata', () => {
    const testEmail = 'admin@example.com';
    const metadata = '{"role": "admin", "department": "sales"}';
    
    cy.get('input[type="email"]').type(testEmail);
    cy.get('textarea').type(metadata);
    cy.get('button').contains('Send Invite').click();
    
    cy.wait('@adminInvite').then((interception) => {
      expect(interception.request.body).to.deep.include({
        email: testEmail,
        data: {
          role: 'admin',
          department: 'sales'
        }
      });
    });
    
    cy.contains('✅ Success:').should('be.visible');
  });

  it('should handle invalid JSON metadata gracefully', () => {
    const testEmail = 'test@example.com';
    const invalidJson = '{invalid json}';
    
    cy.get('input[type="email"]').type(testEmail);
    cy.get('textarea').type(invalidJson);
    cy.get('button').contains('Send Invite').click();
    
    // Should not make API call with invalid JSON
    cy.get('@adminInvite.all').should('have.length', 0);
    
    // Should show error message about invalid JSON
    cy.contains('Invalid JSON').should('be.visible');
  });

  it('should require email field', () => {
    cy.get('button').contains('Send Invite').click();
    
    // Should not make API call without email
    cy.get('@adminInvite.all').should('have.length', 0);
    
    // Should show validation message
    cy.contains('Email required').should('be.visible');
  });

  it('should show loading state during invite', () => {
    // Mock slower response
    cy.intercept('POST', '**/functions/v1/admin-invite', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(req.reply({
            statusCode: 200,
            body: { ok: true, message: 'Invite sent' }
          }));
        }, 1000);
      });
    }).as('slowAdminInvite');
    
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button').contains('Send Invite').click();
    
    // Check loading state
    cy.contains('Sending Invite...').should('be.visible');
    cy.get('button').contains('Send Invite').should('be.disabled');
    
    cy.wait('@slowAdminInvite');
    
    // Loading state should be gone
    cy.contains('Sending Invite...').should('not.exist');
    cy.get('button').contains('Send Invite').should('not.be.disabled');
  });

  it('should handle API errors gracefully', () => {
    // Mock error response
    cy.intercept('POST', '**/functions/v1/admin-invite', {
      statusCode: 500,
      body: {
        ok: false,
        error: 'invite_failed',
        details: 'User already exists'
      }
    }).as('failedInvite');
    
    cy.get('input[type="email"]').type('existing@example.com');
    cy.get('button').contains('Send Invite').click();
    
    cy.wait('@failedInvite');
    
    cy.contains('❌ Error:').should('be.visible');
    cy.contains('invite_failed').should('be.visible');
    cy.contains('User already exists').should('be.visible');
  });

  it('should clear form after successful invite', () => {
    const testEmail = 'test@example.com';
    const metadata = '{"role": "user"}';
    
    cy.get('input[type="email"]').type(testEmail);
    cy.get('textarea').type(metadata);
    cy.get('button').contains('Send Invite').click();
    
    cy.wait('@adminInvite');
    
    // Form should be cleared
    cy.get('input[type="email"]').should('have.value', '');
    cy.get('textarea').should('have.value', '');
  });
});