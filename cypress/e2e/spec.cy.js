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

  // test extension
  it('test d3 svg graph', ()=>
  {
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[href="html/bfs.html"]').click();
    cy.get('svg').click(100, 100);
    cy.get('svg').click(500, 500);
    /* ==== End Cypress Studio ==== */

    // wait for force simulation to move nodes apart
    cy.wait(3000)
    
    let targetNode = {}
    cy.get('#c1').parent().then(($input) => {
      targetNode.cx = $input.attr('cx');
      targetNode.cy = $input.attr('cy');

      cy.log(targetNode.cx);
      cy.log(targetNode.cy);
    });

    let currentNode = {}
    cy.get('#c0').parent().then(($input) => {
      currentNode.cx = $input.attr('cx');
      currentNode.cy = $input.attr('cy');
      cy.log(currentNode.cx);
      cy.log(currentNode.cy);
    });

    let dx = targetNode.cx - currentNode.cx;
    let dy = targetNode.cy - currentNode.cy;

    // cy.window().then(window => {
    //   cy.get('#c0').eq(0)
    //     .trigger('mousedown', { which: 1, force: true, view: window })
    //     //.trigger('mousemove', {clientX: 300, clientY: 500, force: true})
    //     //.trigger('mouseup', {position: 'top', force: true})
    // })
    
    // cy.get('#c0')
    // .trigger('mousedown', { which: 1, force: true })
    // .trigger('mousemove', { which: 1, force: true, pageX: dx, pageY: dy })
    // .trigger('mouseup', {force: true});

  })

})


