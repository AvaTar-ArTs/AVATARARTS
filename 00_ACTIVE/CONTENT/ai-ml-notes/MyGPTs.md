## MyGPTs

---



#### YouTube Shorts Content Generator

---



###### Creative Typography and Visual Desig

---

```python
{
  "openapi": "3.1.0",
  "info": {
    "title": "Creative Typography and Visual Design API",
    "description": "API for organizing and generating artistic typography, font styles, color schemes, and design elements based on creative narrative themes.",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://811ad973-1352-4e35-9645-e48cb0804a58.mock.pstmn.io"
    }
  ],
  "paths": {
    "/generate-font-style": {
      "post": {
        "operationId": "GenerateFontStyle",
        "summary": "Generate font styles based on narrative and visual theme",
        "description": "Generates creative typography, font styles, and visual designs based on user input for narrative, character, or theme. Allows customization of font size, color scheme, and alignment.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "narrative_theme": {
                    "type": "string",
                    "description": "The narrative theme or tone (e.g., heroic, dystopian, whimsical)."
                  },
                  "font_style": {
                    "type": "string",
                    "enum": [
                      "Bold serif, high-contrast",
                      "Playful, handwritten",
                      "Vintage, serif-heavy",
                      "Gothic, bold",
                      "Clean sans-serif, futuristic",
                      "Italic, serif-light",
                      "Distressed, Grunge",
                      "Modern, clean sans-serif"
                    ],
                    "description": "Choose the font style that aligns with the narrative theme."
                  },
                  "color_scheme": {
                    "type": "string",
                    "description": "Define the color scheme for the typography (e.g., Red, Black, Gold for 'Dark Heroics')."
                  },
                  "alignment": {
                    "type": "string",
                    "enum": [
                      "Left",
                      "Right",
                      "Center",
                      "Justified"
                    ],
                    "description": "Set the alignment for the text based on the visual design."
                  },
                  "font_size": {
                    "type": "string",
                    "enum": [
                      "Small",
                      "Medium",
                      "Large"
                    ],
                    "description": "Choose the font size to match the intensity or prominence of the text."
                  }
                },
                "required": [
                  "narrative_theme",
                  "font_style",
                  "color_scheme",
                  "alignment",
                  "font_size"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Typography and design generated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "font_style": {
                      "type": "string",
                      "description": "The font style generated."
                    },
                    "color_scheme": {
                      "type": "string",
                      "description": "The color scheme applied to the typography."
                    },
                    "alignment": {
                      "type": "string",
                      "description": "The alignment for the text."
                    },
                    "font_size": {
                      "type": "string",
                      "description": "The font size applied."
                    },
                    "example_usage": {
                      "type": "string",
                      "description": "Description of how the typography can be used in scenes or narratives."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/list-font-options": {
      "get": {
        "operationId": "ListFontOptions",
        "summary": "List available font styles, colors, and design elements",
        "description": "Provides a list of all available font styles, color schemes, and design elements to help users decide on the right creative elements for their project.",
        "responses": {
          "200": {
            "description": "List of font styles and design options.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "font_style": {
                        "type": "string",
                        "description": "Font style name and description."
                      },
                      "example_usage": {
                        "type": "string",
                        "description": "Suggested usage of the font style."
                      },
                      "color_scheme": {
                        "type": "string",
                        "description": "Primary colors used in the font style."
                      },
                      "alignment": {
                        "type": "string",
                        "description": "Suggested alignment for the text."
                      },
                      "font_size": {
                        "type": "string",
                        "description": "Suggested size for the text."
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/generate-complete-design": {
      "post": {
        "operationId": "GenerateCompleteDesign",
        "summary": "Generate a complete typography and design package",
        "description": "Creates a full design package for a project based on a creative theme, including font style, color scheme, alignment, and visual design elements.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "narrative_theme": {
                    "type": "string",
                    "description": "The creative theme or story focus (e.g., 'Dark Heroics', 'Mystic Comic')."
                  },
                  "character_design": {
                    "type": "object",
                    "properties": {
                      "character_name": {
                        "type": "string",
                        "description": "Name of the character being designed for."
                      },
                      "character_style": {
                        "type": "string",
                        "description": "Define the character’s aesthetic or visual style (e.g., futuristic, medieval)."
                      }
                    }
                  },
                  "scene_design": {
                    "type": "object",
                    "properties": {
                      "scene_location": {
                        "type": "string",
                        "description": "Describe the setting or location of the scene (e.g., cityscape, enchanted forest)."
                      },
                      "visual_effects": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        },
                        "description": "List of visual effects (e.g., glowing eyes, energy aura) to be applied in the scene."
                      }
                    }
                  }
                },
                "required": [
                  "narrative_theme",
                  "character_design",
                  "scene_design"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Complete design generated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "font_style": {
                      "type": "string",
                      "description": "Generated font style."
                    },
                    "color_scheme": {
                      "type": "string",
                      "description": "Color scheme applied to the design."
                    },
                    "visual_effects": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "List of applied visual effects."
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
```





---

###### Advanced Artistic Customization API

```python
{
  "openapi": "3.1.0",
  "info": {
    "title": "Advanced Artistic Customization API",
    "description": "API for highly personalized control over comic and graphic novel art, allowing users to customize genres, moods, character traits, auto-enhancements, and modular scene composition. The API supports DiGiTaL DiVe, optimized for generating dark and moody themes, whimsical illustrations, and detailed comic styles.",
    "version": "v2.0.0"
  },
  "servers": [
    {
      "url": "https://5bec0115-cbaa-454d-b421-be45c0cc01e1.mock.pstmn.io"
    }
  ],
  "paths": {
    "/artsy": {
      "post": {
        "operationId": "CustomizeArt",
        "summary": "Customize Artistic Styles, Characters, and Moods",
        "description": "Provide extensive control over artistic genres, character traits, moods, modular scene design, and automatic enhancements.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "genre": {
                    "type": "string",
                    "description": "Select the artistic genre (e.g., noir, retro, cyberpunk, futuristic, surrealism, fantasy)."
                  },
                  "mood_shift": {
                    "type": "string",
                    "description": "Apply mood-based filters (e.g., dark, whimsical, intense, melancholic, hopeful) to automatically shift the color palette, lighting, and shadows based on emotional tone."
                  },
                  "character_design": {
                    "type": "object",
                    "description": "Define detailed character traits and customize their appearance.",
                    "properties": {
                      "costume": {
                        "type": "string",
                        "description": "Choose costume style (steampunk, medieval, modern, cyber, etc.)."
                      },
                      "expression": {
                        "type": "string",
                        "description": "Character expressions (happy, angry, determined, fearful, etc.)."
                      },
                      "props": {
                        "type": "string",
                        "description": "Add props or accessories (e.g., sword, gadgets, mystical artifacts)."
                      },
                      "pose": {
                        "type": "string",
                        "description": "Define character pose (dynamic, still, battle-ready, contemplative, etc.)."
                      },
                      "enhancements": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "glowing eyes",
                            "light trails",
                            "shadow effects",
                            "energy aura",
                            "weather effects"
                          ],
                          "description": "Add special effects or enhancements to characters."
                        }
                      }
                    }
                  },
                  "scene_composition": {
                    "type": "object",
                    "description": "Define the scene elements for both foreground and background to create modular, dynamic compositions.",
                    "properties": {
                      "foreground_elements": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        },
                        "description": "Define key elements in the foreground (e.g., trees, vehicles, magical portals)."
                      },
                      "background_elements": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        },
                        "description": "Define the background elements (e.g., futuristic city, enchanted forest, mountains)."
                      },
                      "lighting_style": {
                        "type": "string",
                        "description": "Control lighting, such as high contrast, soft, neon glow, or ambient."
                      },
                      "dynamic_motion": {
                        "type": "boolean",
                        "description": "Set whether elements in the scene should appear in motion (e.g., wind-blown hair, moving water, etc.)."
                      }
                    }
                  },
                  "auto-enhancements": {
                    "type": "object",
                    "description": "Optional AI-powered auto-enhancements to improve the overall visual quality of the artwork.",
                    "properties": {
                      "color_correction": {
                        "type": "boolean",
                        "description": "Apply AI-based automatic color correction to enhance the overall image."
                      },
                      "detail_boost": {
                        "type": "boolean",
                        "description": "Boost fine details for more intricate textures and depth."
                      },
                      "noise_reduction": {
                        "type": "boolean",
                        "description": "Apply noise reduction to clean up digital noise in the image."
                      }
                    }
                  }
                },
                "required": [
                  "genre",
                  "character_design",
                  "scene_composition"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Art customization applied successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "customized_image_url": {
                      "type": "string"
                    },
                    "summary_report": {
                      "type": "object",
                      "properties": {
                        "genre": {
                          "type": "string"
                        },
                        "mood_shift": {
                          "type": "string"
                        },
                        "character_customizations": {
                          "type": "object"
                        },
                        "auto_enhancements_applied": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          }
                        }
                      },
                      "description": "Summary of the customization choices applied to the final image."
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ImageGenerationRequest": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "Title usable for print on demand: around 50-60 characters."
          },
          "keywords": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "At least 20 meaningful keywords. Skip artistic style, camera type, and setup."
          },
          "description": {
            "type": "string",
            "description": "A description close to 256 characters including relevant keywords and addressing the potential target audience."
          }
        },
        "required": ["title", "keywords", "description"]
      }
    }
  }
}

```



---

###### YouTube Shorts Title Generator

```python
{
  "openapi": "3.1.0",
  "info": {
    "title": "YouTube Shorts Title Generator",
    "description": "API for generating catchy and trendy titles for YouTube Shorts with iterative feedback for refinement.",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://5aaa7e45-aed7-431e-a74e-ca40d9db8d4e.mock.pstmn.io"
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

```



---

###### Etsy Info and Keys

```python
{
  "openapi": "3.1.0",
  "info": {
    "title": "Etsy Product Content Generator API",
    "description": "A powerful API that helps Etsy sellers create optimized content, including keywords and compelling product descriptions, to enhance their product listings.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://9288ec0c-0312-4eda-81f1-0bd3768d25a4.mock.pstmn.io",
      "description": "Mock server for Etsy Product Content Generation API"
    }
  ],
  "paths": {
    "/etsy-keys": {
      "post": {
        "summary": "Generate Targeted Etsy Keywords",
        "description": "Automatically generates optimized and targeted keywords for Etsy product listings based on the product's key features and category.",
        "operationId": "generateEtsyProductKeywords",
        "requestBody": {
          "description": "Details about the product to generate relevant keywords.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "product_features": {
                    "type": "string",
                    "description": "A detailed description of the product's key features. These features will be used as the foundation for generating keywords."
                  },
                  "category": {
                    "type": "string",
                    "description": "Optional: The specific product category on Etsy (e.g., Jewelry, Home Decor, Clothing). This helps refine and tailor the keywords more effectively."
                  }
                },
                "required": [
                  "product_features"
                ]
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "A successful response containing the generated keywords.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "keywords": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "A list of relevant and optimized keywords for the Etsy product."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: Invalid input data. Ensure that 'product_features' is provided and correctly formatted."
          }
        }
      }
    },
    "/etsy-info": {
      "post": {
        "summary": "Generate Engaging Etsy Product Descriptions",
        "description": "Creates a detailed, persuasive, and SEO-optimized product description for your Etsy listing, incorporating the product's key details and the brand's story if provided.",
        "operationId": "generateEtsyProductDescription",
        "requestBody": {
          "description": "Input product details to create an engaging description.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "product_details": {
                    "type": "string",
                    "description": "A comprehensive description of the product. Include all key information such as materials, design elements, usage, and benefits."
                  },
                  "brand_story": {
                    "type": "string",
                    "description": "Optional: The story or ethos behind the brand. Weaving this narrative into the product description can add emotional appeal and connection with potential buyers."
                  }
                },
                "required": [
                  "product_details"
                ]
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "A successful response containing the generated product description.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "description": {
                      "type": "string",
                      "description": "A persuasive and detailed product description ready for use on Etsy."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: Invalid input data. Ensure that 'product_details' is provided and correctly formatted."
          }
        }
      }
    }
  },
  "components": {
    "schemas": {}
  }
}
```



---



###### Etsy Product Content Generator API

```python
{
  "openapi": "3.1.0",
  "info": {
    "title": "Etsy Product Content Generator API",
    "description": "A powerful API that helps Etsy sellers create optimized content, including keywords and compelling product descriptions, to enhance their product listings.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://9288ec0c-0312-4eda-81f1-0bd3768d25a4.mock.pstmn.io",
      "description": "Mock server for Etsy Product Content Generation API"
    }
  ],
  "paths": {
    "/etsy-keys": {
      "post": {
        "summary": "Generate Targeted Etsy Keywords",
        "description": "Automatically generates optimized and targeted keywords for Etsy product listings based on the product's key features and category.",
        "operationId": "generateEtsyProductKeywords",
        "requestBody": {
          "description": "Details about the product to generate relevant keywords.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "product_features": {
                    "type": "string",
                    "description": "A detailed description of the product's key features. These features will be used as the foundation for generating keywords."
                  },
                  "category": {
                    "type": "string",
                    "description": "Optional: The specific product category on Etsy (e.g., Jewelry, Home Decor, Clothing). This helps refine and tailor the keywords more effectively."
                  }
                },
                "required": [
                  "product_features"
                ]
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "A successful response containing the generated keywords.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "keywords": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "A list of relevant and optimized keywords for the Etsy product."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: Invalid input data. Ensure that 'product_features' is provided and correctly formatted."
          }
        }
      }
    },
    "/etsy-info": {
      "post": {
        "summary": "Generate Engaging Etsy Product Descriptions",
        "description": "Creates a detailed, persuasive, and SEO-optimized product description for your Etsy listing, incorporating the product's key details and the brand's story if provided.",
        "operationId": "generateEtsyProductDescription",
        "requestBody": {
          "description": "Input product details to create an engaging description.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "product_details": {
                    "type": "string",
                    "description": "A comprehensive description of the product. Include all key information such as materials, design elements, usage, and benefits."
                  },
                  "brand_story": {
                    "type": "string",
                    "description": "Optional: The story or ethos behind the brand. Weaving this narrative into the product description can add emotional appeal and connection with potential buyers."
                  }
                },
                "required": [
                  "product_details"
                ]
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "A successful response containing the generated product description.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "description": {
                      "type": "string",
                      "description": "A persuasive and detailed product description ready for use on Etsy."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: Invalid input data. Ensure that 'product_details' is provided and correctly formatted."
          }
        }
      }
    }
  },
  "components": {
    "schemas": {}
  }
}
```



---

###### YouTube Shorts Content Generator API

```python
{
  "openapi": "3.1.0",
  "info": {
    "title": "YouTube Shorts Content Generator API",
    "description": "API for generating optimized YouTube Shorts content, including catchy titles, dynamic descriptions, and detailed images for Shorts.",
    "version": "v1.0.0"
  },
  "servers": [
    {
     }
  ],
  "paths": {
    "/shortimage": {
      "post": {
        "operationId": "GenerateImage",
        "summary": "Generate YouTube Shorts Image",
        "description": "Always create a series of vibrant and alive images with typography that reflects the content and context. Each capturing the essence with an edgy and geeky style. Bring to life through imagery that reflects the emotional and thematic content.t",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "prompt": {
                    "type": "string",
                    "description": "A detailed descriptive prompt that guides the image generation process."
                  },
                  "aspect_ratio": {
                    "type": "string",
                    "description": "The aspect ratio of the generated image. Default is 9:16."
                  },
                  "background": {
                    "type": "string",
                    "description": "The background setting of the image. Default is solid color."
                  },
                  "resolution": {
                    "type": "string",
                    "description": "The resolution of the image. Default is 1080x1920 pixels."
                  },
                  "callback_url": {
                    "type": "string",
                    "description": "Optional. If specified, the service will send the generated image to this URL asynchronously."
                  }
                },
                "required": [
                  "prompt"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Image generated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "image_url": {
                      "type": "string",
                      "description": "The URL of the generated image."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/shortstitle": {
      "post": {
        "operationId": "GenerateYouTubeShortsTitle",
        "summary": "Generate YouTube Shorts Title",
        "description": "Generate a catchy and trendy title for YouTube Shorts with iterative feedback for refinement.",
        "requestBody": {
          "required": true,
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
                    "description": "Number of iterative refinements to improve the title based on feedback."
                  }
                },
                "required": [
                  "topic"
                ]
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
    },
    "/shortsinfo": {
      "post": {
        "operationId": "GenerateYouTubeShortsDescription",
        "summary": "Generate YouTube Shorts Description",
        "description": "Generate a dynamic description for YouTube Shorts, allowing for content updates and refinements.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "content": {
                    "type": "string",
                    "description": "Core content or points to include in the description."
                  },
                  "update_frequency": {
                    "type": "string",
                    "enum": [
                      "low",
                      "medium",
                      "high"
                    ],
                    "description": "How frequently content updates or refinements are expected."
                  }
                },
                "required": [
                  "content"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Description generated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "description": {
                      "type": "string",
                      "description": "The generated YouTube Shorts description."
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
```



---



---