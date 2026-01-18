/* global cy */

/// <reference types="cypress" />

/*
This file contains the basic tests for the Comicbook.AI application.
Primarily designed to test the basic functionality and rendering of the application.

Tests include:
1. Homepage loads
2. Comicbook.AI loads properly
3. Navigation bar exists and is loaded properly
4. ImageGenerator exists and is clickable
5. ImageGeneratorPrompt exists and is clickable and has default value
6. Footer exists and has correct text
7. Header exists and has correct text
*/

// Test 1: To see if the site loads
describe('Homepage loads', () => {
    it('successfully loads', () => {
      cy.visit('http://localhost:5173/') // change to your url
    })
  })

// Test 2: To see if the site loads and title is present
describe("Comicbook.AI loads properly", () => {
    // Executed before each test
    beforeEach(() => {
      cy.visit("http://localhost:5173/");
    });
  
  
    it("Loads basic interface successfully", () => {
        cy.get("h1").should("have.text", "Comic.AIOpenAI Image Generator");
      });
  });

  // Test 3: To see if navigation bar exists and is loaded properly
  describe('Navigation bar', () => {
    it('exists', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('.navbar').should('exist') 
    });
  });

  // Test 4: To see if the image generator exists and is clickable
  describe('ImageGenerator', () => {
    it('exists', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('.flex').should('exist') 
    });
  
    it('Generate Images button is clickable', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('.flex').within(() => {
        cy.get('button').contains('Generate Images').should('exist').click()
      });
    });
  });

  // Test 5: To see if the image generator prompt exists and is clickable and has default value
  describe('ImageGeneratorPrompt', () => {
    it('exists', () => {
      cy.visit('http://localhost:5173/') // change to your url
      cy.get('input').should('exist')
      cy.get('input').should('have.value',  'A cute baby sea otter')
    });
  });

  // Test 6: To see if Footer exists and has correct text
  describe('Footer', () => {
    it('exists', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('footer').should('exist')
    });
  
    it('contains correct text', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('footer').within(() => {
        cy.get('p').should('contain', '@Comic.AI')
      });
    });
  });

  // Test 7: To see if Header exists and has correct text
  describe('Header', () => {
    it('exists', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('header').should('exist')
    });
  
    it('contains correct text', () => {
      cy.visit('http://localhost:5173/') 
      cy.get('header').within(() => {
        cy.get('h1').should('contain', 'Comic.AI')
      });
    });
  });


  