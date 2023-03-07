/// <reference types="Cypress" />

// test suite
describe('Home page website', () => {
  beforeEach(()=>{
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
  })

  // another test case
  it('check links', () => {
    cy.get('[href="html/bfs.html"]')
    cy.get('[href="html/dfs.html"]')
  })

  // test extension
  it('test d3 svg graph', ()=>
  {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[href="html/bfs.html"]').click();
    cy.get('svg:first').click(100, 100);
    cy.get('svg:first').click(500, 500);
    /* ==== End Cypress Studio ==== */

    // wait for force simulation to move nodes apart
    cy.wait(5000)
    
    // let targetNode = {}
    // cy.get('#c1').parent().then(($input) => {
    //   targetNode.cx = $input.attr('cx');
    //   targetNode.cy = $input.attr('cy');
    //
    //   cy.log(targetNode.cx);
    //   cy.log(targetNode.cy);
    // });
    //
    // let currentNode = {}
    // cy.get('#c0').parent().then(($input) => {
    //   currentNode.cx = $input.attr('cx');
    //   currentNode.cy = $input.attr('cy');
    //   cy.log(currentNode.cx);
    //   cy.log(currentNode.cy);
    // });
    //
    // let dx = targetNode.cx - currentNode.cx;
    // let dy = targetNode.cy - currentNode.cy;

    // check the shortest path
    cy.get('textarea:first').type('0 1');
    cy.get('[id=start-button]').click();
    var times=1;
    cy.on('window:alert',(t)=>{
      if(times==1){
        expect(t).to.equal('From vertex 0 to vertex 1 are not connected');
        times++;
      }else{
        // when c0 and c1 are connected
        expect(t).to.equal('From vertex 0 to vertex 1:  0 -> 1');
        times++;
      }
    })

    // connect the first two nodes
    cy.get('#c0').trigger('mouseover').trigger('mousedown',{ buttons: 1 }).trigger('mouseout',{ buttons: 1 });
    cy.get('#c1').trigger('mouseover',{ buttons: 1 });

  })
})


