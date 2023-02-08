/// <reference types="Cypress" />

// test suite
describe('Home page website', () => {

  // a test case
  it('Visits the deployed site', () => {
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
  })

  // another test case
  it('check links', () => {
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
    cy.get('[href="html/bfs.html"]')
    cy.get('[href="html/dfs.html"]')
  })

})


