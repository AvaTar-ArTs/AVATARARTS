*def* analyze_text_for_section(*text*, *section_number*):

​    """Analyze the transcript using ChatGPT with a detailed prompt."""

​    response **=** openai.ChatCompletion.create(

​        *model***=**"gpt-4o",

​        *messages***=**[

​            {

​                "role": "system",

​                "content": (

​                    "You are an expert in multimedia analysis and storytelling. Your task is to provide a highly detailed and descriptive engaging informative narrative analysis of video and audio content.Your descriptive narrative should examine themes, emotional tone, narrative structure, technical production, artistic intent, and audience impact. Consider every nuance and provide insights into how audio and visual elements, editing, and special effects contribute to the overall experience."

​                ),

​            },

​            {

​                "role": "user",

​                "content": (

​                    *f*"Provide an in-depth analysis for {section_number}. Please address the following aspects:\n"

​                    "1. **Central Themes and Messages**: What are the primary themes, and how complex are the underlying messages?\n"

​                    "2. **Emotional Tone**: Describe the range of emotions conveyed. How do the audio and visual elements interact to evoke these emotions?\n"

​                    "3. **Narrative Arc and Structure**: Explain how this section fits into the overall narrative. Identify key turning points and their significance.\n"

​                    "4. **Creator’s Intent and Vision**: What deeper message or purpose might the creator be conveying? How do multimedia elements support this intent?\n"

​                    "5. **Technical and Artistic Elements**: Analyze the use of cinematography, editing, sound design, and any special effects. How do these technical choices enhance the storytelling?\n"

​                    "6. **Audience Impact and Engagement**: Evaluate how effectively the content captures and maintains audience attention. What makes it engaging?\n"

​                    "\nTranscript:\n" **+** text

​                ),

​            },

​        ],

​        *max_tokens***=**2000,

​        *temperature***=**0.7,

​    )