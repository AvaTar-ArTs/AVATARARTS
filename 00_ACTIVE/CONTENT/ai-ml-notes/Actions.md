Actions

https://b10bde89-a333-42e4-8fee-7d5dc4ea2581.mock.pstmn.io

{
  "openapi": "3.1.0",
  "info": {
    "title": "YouTube Shorts Title Generator",
    "description": "API for generating catchy and trendy titles for YouTube Shorts with iterative feedback for refinement.",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://run.mocky.io/v3/36aaf2dd-2a3e-40e2-a7d2-59e44c6034e8"
    }
  ],
  "paths": {
    "/shorts": {
      "post": {
        "operationId": "generateYouTubeShortsTitle",
        "summary": "Generate YouTube Shorts Title",
        "description": "Generate a catchy and trendy title for YouTube Shorts with iterative feedback for refinement.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "topic": {
                    "type": "string",
                    "description": "The main topic or theme of the YouTube Short."
                  },
                  "style": {
                    "type": "string",
                    "description": "Optional stylistic guideline or tone for the title."
                  },
                  "iterations": {
                    "type": "number",
                    "description": "Number of iterative refinements to improve title based on feedback."
                  }
                },
                "required": ["topic"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Title generated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The generated YouTube Shorts title."
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}