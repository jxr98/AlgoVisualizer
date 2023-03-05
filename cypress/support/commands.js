// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("dragTo", { prevSubject: "element" }, (subject, targetEl) => {
        cy.wrap(subject).trigger("dragstart");
        cy.get(targetEl).trigger("drop");
    }
);