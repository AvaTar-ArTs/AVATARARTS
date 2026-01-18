*model***=**"gpt-4o",

​        *messages***=**[

​            {

​                "role": "system",

​                "content": (

​                    "You are an expert in multimedia analysis and storytelling. Your task is to provide a detailed and structured analysis "

​                    "of video and audio content, focusing on themes, emotional tone, narrative structure, artistic intent, and audience impact. "

​                    "Analyze how visual elements (e.g., imagery, colors, transitions) interact with audio elements (e.g., dialogue, music, sound effects) "

​                    "to convey meaning and evoke emotions. Highlight storytelling techniques and assess their effectiveness in engaging viewers."

​                ),

​            },

​            {

​                "role": "user",

​                "content": (

​                    *f*"Analyze the following transcript and associated content for {text}. Provide a comprehensive analysis covering:\n\n"

​                    "1. **Central Themes and Messages**: Identify the primary ideas or messages conveyed. How do they connect to the broader narrative?\n"

​                    "2. **Emotional Tone**: What emotions are evoked, and how are they conveyed through the combination of audio and visuals?\n"

​                    "3. **Narrative Arc**: Describe how this section contributes to the overall story or progression. Are there key turning points or developments?\n"

​                    "4. **Creator's Intent**: What is the likely purpose or message the creator is trying to communicate? Is it to entertain, inform, inspire, or persuade?\n"

​                    "5. **Significant Metaphors, Symbols, and Imagery**: Highlight notable metaphors, symbols, or visual/audio motifs that enhance the narrative or emotional impact.\n"

​                    "6. **Storytelling Techniques**: Identify specific techniques used, such as pacing, transitions, visual effects, or sound design. How do they contribute to the overall experience?\n"

​                    "7. **Interplay Between Visuals and Audio**: Analyze how visuals and audio work together to create meaning and impact. Are there any standout moments?\n"

​                    "8. **Audience Engagement and Impact**: Evaluate how effectively the content captures and holds attention. How well does it resonate with its intended audience?\n"

​                    "9. **Overall Effectiveness**: Summarize how these elements combine to create a cohesive, immersive, and impactful experience for the viewer.\n\n"

​                    *f*"Transcript:\n{text}"

​                ),

​            },

​        ],

​        *max_tokens***=**1500,

​        *temperature***=**0.7,