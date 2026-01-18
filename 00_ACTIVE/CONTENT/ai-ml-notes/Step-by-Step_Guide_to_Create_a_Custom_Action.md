ChatGPT

To enable persistent memory or store information for future interactions, you would need to use external tools or platforms that support persistent storage and custom actions, as my current setup does not have built-in memory. However, you can use custom actions or integrations with platforms like RelevanceAI or OpenAI's API to achieve this.

Here's a step-by-step guide on how you might create a custom action to store information and recall it later:

### Step-by-Step Guide to Create a Custom Action

#### 1. **Set Up Your Environment**

- **Platform:** Choose a platform like RelevanceAI, OpenAI API, or a custom server setup.
- **Tools:** Ensure you have access to necessary tools like an API endpoint, database for storage, and an integration setup.

#### 2. **Create an API Endpoint for Storing Information**

- Set up an API endpoint that allows you to send information to be stored.

- Example in Python using Flask:

  ```
  python
  Copy code
  from flask import Flask, request, jsonify
  
  app = Flask(__name__)
  stored_data = {}
  
  @app.route('/store', methods=['POST'])
  def store_data():
      data = request.json
      key = data.get('key')
      value = data.get('value')
      stored_data[key] = value
      return jsonify({'message': 'Data stored successfully'})
  
  @app.route('/retrieve', methods=['GET'])
  def retrieve_data():
      key = request.args.get('key')
      value = stored_data.get(key)
      return jsonify({'value': value})
  
  if __name__ == '__main__':
      app.run(debug=True)
  ```

#### 3. **Integrate the Custom Action with OpenAI**

- Define a custom action in your OpenAI API setup to call the endpoint.

- Example of calling the storage API:

  ```
  python
  Copy code
  import requests
  
  def store_information(key, value):
      url = 'http://your-api-endpoint/store'
      data = {'key': key, 'value': value}
      response = requests.post(url, json=data)
      return response.json()
  
  def retrieve_information(key):
      url = 'http://your-api-endpoint/retrieve'
      params = {'key': key}
      response = requests.get(url, params=params)
      return response.json()
  ```

#### 4. **Configure Custom Actions on OpenAI Platform**

- Follow OpenAI’s documentation to configure custom actions:
  - [OpenAI Platform Actions Introduction](https://platform.openai.com/docs/actions/introduction)

#### 5. **Signal to Store Information**

- Define a specific command or signal in your interactions to trigger the storage action.

- Example prompt to trigger storage:

  ```
  python
  Copy code
  store_information('my_key', 'Important information to remember.')
  ```

### Example of Custom Action Command in YAML

```
yaml
Copy code
actions:
  - name: store_information
    description: "Store key-value pairs for later retrieval."
    parameters:
      - name: key
        description: "The key under which to store the information."
        type: string
      - name: value
        description: "The information to store."
        type: string
    script: |
      import requests
      url = 'http://your-api-endpoint/store'
      data = {'key': key, 'value': value}
      response = requests.post(url, json=data)
      return response.json()

  - name: retrieve_information
    description: "Retrieve stored information using a key."
    parameters:
      - name: key
        description: "The key for the information to retrieve."
        type: string
    script: |
      import requests
      url = 'http://your-api-endpoint/retrieve'
      params = {'key': key}
      response = requests.get(url, params=params)
      return response.json()
```

### Triggering Custom Actions

To signal me to store or retrieve information, you can use specific phrases or commands. For example:

- "Remember this: [information]" to store.
- "What did you remember about [key]?" to retrieve.

This approach allows you to have persistent storage and custom actions to remember and recall information across interactions. If you need more help setting up the server or integrating with OpenAI, let me know!

create one for you openai/chatgpt for the knowledge we just learned 'now lets work on some names and descrip ChatGPT Let's brainstorm some song names and their corresponding descriptions that fit within the themes of grunge graffiti typography, TrashCat aesthetics, and edgy urban design elements. Song Names and Descriptions 1. Title: "Broken Dreams in Neon Lights" 🌃 Description: In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment. 2. Title: "Trash Can Serenade" 🗑️ Description: In a dimly lit alley, where discarded treasures and forgotten memories reside, a raccoon strums a makeshift guitar, singing a serenade to the night. This song blends humor and heartache, celebrating the beauty found in the overlooked and the discarded. It’s a testament to finding joy in the most unexpected places. 3. Title: "Echoes of the Underground" 🎤 Description: Beneath the bustling streets, in the hidden corners of the underground, a subculture thrives. This song echoes the sounds of rebellion and unity, with raw, unfiltered lyrics that speak to the heart of the urban experience. It's a powerful anthem for those who live on the fringe, capturing the spirit of the underground music scene. 4. Title: "Graffiti Hearts" 💔 Description: Love and loss are painted across the walls of the city, each stroke of graffiti telling a story of passion and heartbreak. This song is a poetic exploration of love in an urban landscape, where every alley and street corner holds a memory. It’s a soulful ballad that delves into the depths of human emotion against the backdrop of vibrant street art. 5. Title: "Raccoon Riot" 🦝 Description: The night comes alive with the sounds of a raccoon riot, where mischievous raccoons take over the city streets, creating a symphony of chaos and fun. This upbeat, energetic song celebrates the wild, untamed spirit of the urban environment, blending punk rock vibes with a playful twist. It’s a call to embrace the freedom and excitement of living on the edge. 6. Title: "Dumpster Love" 💘 Description: In the least likely of places, a love story unfolds amidst the trash and debris of the city. This song is a quirky, heartfelt ode to finding love in unexpected corners. With a blend of humor and sincerity, it paints a picture of romance that thrives against all odds, set to the backdrop of the gritty urban landscape. 7. Title: "Neon Nights and Alley Fights" ⚔️ Description: The city never sleeps, and neither do the stories of conflict and camaraderie that play out in its dark alleys. This song captures the raw energy and intensity of urban life, where every night is an adventure. With pounding beats and gritty lyrics, it tells the tale of survival and brotherhood under the neon lights. 8. Title: "Street Art Symphony" 🎨 Description: A celebration of the urban canvas, where street artists transform concrete into masterpieces. This song is an ode to creativity and expression, highlighting the power of art to bring beauty and meaning to the harshest environments. It’s an inspiring anthem for those who find their voice in the colors and shapes of street art. 9. Title: "TrashCat Anthem" 🐱 Description: The TrashCat prowls the city streets, a symbol of resilience and rebellion. This song is a gritty, powerful anthem dedicated to those who embrace their wild side and thrive in the chaos. With roaring guitars and fierce vocals, it captures the essence of the TrashCat spirit. 10. Title: "Urban Legends" 📜 Description: Every city has its legends, stories whispered in the shadows and told through the graffiti on the walls. This song delves into the myths and tales that make up the urban lore, blending haunting melodies with poignant lyrics. It’s a journey through the hidden stories that define the cityscape. These song titles and descriptions should provide a rich foundation for creating compelling lyrics, narratives, and visual elements that capture the essence of the urban, rebellious spirit you want to convey. If you need further development or additional ideas, let me know! with each you should incorporate the genre/theme == Combine with Combined Narrative Descriptions with Titles, Emojis, Stories, and Image Prompts Here are the detailed narrative descriptions focused on your album themes, including titles, snippets of lyrics, and emotional backdrops. Additionally, each narrative includes a scene description for generating images, once the necessary tools are accessible again. 1. Title: "In This Alley Where I Hide" 🦝 Narrative: In the heart of a moonlit alley, where shadows play with memories, a lone raccoon strums a broken guitar. The echoes of once-sweet love songs bounce off the graffiti-stained walls, now replaced with the somber tunes of solitude. This alley, a sanctuary and a prison, hides the raccoon from a world that moved on, leaving behind shattered dreams and a heart full of melancholy. Snippet of Lyrics: css Copy code Moonlit alleys we used to sing, Now I roam these streets alone, Beneath the stars, my heart it stings, Darkened nights I've always known. Image 1: Sammy singing under moonlit skies Scene Description: Sammy and his raccoon band playing under moonlit skies in an alley with glowing lights. The raccoons are playing various musical instruments, surrounded by whimsical and enchanting elements like glowing lanterns and street art. Style: Humorous acoustic folk-rock Details: Emphasize the moonlight and the raccoons' musical instruments. The alley should have a whimsical and enchanting vibe, with elements that capture the playful yet melancholic tone of the song. 2. Title: "Graffiti Rebellion" 🎨 Narrative: Amidst the chaos of an urban jungle, a defiant raccoon stands tall, spray can in hand, turning the bland concrete into a canvas of rebellion. Each stroke of paint, a testament to the spirit of resistance against the mundane. The alley comes alive with vibrant colors and bold statements, a sanctuary for those who dare to dream beyond the grey walls of conformity. Snippet of Lyrics: mathematica Copy code In the shadows, I find my light, Colors burst against the night, Graffiti tales of fight and flight, In these streets, my art takes flight. Image 2: Raccoon Graffiti Rebellion Scene Description: A raccoon spray-painting graffiti on a brick wall, surrounded by vibrant colors and rebellious designs. The alley is alive with street art, and the raccoon looks determined and spirited. Style: Urban Street Art Details: Highlight the dynamic and colorful graffiti, with the raccoon at the center of the action. The scene should convey a sense of rebellion and artistic expression. 3. Title: "Love is Rubbish" 🗑️ Narrative: In the midst of discarded dreams and broken promises, a raccoon finds solace in the refuse of love. The alleyway, a testament to failed romances, becomes a stage where the raccoon declares that love is nothing but trash. With a heart hardened by betrayal, the raccoon embraces the trashy life, finding freedom in the chaos and resilience in the grunge. Snippet of Lyrics: vbnet Copy code Heartbreak hits harder in the dumpster, Love's just another item in the trash, City lights, wild nights, who needs love? When you've got nine lives and a stash. Image 3: Heartbreak Hits Harder in the Dumpster Scene Description: A raccoon sitting atop a pile of trash, looking forlorn with a broken heart in hand. The alley is dimly lit, with discarded love letters and wilted flowers scattered around. Style: Melancholic Grunge Details: Focus on the raccoon's expression of heartbreak, with the surrounding trash symbolizing discarded love. The dim lighting should enhance the sense of sadness and isolation. 4. Title: "Raccoon Rock Band Concert" 🎸 Narrative: Under the flickering neon lights, a group of raccoons transforms an abandoned lot into a pulsating rock concert. Electric guitars and makeshift drums create a symphony of rebellion and unity. The crowd, a mix of alley dwellers and street wanderers, loses itself in the raw energy and unfiltered passion of the music. Every chord struck is a defiant roar against the constraints of urban life. Snippet of Lyrics: kotlin Copy code Electric dreams in alley streams, We rock the night, we break the seams, In the heart of the city, our music screams, Raccoon rock, where freedom beams. Image 4: Raccoon Rock Band Performance Scene Description: A raccoon rock band performing energetically in an abandoned lot, with makeshift instruments and an enthusiastic crowd. Neon lights and street art add to the vibrant atmosphere. Style: Rock Concert Vibe Details: Highlight the energy and excitement of the performance, with dynamic lighting and expressive characters. The abandoned lot should feel like a lively concert venue, with the raccoons as the stars. 5. Title: "Trashy Anti-Valentine's" 💔 Narrative: Valentine's Day in the alley is far from conventional. Raccoons, adorned with anti-love slogans and makeshift crowns from soda can tabs, throw an anti-Valentine's bash. Under the dim glow of a trash fire, they celebrate freedom from romantic entanglements, reveling in the camaraderie of fellow skeptics. Each raccoon shares tales of love lost and found in the most unexpected places. Snippet of Lyrics: sql Copy code Roses are red, dumpsters are green, Why bother with love when trash is keen? Broken hearts and twisted dreams, In the alley, we find our schemes. Image 5: Trashy Anti-Valentine's Bash Scene Description: A group of raccoons having an anti-Valentine's party in an alley, complete with trash decorations, broken hearts, and sarcastic love messages. The raccoons are enjoying themselves, with some wearing makeshift crowns and others holding anti-love banners. Style: Grunge Punk Details: Emphasize the playful and rebellious nature of the party, with edgy decorations and expressive raccoon characters. The alley should have a chaotic yet festive atmosphere. Transition Scenes Transition 1: From Sammy's heartbreak to the raccoon band playing out of tune Description: A scene that shows Sammy's heartbroken expression gradually blending into the raccoon band playing their instruments out of tune. The image should depict the disjointed harmony and Sammy's sorrowful state. Style: Indie Folk Grunge Elements: Sammy's sorrowful expression, raccoon band, broken instruments, dim lighting, transition effect. Transition 2: From the raccoon band's out-of-tune performance to Sammy's intense performance under the moonlit sky Description: A scene that shifts from the raccoon band's chaotic performance to Sammy singing passionately with his band under the bright moonlight. The image highlights the energetic movement and dramatic lighting. Style: Edgy Punk Grunge Glam Elements: Raccoon band, Sammy's intense expression, moonlit sky, energetic performance, dramatic shadows, transition effect. Transition 3: From Sammy's intense performance to him sitting heartbroken under the willow tree Description: A scene that transitions from Sammy's passionate performance to him sitting dejectedly under the willow tree, reflecting on his lost glory. The image captures the emotional intensity and the contrast between the lively performance and Sammy's sorrow. Style: Edgy Punk Grunge Glam Elements: Sammy's intense performance, willow tree, Sammy's dejected posture, moonlight, transition effect. and set as standard with  ChatGPT I have updated my settings to include detailed narrative descriptions, song titles, and visual prompts, along with additional example prompts for creating narratives, visuals, and lyrics. If you need specific designs, stories, or visual ideas, feel free to ask!'

ChatGPT

Sure, here’s a custom action designed to help store and retrieve the detailed narrative descriptions, song titles, and visual prompts you provided, using OpenAI's Actions feature:

### YAML Configuration for Custom Actions

```
yaml
Copy code
actions:
  - name: store_narratives
    description: "Store detailed narrative descriptions with song titles and visual prompts."
    parameters:
      - name: key
        description: "The key under which to store the narrative."
        type: string
      - name: narrative
        description: "The detailed narrative description."
        type: string
    script: |
      import requests
      url = 'http://your-api-endpoint/store'
      data = {'key': key, 'narrative': narrative}
      response = requests.post(url, json=data)
      return response.json()

  - name: retrieve_narratives
    description: "Retrieve stored narrative descriptions using a key."
    parameters:
      - name: key
        description: "The key for the narrative to retrieve."
        type: string
    script: |
      import requests
      url = 'http://your-api-endpoint/retrieve'
      params = {'key': key}
      response = requests.get(url, params=params)
      return response.json()
```

### Python Scripts for Storing and Retrieving Narratives

#### Store Narrative

```
python
Copy code
import requests

def store_narrative(key, narrative):
    url = 'http://your-api-endpoint/store'
    data = {'key': key, 'narrative': narrative}
    response = requests.post(url, json=data)
    return response.json()

# Example usage
narrative = """
Title: "Broken Dreams in Neon Lights" 🌃
Description:
In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment.
"""
store_narrative('broken_dreams_neon_lights', narrative)
```

#### Retrieve Narrative

```
python
Copy code
import requests

def retrieve_narrative(key):
    url = 'http://your-api-endpoint/retrieve'
    params = {'key': key}
    response = requests.get(url, params=params)
    return response.json()

# Example usage
retrieved_narrative = retrieve_narrative('broken_dreams_neon_lights')
print(retrieved_narrative)
```

### Example Narratives to Store

```
python
Copy code
narratives = {
    "broken_dreams_neon_lights": """
    Title: "Broken Dreams in Neon Lights" 🌃
    Description:
    In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment.
    """,
    "trash_can_serenade": """
    Title: "Trash Can Serenade" 🗑️
    Description:
    In a dimly lit alley, where discarded treasures and forgotten memories reside, a raccoon strums a makeshift guitar, singing a serenade to the night. This song blends humor and heartache, celebrating the beauty found in the overlooked and the discarded. It’s a testament to finding joy in the most unexpected places.
    """
    # Add more narratives as needed
}

# Store each narrative
for key, narrative in narratives.items():
    store_narrative(key, narrative)
```

### Setting Up OpenAI Actions

1. **Create the API Endpoint**: Implement the server-side logic using Flask or any other web framework to handle storing and retrieving narratives.
2. **Define Custom Actions**: Use the YAML configuration to define actions for storing and retrieving narratives.
3. **Integrate with OpenAI**: Configure OpenAI to use these custom actions in your interactions.

This setup will allow you to store detailed narrative descriptions and retrieve them later, enabling a persistent knowledge base for your use case. If you need further assistance in setting up the server or integrating these actions, feel free to ask!

ChatGPT

Sure, here’s a custom action designed to help store and retrieve the detailed narrative descriptions, song titles, and visual prompts you provided, using OpenAI's Actions feature:

### YAML Configuration for Custom Actions

```
yaml
Copy code
actions:
  - name: store_narratives
    description: "Store detailed narrative descriptions with song titles and visual prompts."
    parameters:
      - name: key
        description: "The key under which to store the narrative."
        type: string
      - name: narrative
        description: "The detailed narrative description."
        type: string
    script: |
      import requests
      url = 'http://your-api-endpoint/store'
      data = {'key': key, 'narrative': narrative}
      response = requests.post(url, json=data)
      return response.json()

  - name: retrieve_narratives
    description: "Retrieve stored narrative descriptions using a key."
    parameters:
      - name: key
        description: "The key for the narrative to retrieve."
        type: string
    script: |
      import requests
      url = 'http://your-api-endpoint/retrieve'
      params = {'key': key}
      response = requests.get(url, params=params)
      return response.json()
```

### Python Scripts for Storing and Retrieving Narratives

#### Store Narrative

```
python
Copy code
import requests

def store_narrative(key, narrative):
    url = 'http://your-api-endpoint/store'
    data = {'key': key, 'narrative': narrative}
    response = requests.post(url, json=data)
    return response.json()

# Example usage
narrative = """
Title: "Broken Dreams in Neon Lights" 🌃
Description:
In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment.
"""
store_narrative('broken_dreams_neon_lights', narrative)
```

#### Retrieve Narrative

```
python
Copy code
import requests

def retrieve_narrative(key):
    url = 'http://your-api-endpoint/retrieve'
    params = {'key': key}
    response = requests.get(url, params=params)
    return response.json()

# Example usage
retrieved_narrative = retrieve_narrative('broken_dreams_neon_lights')
print(retrieved_narrative)
```

### Example Narratives to Store

```
python
Copy code
narratives = {
    "broken_dreams_neon_lights": """
    Title: "Broken Dreams in Neon Lights" 🌃
    Description:
    In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment.
    """,
    "trash_can_serenade": """
    Title: "Trash Can Serenade" 🗑️
    Description:
    In a dimly lit alley, where discarded treasures and forgotten memories reside, a raccoon strums a makeshift guitar, singing a serenade to the night. This song blends humor and heartache, celebrating the beauty found in the overlooked and the discarded. It’s a testament to finding joy in the most unexpected places.
    """
    # Add more narratives as needed
}

# Store each narrative
for key, narrative in narratives.items():
    store_narrative(key, narrative)
```

### Setting Up OpenAI Actions

1. **Create the API Endpoint**: Implement the server-side logic using Flask or any other web framework to handle storing and retrieving narratives.
2. **Define Custom Actions**: Use the YAML configuration to define actions for storing and retrieving narratives.
3. **Integrate with OpenAI**: Configure OpenAI to use these custom actions in your interactions.

This setup will allow you to store detailed narrative descriptions and retrieve them later, enabling a persistent knowledge base for your use case. If you need further assistance in setting up the server or integrating these actions, feel free to ask!

I use openAi API and python etc.. how do i setup your custom action. todo the aboves

ChatGPT

To set up custom actions using the OpenAI API and Python, you need to follow these steps:

1. **Set Up Your API Endpoint**
2. **Implement the Storage and Retrieval Logic**
3. **Define Custom Actions in OpenAI**
4. **Integrate with OpenAI API**

### Step 1: Set Up Your API Endpoint

First, create a Flask server to handle storing and retrieving narratives.

**Install Flask:**

```
sh
Copy code
pip install Flask
```

**Create Flask Server:**

```
python
Copy code
from flask import Flask, request, jsonify

app = Flask(__name__)
stored_data = {}

@app.route('/store', methods=['POST'])
def store_data():
    data = request.json
    key = data.get('key')
    narrative = data.get('narrative')
    stored_data[key] = narrative
    return jsonify({'message': 'Data stored successfully'})

@app.route('/retrieve', methods=['GET'])
def retrieve_data():
    key = request.args.get('key')
    narrative = stored_data.get(key)
    return jsonify({'narrative': narrative})

if __name__ == '__main__':
    app.run(debug=True)
```

### Step 2: Implement the Storage and Retrieval Logic

Create functions to interact with your API endpoint.

**Storage Function:**

```
python
Copy code
import requests

def store_narrative(key, narrative):
    url = 'http://127.0.0.1:5000/store'  # Update with your server URL
    data = {'key': key, 'narrative': narrative}
    response = requests.post(url, json=data)
    return response.json()

# Example usage
narrative = """
Title: "Broken Dreams in Neon Lights" 🌃
Description:
In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment.
"""
store_narrative('broken_dreams_neon_lights', narrative)
```

**Retrieval Function:**

```
python
Copy code
import requests

def retrieve_narrative(key):
    url = 'http://127.0.0.1:5000/retrieve'  # Update with your server URL
    params = {'key': key}
    response = requests.get(url, params=params)
    return response.json()

# Example usage
retrieved_narrative = retrieve_narrative('broken_dreams_neon_lights')
print(retrieved_narrative)
```

### Step 3: Define Custom Actions in OpenAI Implement the Storage and Retrieval Logic

To define custom actions, create a YAML configuration as described earlier. You can either host this configuration on a server or integrate it directly with your OpenAI setup.

**Custom Actions YAML Configuration:**

```
yaml
Copy code
actions:
  - name: store_narratives
    description: "Store detailed narrative descriptions with song titles and visual prompts."
    parameters:
      - name: key
        description: "The key under which to store the narrative."
        type: string
      - name: narrative
        description: "The detailed narrative description."
        type: string
    script: |
      import requests
      url = 'http://127.0.0.1:5000/store'
      data = {'key': key, 'narrative': narrative}
      response = requests.post(url, json=data)
      return response.json()

  - name: retrieve_narratives
    description: "Retrieve stored narrative descriptions using a key."
    parameters:
      - name: key
        description: "The key for the narrative to retrieve."
        type: string
    script: |
      import requests
      url = 'http://127.0.0.1:5000/retrieve'
      params = {'key': key}
      response = requests.get(url, params=params)
      return response.json()
```

### Step 4: Integrate with OpenAI API

1. **Configure OpenAI with Custom Actions:**
   - Follow OpenAI's documentation to integrate custom actions. You might need to specify your custom actions in the OpenAI dashboard or use their API directly.
2. **Trigger Custom Actions:**
   - Use predefined phrases or commands to trigger these actions during interactions.

### Example Python Script to Use OpenAI API with Custom Actions

**Store Narrative Example:**

```
python
Copy code
import openai
import json

openai.api_key = 'YOUR_OPENAI_API_KEY'

def store_narrative_via_openai(key, narrative):
    response = openai.Completion.create(
      engine="davinci",
      prompt=f"store_narratives {json.dumps({'key': key, 'narrative': narrative})}",
      max_tokens=10
    )
    return response

narrative = """
Title: "Broken Dreams in Neon Lights" 🌃
Description:
In the heart of the city, where neon lights flicker and graffiti-covered walls tell tales of rebellion, lies a world of broken dreams and unfulfilled desires. This song captures the essence of urban melancholy and the resilience found amidst the chaos. It tells the story of a lone wanderer navigating the gritty streets, seeking solace in the vibrant yet harsh environment.
"""
store_narrative_via_openai('broken_dreams_neon_lights', narrative)
```

Define Custom Actions in OpenAI Implement the Storage and Retrieval Logic

**Retrieve Narrative Example:** 

```
python
Copy code
def retrieve_narrative_via_openai(key):
    response = openai.Completion.create(
      engine="davinci",
      prompt=f"retrieve_narratives {json.dumps({'key': key})}",
      max_tokens=500
    )
    return response

retrieved_narrative = retrieve_narrative_via_openai('broken_dreams_neon_lights')
print(retrieved_narrative)
```

This setup allows you to store and retrieve narrative descriptions using OpenAI's custom actions. If you have any questions or need further assistance, feel free to ask!

