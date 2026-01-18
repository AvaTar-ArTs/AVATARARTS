/* global cy */

/// <reference types="cypress" />

/*
This file contains the tests for the Search Page of the Comicbook.AI application.
Primarily designed to test the functionality and rendering of the Search Page.

Tests include:
1. Search Page Loads
2. Search Input Exists
3. Table Exists
4. Filter Files based on Search Term
5. Navigate to File URL when Download Link is Clicked
*/

// Test 1: To see if the Search Page loads
describe('Search Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/search'); 
    });
    
    // Test 2: To see if the Search Input exists
    it('renders the search input', () => {
      cy.get('.search-input').should('be.visible');
    });
  
    // Test 3: To see if the Table exists
    it('renders the table', () => {
      cy.get('.table').should('be.visible');
    });
    
    // Test 4: To see if the files are filtered based on the search term
    it('filters files based on search term', () => {
        cy.get('.search-input').type('title1'); 
        cy.get('.table tbody tr', { timeout: 10000 }).each(($el) => { 
          cy.wrap($el).should('contain.text', 'title1'); 
        });
      });
      
    // Test 5: To see if the file URL is navigated when the download link is clicked
    it('navigates to file url when download link is clicked', () => {
      cy.get('.table tbody tr a').first().then(($a) => {
        const href = $a.prop('href');
        cy.request(href).its('status').should('eq', 200);
      });
    });
  });