/// <reference types="Cypress" />

// test suite
describe('Astar page', () => {
  beforeEach(()=>{
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
    cy.get('#graphNav > .nav-link').click();
    cy.get(':nth-child(4) > .dropdown-item').click();
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('no obstacle search', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#srcX').clear('0');
    cy.get('#srcX').type('0');
    cy.get('#srcY').clear('0');
    cy.get('#srcY').type('0');
    cy.get('#dstX').clear('7');
    cy.get('#dstX').type('7');
    cy.get('#dstY').clear('7');
    cy.get('#dstY').type('7');
    cy.get('#start-button').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('error input', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#start-button').click();
    cy.get('#srcXFeedback').should('have.text', 'Empty input');
    cy.get('#dstXFeedback').should('have.text', 'Empty input');
    cy.get('#srcYFeedback').should('have.text', 'Empty input');
    cy.get('#dstYFeedback').should('have.text', 'Empty input');
    cy.get('#srcX').clear('-4');
    cy.get('#srcX').type('-4');
    cy.get('#start-button').click();
    cy.get('#srcY').clear('-6');
    cy.get('#srcY').type('-6');
    cy.get('#start-button').click();
    cy.get('#srcXFeedback').should('have.text', 'invalid x value');
    cy.get('#srcYFeedback').should('have.text', 'invalid y value');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('input on obstacle', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#c0').click();
    cy.get('#srcX').clear('0');
    cy.get('#srcX').type('0');
    cy.get('#srcY').clear('0');
    cy.get('#srcY').type('0');
    cy.get('#start-button').click();
    cy.get('#srcXFeedback').should('have.text', 'coordinate occupied by obstacle');
    /* ==== End Cypress Studio ==== */
  });
})
  
  
  