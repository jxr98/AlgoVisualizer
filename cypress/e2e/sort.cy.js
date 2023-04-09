/// <reference types="Cypress" />

// test suite
describe('sort page', () => {
  beforeEach(()=>{
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
    cy.get('#sortingNav > .nav-link').click();
    cy.get('#sortingNav > .dropdown-menu > li > .dropdown-item').click();
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('speed ctrl', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#speedCtrl').click();
    cy.get('#speedDisplay').should('have.text', '300ms');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('error input', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#insertionSortArrayInput').clear('-');
    cy.get('#insertionSortArrayInput').type('-');
    cy.get('#panelsStayOpen-collapseOne > .accordion-body > h2').click();
    cy.get('#insertionSortArrayInputFeedback').should('have.text', '\n                                    comma delimited integers only\n                                ');
    /* ==== End Cypress Studio ==== */
  });

})
    
    
    