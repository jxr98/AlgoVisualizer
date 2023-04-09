/// <reference types="Cypress" />

// test suite
describe('heap page', () => {
  beforeEach(()=>{
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
    cy.get('#treeNav > .nav-link').click();
    cy.get('#treeNav > .dropdown-menu > li > .dropdown-item').click();
  })


  it('maxheap', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#message-box').click();
    cy.get('#create-tree > h2').click();
    cy.get('#max-heap').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#message-box').click();
    cy.get('#create-tree > h2').click();
    cy.get('#max-heap').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('empty input', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#max-heap').click();
    cy.get('#logPanel').should('have.value', '// Logs:\nplease check input data');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('bad input', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#message-box').click();
    cy.get('#min-heap').click();
    cy.get('#logPanel').should('have.value', '// Logs:\nplease check input data');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('reset', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#reset-button').click();
    /* ==== End Cypress Studio ==== */
  });
})
  
  
  