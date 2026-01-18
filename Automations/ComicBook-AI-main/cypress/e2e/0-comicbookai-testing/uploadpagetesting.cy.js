/* global cy */

/// <reference types="cypress" />

/*
This file contains the tests for the Upload Page of the Comicbook.AI application.
Primarily designed to test the functionality and rendering of the Upload Page.

Tests include:
1. Upload Page Loads
2. Upload Button Exists
3. File Input Exists
4. Title Input Exists
5. Form Submission Works
*/


// Test 1: To see if the Upload Page loads
describe('Upload Page Testing', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/upload') 
    });
    
    it('successfully loads', () => {
      cy.url().should('include', '/upload');
    });
    
    // Test 2: To see if the Upload Button exists
    it('has a visible Upload button', () => {
      cy.get('button').contains('Upload').should('be.visible');
    });
  
    // Test 3: To see if the File Input exists
    it('has a file input that can receive a file', () => {
      cy.get('input[type="file"]').attachFile('cars.jpeg'); 
    });
    
    // Test 4: To see if the Title Input exists
    it('has a title input that can receive text', () => {
      cy.get('input[placeholder="Enter Title"]').type('Test Title').should('have.value', 'Test Title');
    });
    
    // Test 5: To see if the form submission works
    it('can submit the form', () => {
      cy.get('input[type="file"]').attachFile('cars.jpeg'); 
      cy.get('input[placeholder="Enter Title"]').type('Test Title');
      cy.get('button').contains('Upload').click();
    });
  });