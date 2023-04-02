/// <reference types="Cypress" />

// test suite
describe('Home page website', () => {
  beforeEach(()=>{
    cy.visit('https://jxr98.github.io/AlgoVisualizer/')
  })

  it('verify links exist', () => {
    cy.get('[href="html/bfs.html"]')
    cy.get('[href="html/dfs.html"]')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('travel_to_BFS', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#graphNav > .nav-link').click();
    cy.get('#graphNav > .dropdown-menu > :nth-child(1) > .dropdown-item').click();
    /* ==== End Cypress Studio ==== */
  });

  // test extension
  it('test d3 svg graph', ()=>
  {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#graphNav > .nav-link').click();
    cy.get('#graphNav > .dropdown-menu > :nth-child(1) > .dropdown-item').click();
    cy.get('svg:first').click(0, 0);
    cy.get('svg:first').click(0, 0);
    /* ==== End Cypress Studio ==== */

    // wait for force simulation to move nodes apart
    // cy.wait(3000)

    // check the shortest path
    cy.get('#formControlTextarea2').type('0 1');
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


