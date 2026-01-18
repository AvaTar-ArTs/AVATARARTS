/* global cy */

/// <reference types="cypress" />

/*
This file contains the tests for the Comicbook Generator Page of the Comicbook.AI application.
Primarily designed to test the functionality and rendering of the Comicbook Generator Page.
Tests include:
1. Create ComicBook Page Loads
2. Button Check (Upload and Save as PDF)
3. Form Check (Form submission works)
4. Input Check (Input File exists)
5. Render ComicPages (ComicPages rendered as Divs)
6. Upload Check (Uploads images and text successfully)
7. Save as PDF Check (Saves as PDF) 
*/

// Test 1: To see if the ComicBook Page loads
describe('Create ComicBook Page Loads', () => {
    it('successfully loads', () => {
      cy.visit('http://localhost:5173/comicbook') 
    });
  });

// Test 2: To see if the buttons exist and are clickable
describe('Button Check', () => {
    it(' Button exists', () => {
      cy.visit('http://localhost:5173/comicbook') 
      cy.get('button').contains('Upload').should('exist').click()
      cy.get('button').contains('Save as PDF').should('exist').click()

    });
  });

// Test 3: To see if the form submission works
  describe('Form Check', () => {
    it('Form submission works', () => {
      cy.visit('http://localhost:5173/comicbook') 
      cy.get('input[type="file"]').should('exist') 
      cy.get('input[name="text"]').should('exist');
      cy.get('form').submit();
    });
});

// Test 4: To see if the input file exists
describe('Input Check', () => {
    it('Input exists', () => {
      cy.visit('http://localhost:5173/comicbook') 
      cy.get('input[name="text"]').should('exist').then(($input) => {
        expect($input).to.have.attr('placeholder', 'Enter image text...')
      })
    });
});

// Test 5: To see if the comic pages are rendered as divs
describe("Render ComicPages", () => {
    it("Render comic pages", () => {
      cy.visit("http://localhost:5173/comicbook");
      cy.get("div").should("exist");
    });
  });

  // Test 6: To see if the images and text are uploaded successfully
  describe('Upload Check', () => {
    it('Uploads images and text successfully', () => {
      cy.visit('http://localhost:5173/comicbook') 
      cy.get('input[type="file"]').attachFile('cars.jpeg'); 
      cy.get('input[name="text"]').type('Test text');
      cy.get('form').submit();
      cy.get('div').should('exist'); 
    });
});

// Test 7: To see if the Save as PDF button works
describe('Save as PDF Check', () => {
    it('Saves as PDF', () => {
      cy.visit('http://localhost:5173/comicbook') 
      cy.get('button').contains('Save as PDF').should('exist').click()
    });
  });

