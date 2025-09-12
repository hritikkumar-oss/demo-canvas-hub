describe('Admin Invite Duplicate Handling', () => {
  beforeEach(() => {
    // Mock the Supabase functions
    cy.intercept('POST', '**/functions/v1/admin-invite', (req) => {
      const { email } = req.body;
      
      // Simulate duplicate email scenarios
      if (email === 'duplicate@example.com') {
        req.reply({
          statusCode: 400,
          body: {
            error: 'This email has already been invited.'
          }
        });
      } else if (email === 'new@example.com') {
        req.reply({
          statusCode: 200,
          body: {
            ok: true,
            message: 'Invite sent to new@example.com',
            invite: {
              user: {
                id: 'test-user-id'
              }
            }
          }
        });
      }
    }).as('adminInvite');

    // Visit the admin dashboard
    cy.visit('/admin/home');
    
    // Wait for the page to load
    cy.get('[data-testid="admin-invite-panel"]').should('be.visible');
  });

  it('shows friendly message for duplicate invite', () => {
    // Fill in the email field with a duplicate email
    cy.get('input[type="email"]').type('duplicate@example.com');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the API call
    cy.wait('@adminInvite');
    
    // Check that the friendly error message is displayed
    cy.get('[role="alert"]')
      .should('contain', 'This email has already been invited.')
      .and('not.contain', 'idx_invites_email_lower')
      .and('not.contain', 'duplicate key');
  });

  it('successfully creates invite for new email', () => {
    // Fill in the email field with a new email
    cy.get('input[type="email"]').type('new@example.com');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the API call
    cy.wait('@adminInvite');
    
    // Check that success message is displayed
    cy.get('[role="alert"]')
      .should('contain', 'Invite sent to new@example.com')
      .and('contain', 'User ID: test-user-id');
      
    // Check that the form is cleared
    cy.get('input[type="email"]').should('have.value', '');
  });

  it('shows toast notification for duplicate invite', () => {
    // Fill in the email field
    cy.get('input[type="email"]').type('duplicate@example.com');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the API call
    cy.wait('@adminInvite');
    
    // Check that toast notification appears with friendly message
    cy.get('[data-sonner-toast]')
      .should('contain', 'This email has already been invited.')
      .and('not.contain', 'duplicate key');
  });
});