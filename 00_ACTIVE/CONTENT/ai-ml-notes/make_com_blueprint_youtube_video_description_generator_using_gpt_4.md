---
title: Make.com Blueprint: YouTube Video Description Generator Using GPT-4
date: 2025-04-29
source: https://www.perplexity.ai/search/make-com-blueprint-youtube-vid-9Pf.475jRaSQfPxdbAja.A
---

**Assistant:** Here’s a formatted and improved version of your query, focusing on clarity, organization, and readability:
## Query: Format and Improve
## Current Date
### Tuesday, April 08, 2025, 7:22 AM EDT
## Language Instruction
### Always respond in English unless explicitly instructed otherwise.
## File Information
### File Name: blueprint.json
### Attached File: [Link to blueprint.json](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/15662481/a700a022-9b27-42f7-b730-ad1efabdd122/blueprint.json)
## Overview of the Blueprint File
## **Name**
"Working with HTML and tone of voice"
## **Flow Details**
The flow consists of multiple modules that interact with Google Sheets and OpenAI GPT-3. Below is a breakdown of the key modules:
## **Module 1: Google Sheets - Watch Rows**
### ID: 1
### Module: `google-sheets:watchRows`
### Version: 2
## **Parameters**
- **From:** Drive
- **Mode:** Select
- **Limit:** 1
- **Sheet ID:** Blad1
- **Spreadsheet ID:** (Empty)
- **Table First Row:** A1:Z1
- **Includes Headers:** True
- **Value Render Option:** FORMATTED_VALUE
- **Date-Time Render Option: FORMATTED_STRING**
## **Metadata**
Includes designer coordinates (`x: 0`, `y: 0`) and parameter restoration details such as labels for headers, spreadsheet ID, and connection type.
## **Module 2: OpenAI GPT-3 - Create Completion**
### ID: 2
### Module: `openai-gpt-3:CreateCompletion`
### Version: 1
## **Parameters**
- **Connection ID: 1541333**
## **Mapper Details**
- **Model:** gpt-3.5-turbo
- **Select Mode:** Chat
- **Messages:**
```text
Role: User
Content:
Topic: {{1.`0`}}
Language: English
Create a short SEO article outline on the topic with 7 headings. Don't include a conclusion. Use roman numerals for the headings. Only output the headings.
```
- **Max Tokens:** 2048
- **Temperature: 0.8**
## **Metadata**
Designer coordinates (`x: 300`, `y: 0`) and restoration details for model selection, message content, and connection.
## **Module 11: OpenAI GPT-3 - Generate Image**
### ID: 11
### Module: `openai-gpt-3:GenerateImage`
### Version: 1
## **Parameters**
- **Connection ID: 1541333**
## **Mapper Details**
- **Number of Images (n):** 1
- **Size:** 512x512
- **Prompt:** {{1.`0`}}
- **Response Format: URL**
## **Metadata**
Designer coordinates (`x: 598`, `y: 0`) and restoration details for prompt validation, size options (256x256, 512x512, etc.), and response formats.
## Additional Modules for Content Creation
## Module IDs:
- Module ID `4`: Focuses on writing content for heading I.
- Module ID `12`: Focuses on writing content for heading II.
- Module ID `13`: Focuses on writing content for heading III.
Each module uses the following parameters:
- Model: gpt-3.5-turbo
- Select Mode: Chat
- Messages:
```text
Outline:
{{2.choices[].message.content}}
Language: English
Write a 500-word piece on only heading [I/II/III] in a conversational tone and engaging manner.
```
## Output Requirements:
Content should use HTML formatting:
- No `&lt;h1&gt;` tags.
- Include headings (`&lt;h2&gt;`, `&lt;h3&gt;`), bold text (`&lt;b&gt;`), unordered lists (`&lt;ul&gt;`), and ordered lists (`&lt;ol&gt;`).
- Accessible language with authoritative advice.
## Improvements Applied:
- Organized the flow into clear sections (modules, parameters, metadata).
- Used consistent formatting for readability.
- Highlighted key instructions (e.g., HTML output requirements).
- Provided clarity by summarizing repetitive elements.
Let me know if further refinements are needed!

---

**Assistant:** ## Enhanced Make.com Blueprint: "Working with HTML and Tone of Voice"
Here's a refined version of your Make.com blueprint, designed for improved clarity and organization.
```json
{
"name": "Working with HTML and tone of voice",
"flow": [
{
"id": 1,
"module": "google-sheets:watchRows",
"version": 2,
"parameters": {
"from": "drive",
"mode": "select",
"limit": 1,
"sheetId": "Blad1",
"__IMTCONN__": 1541283,
"spreadsheetId": "",
"tableFirstRow": "A1:Z1",
"includesHeaders": true,
"valueRenderOption": "FORMATTED_VALUE",
"dateTimeRenderOption": "FORMATTED_STRING"
},
"mapper": {},
"metadata": {
"designer": {
"x": 0,
"y": 0
},
"restore": {
"parameters": {
"from": {
"label": "My Drive"
},
"mode": {
"label": "Search by path"
},
"sheetId": {
"label": "Blad1"
},
"__IMTCONN__": {
"data": {
"scoped": "true",
"connection": "google"
},
"label": ""
},
"spreadsheetId": {
"path": [
"Tron"
]
},
"includesHeaders": {
"label": "Yes"
},
"valueRenderOption": {
"mode": "chose",
"label": "Formatted value"
},
"dateTimeRenderOption": {
"mode": "chose",
"label": "Formatted string"
}
},
"parameters": [
{
"name": "__IMTCONN__",
"type": "account:google",
"label": "Connection",
"required": true
},
{
"name": "mode",
"type": "select",
"label": "Search Method",
"required": true,
"validate": {
"enum": [
"select",
"fromAll",
"map"
]
}
},
{
"name": "includesHeaders",
"type": "select",
"label": "Table contains headers",
"required": true,
"validate": {
"enum": [
true,
false
]
}
},
{
"name": "limit",
"type": "uinteger",
"label": "Limit",
"required": true
},
{
"name": "valueRenderOption",
"type": "select",
"label": "Value render option",
"validate": {
"enum": [
"FORMATTED_VALUE",
"UNFORMATTED_VALUE",
"FORMULA"
]
}
},
{
"name": "dateTimeRenderOption",
"type": "select",
"label": "Date and time render option",
"validate": {
"enum": [
"SERIAL_NUMBER",
"FORMATTED_STRING"
]
}
},
{
"name": "from",
"type": "select",
"label": "Drive",
"required": true,
"validate": {
"enum": [
"drive",
"share",
"team"
]
}
},
{
"name": "spreadsheetId",
"type": "file",
"label": "Spreadsheet ID",
"required": true
},
{
"name": "sheetId",
"type": "select",
"label": "Sheet Name",
"required": true
},
{
"name": "tableFirstRow",
"type": "text",
"label": "Row with headers",
"required": true
}
],
"interface": [
{
"name": "__ROW_NUMBER__",
"type": "number",
"label": "Row number"
},
{
"name": "__SPREADSHEET_ID__",
"type": "text",
"label": "Spreadsheet ID"
},
{
"name": "__SHEET__",
"type": "text",
"label": "Sheet"
},
{
"name": "0",
"type": "text",
"label": "Title (A)"
},
{
"name": "1",
"type": "text",
"label": "Keyword (B)"
},
{
"name": "2",
"type": "text",
"label": "Slug (C)"
},
{
"name": "3",
"type": "text",
"label": "Excerpt (D)"
},
{
"name": "4",
"type": "text",
"label": "Category (E)"
},
{
"name": "5",
"type": "text",
"label": "Featured image (F)"
},
{
"name": "6",
"type": "text",
"label": "(G)"
},
{
"name": "7",
"type": "text",
"label": "(H)"
},
{
"name": "8",
"type": "text",
"label": "(I)"
},
{
"name": "9",
"type": "text",
"label": "(J)"
},
{
"name": "10",
"type": "text",
"label": "(K)"
},
{
"name": "11",
"type": "text",
"label": "(L)"
},
{
"name": "12",
"type": "text",
"label": "(M)"
},
{
"name": "13",
"type": "text",
"label": "(N)"
},
{
"name": "14",
"type": "text",
"label": "(O)"
},
{
"name": "15",
"type": "text",
"label": "(P)"
},
{
"name": "16",
"type": "text",
"label": "(Q)"
},
{
"name": "17",
"type": "text",
"label": "(R)"
},
{
"name": "18",
"type": "text",
"label": "(S)"
},
{
"name": "19",
"type": "text",
"label": "(T)"
},
{
"name": "20",
"type": "text",
"label": "(U)"
},
{
"name": "21",
"type": "text",
"label": "(V)"
},
{
"name": "22",
"type": "text",
"label": "(W)"
},
{
"name": "23",
"type": "text",
"label": "(X)"
},
{
"name": "24",
"type": "text",
"label": "(Y)"
},
{
"name": "25",
"type": "text",
"label": "(Z)"
]
,
"advanced": true
}
},
{
"id": 2,
"module": "openai-gpt-3:CreateCompletion",
"version": 1,
"parameters": {
"__IMTCONN__": 1541333
},
"mapper": {
"model": "gpt-3.5-turbo",
"select": "chat",
"messages": [
{
"role": "user",
"content": "Topic: {{1.`0`}}\nLanguage: English\nCreate a short SEO article outline on the topic with 7 headings. Don't include a conclusion. Use roman numerals for the headings. Only output the headings."
}
],
"max_tokens": "2048",
"temperature": "0.8"
},
"metadata": {
"designer": {
"x": 300,
"y": 0
},
"restore": {
"expect": {
"echo": {
"mode": "chose"
},
"model": {
"mode": "chose",
"label": "gpt-3.5-turbo"
},
"select": {
"label": "Create a Chat Completion"
},
"messages": {
"mode": "chose",
"items": [
{
"role": {
"mode": "chose",
"label": "User"
}
}
]
},
"additionalParameters": {
"mode": "chose"
}
},
"parameters": [
{
"name": "__IMTCONN__",
"type": "account:openai-gpt-3",
"label": "Connection",
"required": true
}
],
"expect": [
{
"name": "select",
"type": "select",
"label": "Select Method",
"required": true,
"validate": {
"enum": [
"prompt",
"chat"
]
}
},
{
"name": "max_tokens",
"type": "number",
"label": "Max Tokens"
},
{
"name": "temperature",
"type": "number",
"label": "Temperature"
},
{
"name": "top_p",
"type": "number",
"label": "Top p"
},
{
"name": "n_completions",
"type": "number",
"label": "N"
},
{
"name": "echo",
"type": "boolean",
"label": "Echo"
},
{
"name": "additionalParameters",
"spec": [
{
"name": "key",
"type": "text",
"label": "Parameter Name",
"required": true
},
{
"name": "type",
"type": "select",
"label": "Input Type",
"options": [
{
"label": "Text",
"value": "text",
"nested": [
{
"name": "value",
"type": "text",
"label": "Parameter Value"
}
],
"default": true
},
{
"label": "Number",
"value": "number",
"nested": [
{
"name": "value",
"type": "number",
"label": "Parameter Value"
}
]
},
{
"label": "Boolean",
"value": "boolean",
"nested": [
{
"name": "value",
"type": "boolean",
"label": "Parameter Value"
}
]
},
{
"label": "Date",
"value": "date",
"nested": [
{
"name": "value",
"type": "date",
"label": "Parameter Value"
}
]
},
{
"label": "Any",
"value": "any",
"nested": [
{
"name": "value",
"type": "any",
"label": "Parameter Value"
}
]
}
],
"type": "array",
"label": "Other Input Parameters"
}
],
"name": "model",
"type": "select",
"label": "Model",
"required": true
},
{
"name": "messages",
"spec": [
{
"name": "role",
"type": "select",
"label": "Role",
"options": [
{
"label": "System",
"value": "system"
},
{
"label": "User",
"value": "user"
},
{
"label": "Assistant",
"value": "assistant"
}
],
"required": true
},
{
"name": "content",
"type": "text",
"label": "Message Content",
"required": true
}
],
"type": "array",
"label": "Messages",
"required": true
}
],
"advanced": true
}
},
{
"id": 11,
"module": "openai-gpt-3:GenerateImage",
"version": 1,
"parameters": {
"__IMTCONN__": 1541333
},
"mapper": {
"n": "1",
"size": "512x512",
"prompt": "{{1.`0`}}",
"response_format": "url"
},
"metadata": {
"designer": {
"x": 598,
"y": 0
},
"restore": {
"expect": {
"size": {
"mode": "chose",
"label": "512x512"
},
"response_format": {
"mode": "chose",
"label": "URL"
}
},
"parameters": [
{
"name": "__IMTCONN__",
"type": "account:openai-gpt-3",
"label": "Connection",
"required": true
}
],
"expect": [
{
"name": "prompt",
"type": "text",
"label": "Prompt",
"required": true,
"validate": {
"max": 1000,
"min": 0
}
},
{
"name": "size",
"type": "select",
"label": "Size",
"validate": {
"enum": [
"256x256",
"512x512",
"1024x1024"
]
}
},
{
"name": "response_format",
"type": "select",
"label": "Response Format",
"validate": {
"enum": [
"url",
"b64_json"
]
}
},
{
"name": "n",
"type": "integer",
"label": "N",
"validate": {
"max": 10,
"min": 1
}
}
]
}
},
{
"id": 4,
"module": "openai-gpt-3:CreateCompletion",
"version": 1,
"parameters": {
"__IMTCONN__": 1541333
},
"mapper": {
"model": "gpt-3.5-turbo",
"select": "chat",
"messages": [
{
"role": "user",
"content": "Outline: \n{{2.choices[].message.content}}\nLanguage: English\nWrite a 500 word piece on only heading I in a conversational tone and in an engaging and friendly manner. Make sure not to have overlap with other headings. Output using HTML tags for formatting, starting after the body. Do not output the H1. Use formatting including headings, bold, UL/OL. Be sure to use accessible language and weave in authoritative advice, making the content both informative and enjoyable for the reader."
}
],
"max_tokens": "2048",
"temperature": "0.8"
},
"metadata": {
"designer": {
"x": 900,
"y": 0
},
"restore": {
"expect": {
"echo": {
"mode": "chose"
},
"model": {
"mode": "chose",
"label": "gpt-3.5-turbo"
},
"select": {
"label": "Create a Chat Completion"
},
"messages": {
"mode": "chose",
"items": [
{
"role": {
"mode": "chose",
"label": "User"
}
}
]
},
"additionalParameters": {
"mode": "chose"
}
},
"parameters": [
{
"name": "__IMTCONN__",
"type": "account:openai-gpt-3",
"label": "Connection",
"required": true
}
],
"expect": [
{
"name": "select",
"type": "select",
"label": "Select Method",
"required": true,
"validate": {
"enum": [
"prompt",
"chat"
]
}
},
{
"name": "max_tokens",
"type": "number",
"label": "Max Tokens"
},
{
"name": "temperature",
"type": "number",
"label": "Temperature"
},
{
"name": "top_p",
"type": "number",
"label": "Top p"
},
{
"name": "n_completions",
"type": "number",
"label": "N"
},
{
"name": "echo",
"type": "boolean",
"label": "Echo"
},
{
"name": "additionalParameters",
"spec": [
{
"name": "key",
"type": "text",
"label": "Parameter Name",
"required": true
},
{
"name": "type",
"type": "select",
"label": "Input Type",
"options": [
{
"label": "Text",
"value": "text",
"nested": [
{
"name": "value",
"type": "text",
"label": "Parameter Value"
}
],
"default": true
},
{
"label": "Number",
"value": "number",
"nested": [
{
"name": "value",
"type": "number",
"label": "Parameter Value"
}
]
},
{
"label": "Boolean",
"value": "boolean",
"nested": [
{
"name": "value",
"type": "boolean",
"label": "Parameter Value"
}
]
},
{
"label": "Date",
"value": "date",
"nested": [
{
"name": "value",
"type": "date",
"label": "Parameter Value"
}
]
},
{
"label": "Any",
"value": "any",
"nested": [
{
"name": "value",
"type": "any",
"label": "Parameter Value"
}
]
}
],
"type": "array",
"label": "Other Input Parameters"
}
],
"name": "model",
"type": "select",
"label": "Model",
"required": true
},
{
"name": "messages",
"spec": [
{
"name": "role",
"type": "select",
"label": "Role",
"options": [
{
"label": "System",
"value": "system"
},
{
"label": "User",
"value": "user"
},
{
"label": "Assistant",
"value": "assistant"
}
],
"required": true
},
{
"name": "content",
"type": "text",
"label": "Message Content",
"required": true
}
],
"type": "array",
"label": "Messages",
"required": true
}
],
"advanced": true
}
},
{
"id": 12,
"module": "openai-gpt-3:CreateCompletion",
"version": 1,
"parameters": {
"__IMTCONN__": 1541333
},
"mapper": {
"model": "gpt-3.5-turbo",
"select": "chat",
"messages": [
{
"role": "user",
"content": "Outline: \n{{2.choices[].message.content}}\nLanguage: English\nWrite a 500 word piece on only heading II in a conversational tone and in an engaging and friendly manner. Make sure not to have overlap with other headings. Output using HTML tags for formatting, starting after the body. Do not output the H1. Use formatting including headings, bold, UL/OL. Be sure to use accessible language and weave in authoritative advice, making the content both informative and enjoyable for the reader."
}
],
"max_tokens": "2048",
"temperature": "0.8"
},
"metadata": {
"designer": {
"x": 1200,
"y": 0
},
"restore": {
"expect": {
"echo": {
"mode": "chose"
},
"model": {
"mode": "chose",
"label": "gpt-3.5-turbo"
},
"select": {
"label": "Create a Chat Completion"
},
"messages": {
"mode": "chose",
"items": [
{
"role": {
"mode": "chose",
"label": "User"
}
}
]
},
"additionalParameters": {
"mode": "chose"
}
},
"parameters": [
{
"name": "__IMTCONN__",
"type": "account:openai-gpt-3",
"label": "Connection",
"required": true
}
],
"expect": [
{
"name": "select",
"type": "select",
"label": "Select Method",
"required": true,
"validate": {
"enum": [
"prompt",
"chat"
]
}
},
{
"name": "max_tokens",
"type": "number",
"label": "Max Tokens"
},
{
"name": "temperature",
"type": "number",
"label": "Temperature"
},
{
"name": "top_p",
"type": "number",
"label": "Top p"
},
{
"name": "n_completions",
"type": "number",
"label": "N"
},
{
"name": "echo",
"type": "boolean",
"label": "Echo"
},
{
"name": "additionalParameters",
"spec": [
{
"name": "key",
"type": "text",
"label": "Parameter Name",
"required": true
},
{
"name": "type",
"type": "select",
"label": "Input Type",
"options": [
{
"label": "Text",
"value": "text",
"nested": [
{
"name": "value",
"type": "text",
"label": "Parameter Value"
}
],
"default": true
},
{
"label": "Number",
"value": "number",
"nested": [
{
"name": "value",
"type": "number",
"label": "Parameter Value"
}
]
},
{
"label": "Boolean",
"value": "boolean",
"nested": [
{
"name": "value",
"type": "boolean",
"label": "Parameter Value"
}
]
},
{
"label": "Date",
"value": "date",
"nested": [
{
"name": "value",
"type": "date",
"label": "Parameter Value"
}
]
},
{
"label": "Any",
"value": "any",
"nested": [
{
"name": "value",
"type": "any",
"label": "Parameter Value"
}
]
}
],
"type": "array",
"label": "Other Input Parameters"
}
],
"name": "model",
"type": "select",
"label": "Model",
"required": true
},
{
"name": "messages",
"spec": [
{
"name": "role",
"type": "select",
"label": "Role",
"options": [
{
"label": "System",
"value": "system"
},
{
"label": "User",
"value": "user"
},
{
"label": "Assistant",
"value": "assistant"
}
],
"required": true
},
{
"name": "content",
"type": "text",
"label": "Message Content",
"required": true
}
],
"type": "array",
"label": "Messages",
"required": true
}
],
"advanced": true
}
},
{
"id": 13,
"module": "openai-gpt-3:CreateCompletion",
"version": 1,
"parameters": {
"__IMTCONN__": 1541333
},
"mapper": {
"model": "gpt-3.5-turbo",
"select": "chat",
"messages": [
{
"role": "user",
"content": "Outline: \n{{2.choices[].message.content}}\nLanguage: English\nWrite a 500 word piece on only heading III in a conversational tone and in an engaging and friendly manner. Make sure not to have overlap with other headings. Output using HTML tags for formatting, starting after the body. Do not output the H1. Use formatting including headings, bold, UL/OL. Be sure to use accessible language and weave in authoritative advice, making the content both informative and enjoyable for the reader."
}
],
"max_tokens": "2048",
"temperature": "0.8"
},
"metadata": {
"designer": {
"x": 1500,
"y": 0
},
"restore": {
"expect": {
"echo": {
"mode": "chose"
},
"model": {
"mode": "chose",
"label": "gpt-3.5-turbo"
},
"select": {
"label": "Create a Chat Completion"
},
"messages": {
"mode": "chose",
"items": [
{
"role": {
"mode": "chose",
"label": "User"
}
}
]
},
"additionalParameters": {
"mode": "chose"
}
}
}
}
]
}
```

---

**Assistant:** Here’s an updated Make.com blueprint integrating GPT-4 and the complex prompt for generating engaging and SEO-friendly YouTube video descriptions. This blueprint is designed to handle detailed inputs and produce optimized outputs for YouTube content.
## Make.com Blueprint: YouTube Video Description Generator Using GPT-4
## **Flow Overview**
This blueprint uses Google Sheets to input data, GPT-4 for advanced prompt handling, and OpenAI's DALL-E 3 for image generation. The flow generates comprehensive YouTube video descriptions and related visual assets.
## **Module 1: Google Sheets - Watch Rows**
### ID: 1
### Module: `google-sheets:watchRows`
### Version: 2
## **Parameters**
- **From:** Drive
- **Mode:** Select
- **Limit:** 1
- **Sheet ID:** Blad1
- **Spreadsheet ID:** (Empty)
- **Table First Row:** A1:Z1
- **Includes Headers:** True
- **Value Render Option:** FORMATTED_VALUE
- **Date-Time Render Option: FORMATTED_STRING**
## **Output Fields**
- Content Info: `{{285097610__COL$B}}`
- Keywords: `{{285097610__COL$A}}`
- Image Descriptions: `{{285097610__COL$N}}`
## **Module 2: OpenAI GPT-4 - Create Completion**
### ID: 2
### Module: `openai-gpt-4:CreateCompletion`
### Version: 1
## **Parameters**
- **Connection ID: 1541333**
## **Mapper Details**
### Prompt Template:
```text
You are a master of YouTube content optimization and music video description writing. You are asked to create an engaging and SEO-friendly YouTube video description for a music video or song.
Given the following information:
Content info: {{285097610__COL$B}}
Keywords: {{285097610__COL$A}}
Image descriptions: {{285097610__COL$N}}
Your task is to generate a comprehensive YouTube video description that includes:
1. An attention-grabbing title with emojis
2. A brief, engaging description of the song or video
3. A bullet-point list of key features or highlights
4. SEO-optimized tags
5. Timestamps/chapters starting from 0:00
Please follow these guidelines:
- Use emojis creatively throughout the description to enhance visual appeal
- Optimize all text for SEO, incorporating trending keywords and phrases
- Create compelling bullet points that highlight the most interesting aspects of the content
- Generate catchy and trendy titles for the timestamps/chapters
- Include lyrics in the description if applicable
Format the output as follows:
1. Title (with emojis)
2. Description (2–3 sentences)
3. Bullet-point list (3–5 points)
4. Tags (comma-separated)
5. Timestamps/chapters (starting from 0:00)
```
## Additional Parameters:
- Model: `gpt-4`
- Max Tokens: `2048`
- Temperature: `0.8`
## Metadata:
Designer coordinates (`x: 300`, `y: 0`) and restoration details for model selection, message content, and connection.
## **Module 3: OpenAI DALL-E - Generate Images**
### ID: 3
### Module: `openai-dall-e:GenerateImage`
### Version: 1
## **Parameters**
### Prompt Template for Image Generation:
```text
Aspect Ratio: 9:16 (Vertical / 1080x1920px)
Lighting &amp; Color Guidelines:
Lighting:
High contrast, moody lighting for dystopian themes.
Soft and warm lighting for nostalgic or peaceful tones.
Color Scheme:
Dark, muted tones for danger or oppression.
Neon highlights for cyberpunk/underground rebellion.
Vibrant gradients for moments of hope or transcendence.
Background:
Isolated subject(s) on a solid background when needed, or detailed scene when narrative requires immersion.
Typography Rules:
Font Style Examples:
Bold &amp; Shattered: For rebellion themes.
Clean &amp; Sleek: For dystopian tech.
Dramatic Serif: For institutional critique.
Soft &amp; Rounded: For unity after chaos.
Text Placement:
Embedded naturally into the environment — graffiti on walls, signs in windows, neon over doorways, chalk on pavement, etc.
```
## Additional Parameters:
- Number of Images (n): `4`
- Size: `512x512`
- Response Format: URL
## **Module 4–6: Generate Content for Timestamps**
Each module handles one timestamp section with unique prompts to ensure variety in output.
## Prompt Example:
```text
Outline:
{{2.choices[].message.content}}
Language: English
Write a detailed description for timestamp [X], focusing on [specific theme]. Use HTML formatting including headings (&lt;h2&gt;, &lt;h3&gt;), bold text (&lt;b&gt;), unordered lists (&lt;ul&gt;), and ordered lists (&lt;ol&gt;). Ensure accessible language with authoritative advice.
```
## Final Output Format
The generated output will include:
- **Title** (with emojis): Catchy and optimized for YouTube trends.
- **Description** (brief summary): Engaging overview of the video/song.
- **Bullet-point list** (features/highlights): Key aspects of the content.
- **Tags** (SEO-friendly): Comma-separated keywords relevant to the content.
- **Timestamps/chapters (formatted): Starting from `0:00`.**
## Workflow Logic
- Google Sheets fetches input data dynamically.
- GPT-4 processes the data using advanced prompts to generate descriptions.
- DALL-E creates visually appealing images based on thematic guidelines.
- Outputs are formatted into structured descriptions ready for YouTube uploads.
Let me know if further refinements are needed!

---

**Assistant:** ## **Narrative Image Generation Framework for DALL-E**
This framework outlines the process for analyzing song lyrics, extracting key themes, emotions, and visual elements, and translating them into dynamic images using DALL-E. The goal is to create a cohesive visual narrative that reflects the song's essence.
## **Step 1: Analysis of Song Lyrics**
Analyze the provided lyrics to extract:
- **Main Themes**: Core ideas or motifs (e.g., love, rebellion, nostalgia, freedom).
- **Emotional Tone**: Dominant feelings conveyed (e.g., joy, melancholy, hope).
- **Narrative Arc**: Sequence of events or progression in the song (e.g., conflict-resolution).
- **Underlying Messages: Symbolic or metaphorical meanings.**
## **Step 2: Image Generation Structure**
Each section of the narrative will be represented by a batch of four images. The structure includes:
- **Main Image**: Captures the core action or emotion.
- **Transitions**: Bridges between major narrative moments.
- **Fillers**: Adds depth or emotional pauses.
- **Continuation: Expands on underdeveloped parts of the narrative.**
## **Image Prompts**
## **1. Cover Image (Introduction to Content and Context)**
### Purpose: Establish the overall theme and mood with a symbolic introduction.
### Prompt Example:
*"Create an image of a neon-lit cityscape with glowing graffiti hearts on crumbling walls. Use vibrant colors like neon pink and deep blue against a dark background to convey a sense of rebellion and longing."*
## **2. Transition Image (Shift in Focus or Mood)**
### Purpose: Smoothly bridge from the cover image to the main narrative element.
### Prompt Example:
*"Focus on a close-up of a glowing graffiti heart on a cracked wall. Use muted lighting to hint at the emotional tone that follows, transitioning from rebellion to vulnerability."*
## **3. Main Image (Core Action or Emotion)**
### Purpose: Highlight the central moment or emotional climax of the song.
### Prompt Example:
*"Depict a character standing in the midst of chaos—a blooming flower amidst ruins. Use dynamic lighting with deep reds and blues to emphasize emotional intensity."*
## **4. Filler Image (Emotional Pause or Detail Enhancement)**
### Purpose: Provide additional context or emotional reflection through symbolic elements.
### Prompt Example:
*"Show spinning vinyl records surrounded by glowing neon signs in a dimly lit room, evoking nostalgia and reflection."*
## **5. Transition Image (Bridge to Next Key Moment)**
### Purpose: Shift focus from one emotional or narrative element to the next.
### Prompt Example:
*"Zoom out to reveal a panoramic view of a dystopian city as characters walk through its streets. Use muted colors and soft lighting to signal change."*
## **Batching and Continuation**
- Always generate images in batches of four.
- After each batch, propose four new ideas that align with the theme but explore fresh perspectives.
## **Example New Ideas for Continuation:**
- A character reaching out toward a glowing light amidst darkness.
- A graffiti-covered alley with symbols representing hope.
- A shattered mirror reflecting fragmented emotions.
- A sunrise breaking through storm clouds over an abandoned city.
## **Technical Defaults**
- **Aspect Ratio:**
9:16 (vertical compositions for dramatic storytelling).
- 16:9 (expansive landscapes).
- 1:1 (centralized compositions).
- **Lighting &amp; Color Guidelines:**
High contrast for dramatic themes (e.g., rebellion).
- Soft, warm lighting for nostalgic moments (e.g., reflection).
- Vibrant gradients for hopeful transitions.
## **Image Review Process**
Once generated:
- Evaluate each image for thematic accuracy and visual coherence.
- Expand underdeveloped parts of the narrative by adding fillers/transitions.
- Continue generating batches until all sections are visually represented.
## **Output Format for Each Image**
For each generated image:
- **Title Usable for Print on Demand:** Around 50–60 characters; exclude technical details but focus on strong keywords.
- **Keywords:** At least 20 meaningful keywords separated by commas; prioritize thematic relevance over artistic style.
- **Description: Close to 256 characters; include relevant keywords and align with target audience.**
## Example Workflow
## Input Lyrics:
*"The city was alive with whispers of rebellion, hearts beating against walls painted with neon dreams."*
## Generated Images:
- Cover Image: Neon-lit cityscape with glowing graffiti hearts.
- Transition Image: Close-up of graffiti heart on cracked wall.
- Main Image: Character standing amidst ruins holding a blooming flower.
- Filler Image: Vinyl records spinning under dim neon lights.
## Proposed New Ideas:
- A character walking through rain-soaked streets illuminated by neon signs.
- A glowing lantern held high against stormy skies.
- A broken clock symbolizing lost time amidst chaos.
- A crowd gathering under graffiti-covered walls with hopeful expressions.
By adhering to this framework, you ensure that each image contributes meaningfully to the narrative while maintaining visual cohesion and thematic depth throughout the series. Let me know if you'd like me to refine this further!