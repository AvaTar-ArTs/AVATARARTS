## **Steven Chaplinski | Creative Automation Engineer**

---

## **⚙️ About Me**

> Hi, I'm Steven. I build tools that save time, eliminate chaos, and help artists, developers, and creators do more of what they love. My stack includes Python, GPT, Whisper, and plenty of nerdy humor.
> 

---

## **🚀 What I Do**

| Area | Tools | Outcome |
| --- | --- | --- |
| Audio-to-Insight | Whisper + GPT | Transcribes MP3s and segments them into narrative/emotional chunks |
| Image Automation | PIL + GPT | Batch resize, rename, reformat thousands of assets |
| Content Pipelines | TikTok + ChatGPT + LinkedIn | Auto-create posts from video content |
| Brand Automation | CLI + CSV + APIs | End-to-end creative scripting pipelines |

---

## **🛠 Projects**

### **SerpentFlow CLI**

*Transcribes and analyzes audio like a digital critic.*

```
python serpentflow.py --brew /audio/folder
```

### **BulkImage Alchemist**

*Batch processes 10,000+ images/month. Injects humor + compression.*

### **LinkedIn Generator Bot**

*Turns TikTok videos into professional-grade draft posts.*

---

## **💬 How I Help**

**For Creators:**

- Automate repetitive workflow tasks
- Generate captions, lyrics, and themes using GPT
- Optimize your content for LinkedIn, Etsy, or TikTok

**For Developers & Startups:**

- Build lightweight automation tools
- Clean up media libraries
- Connect APIs with intuitive UI logic

---

## **📩 Contact**

- [GitHub: QuantumForgeLabs](https://github.com/QuantumForgeLabs)
- [Site: AvatarArts.org](https://avatararts.org/)
- Email: `contact@avatararts.org`
- Or just send a DM on LinkedIn

---

## **🧪 Try a Tool (Optional Embed)**

> [ ] Embed a CodePen or Google Colab[ ] Show a screenshot or screen recording of a tool running[ ] "Demo this CLI in 60 seconds" GIF
> 

---

# **AI Alchemy Project Portfolio**

*Transforming chaos into creativity through coded rituals*

> # Alchemical Design Philosophy
> 

This portfolio is a compendium of projects and scripts (our **“technical rituals”**) that merge automation with artistry. The catalog is organized for easy visual browsing and search, with each project summarized and tagged. From **AI-powered media pipelines** to **social media bots** and **creative generative tools**, each entry reflects a blend of technical skill and creative chaos. Use the **Table of Contents** below to navigate through these projects, and click on any entry to jump to its description.

## **Table of Contents**

- **AI-Powered Media Processing**
    - AutoTranscribe – AI Media Processor Pipeline
- **YouTube Automation & Video Generation**
    - Auto-YouTube – Automated Video Creator
    - Auto-YouTube-Shorts-Maker
    - AutomatedYoutubeShorts
    - Automatic-Video-Generator-for-YouTube
    - RedditVideoMakerBot – Reddit-to-Video Converter
    - Automated YouTube Channel
    - YouTube GPT Content Maker
    - YouTubeGen
    - YT-AnalyticsDashboard
    - YT-Detail-Info-Story
    - YouTube-Upload-Bot
    - YouTube-Uploader (Alt)
    - YouTube-Viewer Bot
    - YouTube Subscriber Generator (M3 & VenomX)
    - YouTube Playlists to CSV
    - YouTubeBot
- **Twitch & Streaming Tools**
    - Twitch-Best-Of Compiler
    - TwitchClipGenerator
    - TwitchCompilationCreator
    - TwitchTube
    - Multi-Platform Viewbot *(Twitch/TikTok/YT)*
- **Social Media Bots (Instagram, TikTok, Facebook)**
    - Instagram-Bot
    - Instagram Follower Scraper
    - InstaPy Quickstart Config
    - TikTok Comment Liker
    - Facebook Group Auto-Poster
- **E-commerce & Web Automation**
    - Redbubble-Bot
    - Redbubble Auto Uploader (Stickers)
    - POD-Auto (Print-On-Demand Automation)
    - Fiverr Data Scraper API
- **Creative Tools & Generative AI**
    - DALL·E Automation (DALLe)
    - AI Comic Factory
    - Leonardo AI Integration
    - AutoTypography (Lyrics Video Maker)
    - Image-GPT Experiment
    - Lyrics Keys Indo (Music Analysis)
- **Web & Gallery Generators**
    - Auto-HTML Gallery Scripts
    - Auto HTML Album Generator
    - SimpleGallery (Final Version)
    - SimpleGallery App
    - SimpleGallery v2
    - HTML YouTube Embedder
    - ComicGallery
- **Utility & File Management Scripts**
    - Drive Image Link Converter
    - Python-Organize (File Organizer)
    - Sort & Sorting Scripts
    - Clean Organizer
    - Remove-BG CLI
    - File Format Convertors
    - Download-All-The-GIFs
    - Tarball Archive Creator
    - Duplicate File Finder
- **Adobe Automation Scripts**
    - Create Photo Grid (Photoshop)
    - Photoshop Mockup Automation
- **Miscellaneous & Experimental**
    - Riddle-Game
    - X-Python (Sandbox)
    - Trashy-Python (Scratch Pad)
    - Colab Notebooks
    - TableContentsPython (Repo TOC Generator)
    - Misc. One-off Scripts *(8mb compression, DPI fixer, etc.)*

---

## **AI-Powered Media Processing**

### **AutoTranscribe – AI Media Processor Pipeline**

**Description:** *End-to-end* audio/video transcription and analysis pipeline. This project (code-named **“MediaProcessor”**) automatically **splits long recordings**, transcribes speech to text using **OpenAI Whisper**, and then analyzes the transcripts with **GPT-4** to extract insights. The pipeline was developed to turn hours of media (podcasts, videos, songs) into structured data and summaries without manual effort. It includes a **context-preserving splitter** (“Ouroboros Splitter”) that uses FFmpeg to chunk media while keeping context, a **Whisper transcription engine**, and a **GPT-based analyzer** that derives keywords, themes, or metadata (nicknamed “ChaosMerger” when compiling results into CSV or JSON). The output can be a neatly formatted transcript, a summary analysis (e.g. sentiments, themes, or even creative cues), and combined datasets for further use. This tool exemplifies “**AI Alchemy**” – transforming raw audiovisual chaos into organized creative gold.

**Tags:** Python, OpenAI Whisper, GPT-4, FFmpeg, Automation, Data Pipeline

```python
# Snippet: Transcription & Analysis with Whisper + GPT-3.5/4
with open(audio_path, "rb") as audio:
    transcript = openai_client.audio.transcribe("whisper-1", audio).text

# ... (save transcript) ...

response = openai_client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Analyze the transcript for themes..."},
        {"role": "user", "content": transcript}
    ],
    max_tokens=300,
    temperature=0.7
)
analysis = response.choices[0].message.content.strip()
```

### **Auto-YouTube**

**Description:** An **automated YouTube video creator** that generates full-length videos (and Shorts) from real-time content (e.g. news feeds) with zero manual editing. It fetches fresh content (via APIs or web scraping), uses text-to-speech (**TTS**, e.g. Amazon Polly) for narration, and composes visuals using Python libraries like **MoviePy**. Subtitles are auto-generated and burned in, and finally the script **uploads the video to YouTube** via YouTube’s API. Essentially, *Auto-YouTube* is a one-click pipeline to produce a YouTube-ready video from a topic – demonstrating how a combination of AI services and automation can maintain a channel hands-free.

**Tags:** Python, MoviePy, Text-to-Speech, YouTube API, Automation

### **Auto-YouTube-Shorts-Maker**

**Description:** A specialized variant focusing on **YouTube Shorts**. This script quickly creates vertical, <60s **short-form videos** optimized for the Shorts platform. It can take a piece of text or an idea and turn it into a snappy video with **stock footage or images**, automated captions, and background music. Ideal for repurposing content into social-ready snippets, the Shorts Maker automates the editing (cropping, timing) required for the 9:16 format. In short, it’s a *“short video alchemist”*, condensing content into an attention-grabbing audiovisual spell.

**Tags:** Python, MoviePy, Short-Form Video, Automation

### **AutomatedYoutubeShorts**

**Description:** Another pipeline for **automatically generating YouTube Shorts**, possibly using a different strategy (such as pulling trending topics or using templates). It automates the full cycle from content retrieval to video assembly. This could involve using **OpenAI GPT** to script a short commentary, synthesizing voice via TTS, and pairing it with dynamic imagery or clips. The presence of multiple tools for Shorts reflects iterative experimentation in optimizing automated content creation for engagement and virality.

**Tags:** Python, OpenAI GPT, TTS, Video Automation

### **Automatic-Video-Generator-for-YouTube**

**Description:** A comprehensive **video generator** that can create longer videos for YouTube on a given subject or niche. You provide a topic or it selects one (e.g. from a list or trending query), then it **generates a script** (potentially via GPT-4), converts the script to narration, finds relevant images or video snippets (using libraries or APIs), and edits everything together. This project likely integrates various APIs (for stock media, for example **DALL·E or Unsplash** for images, or FFmpeg for stitching). It embodies a **“channel-in-a-box”** concept – feed it an idea and it produces a complete video ready for upload.

**Tags:** Python, OpenAI, FFmpeg, Video Synthesis, Automation

### **RedditVideoMakerBot**

**Description:** An automation tool that takes popular Reddit content (such as an r/AskReddit thread or a Reddit post with comments) and turns it into a **narrated video**. Text from posts and comments is converted to speech, combined with background visuals (often gameplay footage or static backgrounds), and formatted as an engaging video. This kind of bot became popular for generating YouTube content from social media posts. In the portfolio, this project is an instance of that concept, likely adapted or customized. It demonstrates creative reuse of social content for storytelling on video platforms.

**Tags:** Python, Reddit API, Text-to-Speech, Video Editing

### **Automated YouTube Channel**

**Description:** A higher-level system orchestrating multiple scripts to effectively **run a YouTube channel on autopilot**. It could schedule content creation (using the above tools), manage uploads at optimal times, rotate through content sources (news, Reddit, etc.), and maybe even interact (auto-reply to comments using a preset persona or generate community posts). In essence, this is a *“Chaos Automation”* project that juggles several automation spells to maintain a consistent online presence. It likely employs scheduling (cron or task queues), the YouTube Data API for channel management, and logging/monitoring to track performance.

**Tags:** Python, YouTube API, Scheduler, Bot Orchestration

### **YouTube GPT Content Maker**

**Description:** A content generation helper that uses **GPT-4** to brainstorm or script YouTube content. For example, given a topic, it will produce a video script, complete with sections, jokes, and even visual or editing cues. This script might be used standalone to aid creators (by providing a first draft of a script or video outline), or as part of the automated video generators. It highlights how large language models can be leveraged for creative writing in the context of video production – essentially acting as an AI **“scriptwriter”** that collaborates with the automation pipeline.

**Tags:** Python, GPT-4, Content Generation, Scripting

### **YouTubeGen**

**Description:** A project likely designed to **generate YouTube-related assets or data**. This could mean generating bulk YouTube accounts, or more ethically, generating elements like thumbnails, title ideas, or SEO-optimized descriptions for videos. Given the name, one possibility is an **automatic channel/name generator** that produces ideas for new YouTube channels or content niches, possibly using some AI for creativity. Another interpretation: it could be a **YouTube video generator** similar to those above, but perhaps targeting a specific genre (the name is generic, so this is an experimental or supporting script).

**Tags:** Python, Automation, YouTube, *Experimental*

### **YT-AnalyticsDashboard**

**Description:** A tool to visualize or track YouTube channel analytics data. It might fetch statistics via the YouTube Analytics API (views, watch time, audience metrics) and present them in a dashboard or CSV. This could be a local script that generates an HTML report or a Jupyter notebook analyzing growth. Its purpose is to give insight into how the automated content is performing, or just to consolidate data across videos. By automating analytics gathering, a creator (or an AI system) can quickly adapt strategies. This project showcases data-savvy automation beyond content creation.

**Tags:** Python, YouTube API, Data Visualization, Analytics

### **YT-Detail-Info-Story**

**Description:** A script seemingly focused on extracting detailed info from YouTube, possibly related to the **“Stories”** feature or detailed metadata of videos. It might scrape or use an API to get information like video descriptions, comments, timestamps, or the content of YouTube Story posts (short ephemeral posts by creators). Another angle: it could generate a “story” (narrative) from YouTube data — for instance, summarizing a channel’s content into a story format. Without more context, likely it’s a data extraction tool ensuring no piece of YouTube content (even Stories) escapes analysis.

**Tags:** Python, YouTube Data, Scraping, Data Extraction

### **YouTube-Upload-Bot**

**Description:** A straightforward **uploader bot** that automates the process of uploading videos to YouTube. It handles tasks like setting the title, description, tags, and thumbnail automatically (possibly reading from a config or generating them). This bot ensures that videos produced by other scripts make it online without human intervention. It likely uses the official YouTube Data API for uploads. Some complexities it might handle: avoiding API quotas, rotating through accounts, or scheduling uploads. Essentially, it frees the creator from the repetitive UI interaction of uploading and publishing content.

**Tags:** Python, YouTube Data API, Automation, Bot

### **YouTube-Uploader (Alt)**

**Description:** Another version or fork of an upload automation script. This could exist due to using a different method (for instance, using Selenium to simulate a browser upload in case API usage is limited or to bypass quotas). It might also be a third-party script integrated into the repo (as seen by “-main” in some folder names). This alternative ensures reliability in getting videos uploaded by having a backup method. It underscores the importance of adaptability in automation – if one approach fails or is restricted, another can take over.

**Tags:** Python, Selenium, YouTube, Automation

### **YouTube-Viewer Bot**

**Description:** A **viewbot** for YouTube that can simulate viewers to increase view counts or to test how a video performs under certain load. Typically, such a script would manage multiple headless browsers or use the YouTube API in creative ways to send view pings. It could also be for legitimate testing (like ensuring a video can handle many concurrent viewers, or measuring performance). However used, it delves into the more *“grey hat”* side of automation. In a portfolio context, it demonstrates skill in browser automation, proxies management, and possibly understanding of YouTube’s anti-bot measures.

**Tags:** Python, Selenium/Requests, Automation, *Experimental*

### **YouTube Subscriber Generator (M3 & VenomX)**

**Description:** These are two similarly aimed scripts (from different sources, M3 and VenomX) that automate aspects of YouTube channel growth, likely focusing on **subscribers**. They might function by creating multiple accounts to subscribe to a target channel, or by generating subscribe links/QR codes for marketing. It’s possible they are meant to **produce “subscribers” metrics artificially**, which again is on the edge of ethical use. On the other hand, they might generate subscribe buttons or popups for embedding in websites. Given the names, they are probably forks the user collected. They illustrate knowledge of automation for social proof and the integration of external scripts.

**Tags:** Python, Browser Automation, YouTube, *Growth Hacking*

### **YouTube Playlists to CSV**

**Description:** A utility to **export YouTube playlist data** to a CSV file. This script likely takes a playlist URL or ID and uses the YouTube API (or web scraping) to gather all videos in the playlist, along with details like title, video ID, duration, etc., and then writes them into a structured CSV. This can be useful for content management, data analysis, or migration between platforms. The presence of both *YouTube-playlists-to-csv* and *youtube-csv* suggests one might be an initial attempt and the other a refined version. In any case, it’s a straightforward but handy tool for data wrangling.

**Tags:** Python, YouTube API, Data Export, Utility

### **YouTubeBot**

**Description:** A generic **YouTube bot** that could automate various interactions on YouTube. Depending on implementation, it might log in and perform actions like auto-liking videos, auto-commenting, subscribing to channels, or managing playlists. It could be used to maintain an account’s activity (e.g., always like new videos from a list of favorite channels, or respond to certain comments with a template). This bot showcases automation of a web platform’s user interface, likely using Selenium or a headless browser, and ties into the theme of reducing mundane social tasks via code.

**Tags:** Python, Selenium, Web Automation, YouTube

---

## **Twitch & Streaming Tools**

### **Twitch-Best-Of Compiler**

**Description:** A script that helps create **“Best Of” compilation videos** from Twitch stream footage. It might take a long Twitch VOD (video on demand) and automatically identify highlights (perhaps by parsing chat excitement, or using markers/clips), then trim those segments out and stitch them together. Alternatively, it could aggregate a streamer’s top clips of the week/month. The output is a montage of the best moments, ready for uploading to YouTube or other platforms. This saves tremendous editing time for content creators who regularly turn their live streams into highlight reels.

**Tags:** Python, Twitch API, Video Editing (FFmpeg), Automation

### **TwitchClipGenerator**

**Description:** An automation tool to **generate clips from Twitch streams**. Using the Twitch API, it could monitor a stream and programmatically create a clip when certain conditions are met (for example, a spike in chat activity or a command from the streamer). It might also batch-download existing clips from a channel for archiving or editing. If integrated with video editing, it could add intro/outro or captions to each clip. This project demonstrates event-driven automation, reacting to live content in real time to capture important moments.

**Tags:** Python, Twitch API, Real-time Automation, Video Processing

### **TwitchCompilationCreator**

**Description:** Likely an extension of the clip generator, this script **builds full compilations** out of multiple clips. It can take a list of clip files (perhaps produced by TwitchClipGenerator or downloaded via API) and merge them into one cohesive video, possibly with transitions or titles in between. It automates what a video editor might do manually to create a compilation. This could be used for creating weekly highlight videos, fail compilations, or thematic collections of moments. By automatically handling the merging and basic editing, it accelerates content turnaround for streamers.

**Tags:** Python, FFmpeg, Video Merging, Twitch

### **TwitchTube**

**Description:** A bridge between Twitch and YouTube. This project likely automates the process of taking Twitch content (either clips or full streams) and posting it to YouTube. It might download a Twitch stream after it ends, split it into parts or highlight segments (using the above tools), and then upload those to YouTube with appropriate titles and thumbnails. Essentially, **TwitchTube** ensures that no content stays confined to one platform – it reuses Twitch content to grow a YouTube channel. This involves both **download** (Twitch API or streamlink to get videos) and **upload** (YouTube API), along with format conversion (Twitch streams to YouTube-friendly videos).

**Tags:** Python, Twitch API, YouTube API, Cross-Platform Automation

### **Multi-Platform Viewbot** *(Twitch/TikTok/YouTube)*

**Description:** A **view count booster/tester** that works across multiple streaming platforms – Twitch, TikTok Live, and YouTube Live. It likely can spawn headless instances or use APIs to simulate viewers on a live stream or video. This could be used to test stream stability or to artificially inflate viewer count (for research or dubious growth hacking). Managing three platforms means handling different protocols (Twitch uses IRC/Websockets for chat, TikTok might use web or undocumented APIs, YouTube live uses polling or websockets). The script showcases advanced automation, concurrency (to handle many threads or processes), and an understanding of each platform’s inner workings.

**Tags:** Python, Selenium/Playwright, WebSockets, *Bot Automation*

---

## **Social Media Bots (Instagram, TikTok, Facebook)**

### **Instagram-Bot**

**Description:** A general-purpose **Instagram automation bot**. Capabilities likely include automating likes, follows, unfollows, commenting, or even posting content. It might be built on a framework like **Selenium** or use the unofficial Instagram API. This bot can be configured to, for example, follow users who use certain hashtags, or automatically like and comment on posts in your feed to increase engagement. By running on schedule, it helps grow an Instagram account (“insta-growth hacking”) and frees the user from repetitive social tasks. The bot operates with a degree of ritual: daily actions to attract the algorithm’s favor.

**Tags:** Python, Selenium, Instagram Private API, Social Media Automation

### **Instagram Follower Scraper**

**Description:** A tool to **scrape the list of followers/following** from Instagram accounts. Given one or more target usernames, it will retrieve the usernames (and possibly profile info) of everyone following them or whom they follow. This is useful for market research, building target lists, or analyzing competitor audiences. Implementation would involve either the Instagram web interface (parsing the follower list via Selenium or requests) or utilizing a library that can query Instagram’s endpoints. The script likely handles pagination (Instagram loads followers in batches) and outputs data as CSV or JSON. It’s a pure data-gathering utility in the social domain.

**Tags:** Python, Web Scraping, Instagram, Data Collection

### **InstaPy Quickstart Config**

**Description:** **InstaPy** is a well-known open-source Instagram bot library. This entry likely refers to a configuration or example script (Quickstart) for using InstaPy. It may contain settings for actions like “like 5 posts on hashtag X per day” or “follow-back followers”. Instead of building a bot from scratch, this project leverages InstaPy’s framework, showing the user’s ability to customize and integrate existing tools. The presence of this file indicates the user experimented with InstaPy’s declarative style of automation, tuning it to fit their needs while maintaining their *creative-technical* branding (perhaps with clever comments or settings).

**Tags:** Python, InstaPy, Instagram Automation

### **TikTok Comment Liker**

**Description:** A bot to automate **liking comments on TikTok**. This is a very specific action – possibly to game TikTok’s comment visibility (as liked comments may rise to the top or attract attention). The script might log into TikTok (through web automation, since TikTok’s API is private) and navigate to specific videos or profiles and like recent comments. Use cases: a creator might want to like every comment on their posts (to engage fans), or a marketer might like many comments containing certain keywords to signal-boost them. It shows proficiency in web automation on TikTok’s platform, which can be non-trivial due to dynamic content and anti-bot measures.

**Tags:** Python, Selenium, TikTok Web, Automation

### **Facebook Group Auto-Poster**

**Description:** A script (named `FB-Script-Auto-Post-All-Group`) that automates posting to **Facebook Groups**. If a user manages or is a member of many Facebook groups, this tool can take a message or link and post it across all those groups with one command. It likely uses a browser automation approach (since Facebook’s API is limited for group posting unless you have an app and permissions). The script handles logging in, navigating to each group’s post box, and submitting the content. It’s extremely useful for marketing or community managers who need to disseminate information widely. This falls under “Chaos Automation” as it wrangles multiple community channels at once.

**Tags:** Python, Selenium, Facebook Automation, Social Media

---

## **E-commerce & Web Automation**

### **Redbubble-Bot**

**Description:** An automation tool for **Redbubble**, a print-on-demand marketplace. This bot can assist artists by automating tasks like uploading designs, setting up product listings, or even performing favoriting and following on the platform for networking. Common features might include filling out the upload form (title, tags, description), selecting applicable products (t-shirts, stickers, etc.), and submitting the listing. It could also bulk-edit or manage existing listings. By using this, an artist could quickly deploy their artwork on dozens of products without the tedious web UI clicks. It exemplifies how even creative commerce can benefit from a bit of automation magic.

**Tags:** Python, Selenium, Web Automation, E-commerce

### **Redbubble Auto Uploader (Stickers)**

**Description:** A specialized script focused on **uploading sticker designs to Redbubble**. Stickers might have unique upload settings (such as a transparent PNG requirement, specific tagging, etc.), so this script ensures those are correctly handled. It possibly reads a folder of design files and systematically uploads each one, applies it to the sticker product category, and publishes it. The mention of “copy” in the repository suggests a duplicate or backup of this script, indicating iterative improvements. This tool dramatically speeds up populating a Redbubble store, turning what could be hours of manual uploading into an automated batch process.

**Tags:** Python, Selenium, Redbubble API (if any), Automation

### **POD-Auto (Print-On-Demand Automation)**

**Description:** A broader **Print-On-Demand automation** toolkit. While Redbubble is one platform, *POD-Auto* could target multiple POD sites (like Teepublic, Merch by Amazon, Society6, etc.). It might abstract the upload process so the same script or configuration can be used to deploy designs across various marketplaces. This involves navigating different website layouts and requirements, so having a unified tool is challenging and impressive. Alternatively, it might focus on one aspect like generating listing metadata (titles/descriptions) using AI and then feeding into site-specific uploader bots. It underscores scaling creative businesses through automation—upload once, sell everywhere.

**Tags:** Python, Selenium, Print-on-Demand, Multi-platform

### **Fiverr Data Scraper API**

**Description:** A script to interact with or scrape data from **Fiverr**, the freelance marketplace. It might use an API if available or simulate a browser to collect information on gigs, sellers, reviews, etc. Possible uses: market research (e.g., gather pricing data for certain services), lead generation (identify top freelancers in a category), or personal analytics (track one’s own gig rankings and reviews over time). Since Fiverr’s official API is limited, this likely involves web scraping pages of the site, dealing with pagination and possibly login if needed for certain data. This project shows skills in data acquisition from modern web apps, which often require handling dynamic content or rate limiting.

**Tags:** Python, Web Scraping, Fiverr, Data Mining

---

## **Creative Tools & Generative AI**

### **DALLe Automation (DALLe)**

**Description:** A project named **“DALLe”** that presumably automates interactions with OpenAI’s DALL·E (image generation model). It could provide a simple interface or script to generate images in bulk or based on a list of prompts. For example, feeding a list of concepts and automatically saving the resulting images, maybe even combining them into a gallery. Alternatively, it might integrate DALL·E into another pipeline (like generating visuals for videos or social media posts). This tool streamlines the use of AI art generation – turning it into a repeatable, codified process (an “art ritual”). Given the user’s style, it might also involve some **randomness or chaos** element to spur creativity (e.g., random prompt variations).

**Tags:** Python, OpenAI API, DALL·E, Generative Art

### **AI Comic Factory**

**Description:** A creative project aiming to produce **comics using AI**. There are two versions (`ai-comic-factory` and `ai-comic-factory-main`), indicating possibly an external fork and a customized version. This factory likely takes a script or storyline (maybe generated by GPT-4 or provided by the user) and then uses image generation (DALL·E, Stable Diffusion, or Midjourney via API) to create comic panels. It might lay them out in sequence, perhaps using image editing libraries to add speech bubbles or captions (which could also be AI-generated text). Essentially, it’s an attempt to automate comic book creation: from text story to visual storyboard. This project sits at the intersection of storytelling and generative art – a perfect example of code turning imagination into visual reality.

**Tags:** Python, Generative AI, Stable Diffusion/DALL·E, Image Processing

### **Leonardo AI Integration**

**Description:** **Leonardo** is an AI art platform (Leonardo.ai) known for generating images with fine control. This project likely integrates with Leonardo’s API or tools. It might automate batch image generation on Leonardo or use it within a pipeline (e.g., generate variations of an image, or use it as part of video creation by generating frames). It could also be a client to manage one’s assets on Leonardo (like downloading all generated images automatically). The presence of this script shows the user’s exploration of various AI art services, not just OpenAI’s. It demonstrates adaptability in using whichever creative AI tools are at hand and automating them for efficiency.

**Tags:** Python, Leonardo.ai API, Generative Art

### **AutoTypography (Lyrics Video Maker)**

**Description:** A unique creative automation that takes song lyrics and produces **typographic visuals or lyric videos**. Likely, it reads a lyrics file and then uses either motion graphics (maybe scripting After Effects via an API or using something like MoviePy/PIL for simpler kinetic text) to create a video where the lyrics appear in sync with music in stylish fonts and animations. It could also generate static images for verses or an entire poster with artistic text layout. This tool helps create engaging content for music (think of those animated lyric videos on YouTube) without manual editing. It combines understanding of text (maybe detecting song structure: verses, chorus) with design rules for typography. A very cool fusion of code and design.

**Tags:** Python, FFmpeg/MoviePy, Typography, Creative Automation

### **Image-GPT Experiment**

**Description:** A small experiment script named `image-gpt.py` suggests an exploration of using GPT (or similar models) for image-related tasks. This could be a few things: using GPT to generate descriptions for images (alt-text generator), using GPT to output images in ASCII or another format, or interacting with a model like OpenAI’s Vision (if available). Given the timeline, perhaps it’s a project to feed image data to GPT (though GPT-3.5 can’t directly process images, there is a separate Vision model). More likely, it’s a prototype where GPT generates text that is then interpreted as an image (like SVG code or ASCII art). In any case, it’s an experimental blend of text and image generation.

**Tags:** Python, OpenAI GPT, Experimental, Generative Art

### **Lyrics Keys Indo (Music Analysis)**

**Description:** This project appears to revolve around **music analysis**, possibly identifying the musical key of songs or extracting keywords from lyrics, specifically with some relation to “Indo” (which likely stands for Indonesian). It might be a dataset or collection of Indonesian song lyrics where the script analyzes them to find their musical key (A minor, C major, etc.) or thematic keys (common topics). Another interpretation: it translates lyrics or extracts key phrases (hence keys) in the Indonesian language. This could involve using a library like **librosa** for audio key detection if it had audio input, or linguistic processing for text. The mix of music and language indicates a specialized use-case, perhaps for creating regional music metadata or for a personal project related to Indonesian music.

**Tags:** Python, Music Analysis, NLP, *Experimental*

---

## **Web & Gallery Generators**

### **Auto-HTML Gallery Scripts**

**Description:** A set of scripts designed to automatically generate an **image gallery webpage** from a folder of images. When run, it scans a directory for images and produces an HTML file (and possibly CSS/JS) that displays those images in a nice gallery layout (thumbnails, lightbox, etc.). This is great for quickly sharing a collection of photos without manually coding a webpage. It might also handle resizing or optimizing images for web. The term “scripts” (plural) suggests there may be multiple versions or supporting scripts, perhaps one to generate the gallery and another to update it when new images are added. This tool reflects the theme of automation applied to a creative presentation task—turning a heap of image files into a browsable web gallery instantly.

**Tags:** Python, HTML/CSS generation, Image Processing, Utility

### **Auto HTML Album Generator**

**Description:** Similar to the gallery scripts, this likely creates a **photo album** style webpage. It might organize images into albums or categories, create an index page linking to multiple galleries, or add extra album-like features (captions, dates, etc.). Possibly used for sharing images from events, the script could take subfolders (each subfolder is an album) and make a multi-page website. The difference in naming (gallery vs album) suggests a slight variation in format or purpose, but fundamentally it is about automating static website creation for images. This highlights efficiency in something often done by hand or with heavy software—here it’s done with a quick script.

**Tags:** Python, Static Site Generation, Images, Web Dev

### **SimpleGallery (Final Version)**

**Description:** **SimpleGallery** is a project (with multiple iterations) focused on creating an easy-to-use image gallery application or webpage. The “FINAL” version indicates a polished outcome of previous prototypes. It likely provides a minimalistic interface to view images, possibly with features like drag-and-drop to add new pictures, or an interactive slideshow. This final version might be a standalone app (maybe a Flask web app or a tiny GUI) given one variant is called “app”. It supports the idea that the user refined their approach over time: starting from basic HTML generation to perhaps a more dynamic or user-friendly tool. The final SimpleGallery would be the go-to for showcasing images effortlessly, aligning with the creative-technical brand by packaging the functionality in an elegant form.

**Tags:** Python, HTML/JS, Image Gallery, Web App

### **SimpleGallery App**

**Description:** Likely a version of SimpleGallery that was turned into an “app” – possibly using a GUI library (PyQt/Tkinter) or a web framework to allow users to input settings and generate galleries without touching code. It might have a simple interface where you choose a folder and the app outputs the gallery for you. This makes the tool accessible to non-programmers. It underscores the user’s approach of not just writing scripts for themselves, but also considering how to **package the magic for others** to use easily, which is an important aspect of portfolio-worthy projects.

**Tags:** Python, GUI/Flask, Image Gallery, Usability

### **SimpleGallery v2**

**Description:** An earlier iteration of SimpleGallery (perhaps the second prototype). This could have different features or a different approach – for example, the first version might have been pure HTML output, and by v2 they added some JavaScript for nicer viewing, etc. While the final encompasses the end result, v2 is documented likely for completeness and to show progress. It might be functional but lacked some polish or features that the final has. It’s included here as a stepping stone, illustrating the developmental journey.

**Tags:** Python, Web Development, Image Gallery, Version-2

### **HTML YouTube Embedder**

**Description:** A script to quickly generate HTML code for embedding YouTube videos on a webpage (named `HTML-Embed-youtube-videos-on-webpage`). This tool probably takes a list of YouTube video URLs or IDs and produces the corresponding `` embed code, possibly wrapped in a nice layout (like a grid of video players or a responsive design). It could also fetch video titles or thumbnails via the YouTube API to make a more informative embed (like thumbnail linking to video). This is a small but handy utility for anyone who wants to create a webpage with many embedded YouTube videos without copying and pasting each embed code manually. It resonates with the user’s tendency to eliminate repetitive tasks through scripting.

**Tags:** Python, HTML Generation, YouTube API, Utility

### **ComicGallery**

**Description:** A project likely aimed at creating an online **gallery for comics** or comic-like images. It might scrape comic images from a source and then display them, or it could be a viewer for a local collection of comics (perhaps image scans or digital comic pages). Features could include page navigation, maybe a lightbox or a slideshow for reading through the comic sequence. If it’s tied to the AI Comic Factory, ComicGallery might serve as the front-end to display AI-generated comics. Essentially, it’s about showcasing visual narrative content. The name suggests an emphasis on sequential art presentation, which has its own nuances (like preserving order, maybe adding captions). This rounds out the creative projects by not just generating content (comics) but also presenting them nicely.

**Tags:** Python, Web Display, Comics, Creative Tool

---

## **Utility & File Management Scripts**

### **Drive Image Link Converter**

**Description:** A quick utility to convert Google Drive image share links into direct image URLs that can be embedded elsewhere. Google Drive links by default don’t serve raw images, but by altering the URL (or using Drive API) you can get a direct link. This script automates that conversion: input a Drive share URL and get a usable direct link. Useful for bloggers or markdown writers who host images on Drive but need to embed them. It reflects solving a niche annoyance with a bit of code, making the workflow smoother for anyone who faced the same problem (the hallmark of a pragmatic tool).

**Tags:** Python, URL manipulation, Google Drive, Utility

### **Python-Organize (File Organizer)**

**Description:** A script to **organize files** on a computer automatically. Run it in a messy folder, and it can sort files into subfolders by file type, date, or other criteria. For example, it might move all `.png` and `.jpg` into an “Images” folder, PDFs into “Documents”, etc., or sort a download folder by month. This is extremely handy for decluttering. The existence of both *Python-organize* and a similar named *organize* suggests one might be a refined version of the other or simply the same script referenced differently. The tool demonstrates how mundane file management can be turned into a hands-free operation.

**Tags:** Python, OS File Management, Productivity, Utility

### **Sort & Sorting Scripts**

**Description:** These scripts (possibly named just `Sort` and `sorting`) are likely related to organizing as well, but maybe focusing on **sorting lines in a text file** or sorting items in some other context (the names are a bit generic). They might also be prototypes of the organizer above. If text-sorting: one could take an input file and output it sorted alphabetically or numerically (like a custom sort utility). If file-sorting: perhaps a simpler or earlier attempt at what Python-Organize achieved. In any case, they reflect solving an ordering problem via code. The portfolio includes them for completeness, though their functionality might be encompassed by more advanced tools.

**Tags:** Python, Sorting, Files/Text, Utility

### **Clean Organizer**

**Description:** Possibly a variant or add-on to the organizer script, focusing on **cleaning up directories**. “Clean” could mean removing unnecessary files (like caches, temp files, duplicates) or renaming files to a consistent format. This script might, for example, delete all `Thumbs.db` or `.DS_Store` files lurking in a folder tree, or standardize file names (lowercase, no spaces, etc.). By keeping a workspace clean, it ties into the theme of reducing entropy in one’s digital environment – a fitting task for someone turning chaos to order.

**Tags:** Python, File Cleanup, Utility

### **Remove-BG CLI**

**Description:** An interface to the **remove.bg** service (which removes image backgrounds automatically). This script likely takes an input image (or a batch of images) and uses remove.bg’s API to strip the background, saving the new transparent-background images. It turns a typically manual task – uploading to the website – into a command-line batch process. This is very useful for graphic design pipelines, e.g., preparing product images or portraits. It highlights how third-party AI services can be integrated into custom workflows, and showcases knowledge of working with an external API and file I/O in Python.

**Tags:** Python, remove.bg API, Image Processing, Automation

### **File Format Convertors**

**Description:** Under the `convertors` category, presumably a collection of scripts to convert files from one format to another. This might include things like: image format converters (PNG to JPG, etc.), document converters (CSV to Excel, JSON to CSV), or media converters (MP4 to MP3 extraction, which might overlap with other projects). Having a directory of such convertors suggests the user built a toolkit of one-off converters for various freelance or personal tasks. It’s like a Swiss army knife for format shifting. Including this in the portfolio demonstrates thoroughness in addressing all the little tasks that glue bigger projects together – often overlooked but very valuable.

**Tags:** Python, PIL/OpenCV (for images), Pandas (for CSV/JSON), FFmpeg, Utility

### **Download-All-The-GIFs**

**Description:** A playful-named script to **bulk download GIFs** from a source. The source could be a website or API (maybe Giphy or a specific subreddit with lots of GIFs). Essentially, given a URL or query, it finds all GIF images and downloads them locally. It could also be a web scraper that finds all `.gif` links on a given webpage or set of pages. The whimsical name matches the spirit of some internet memes (“X all the Y”). This tool likely was made to avoid the tedium of right-click-saving dozens of GIFs. It demonstrates web scraping ability and also a bit of fun personality in coding.

**Tags:** Python, Web Scraping, Requests/BS4, Media

### **Tarball Archive Creator**

**Description:** Based on `Create_tar.gz_Archive.html` reference, this script automates creating a `.tar.gz` archive from specified files or folders. It’s essentially a Python wrapper around tar/gzip, allowing programmatic archiving. While one can do this with command-line, having a script might enable conditional or repeated archives (e.g., archive all folders in a directory individually, or create backups with timestamped filenames via schedule). This is about **packaging chaos into order** – taking many files and bundling them neatly. The script likely uses Python’s `tarfile` library or calls system `tar`. It might have been born from a need to compress results or code for distribution.

**Tags:** Python, tarfile/OS, Archiving, Utility

### **Duplicate File Finder**

**Description:** Stemming from `Search_for_Duplicate_Files`, this is a utility to identify duplicate files in a system. It could use hashing (MD5/SHA) to compare files by content or just compare names and sizes for quick finds. The outcome is typically a report of duplicates and perhaps an option to delete them. Combined with the above “Clean” and “Organize” tools, it completes the maintenance suite for file management. Possibly the user integrated an existing tool like `fdupes` (which is mentioned) by wrapping it or invoking it via Python for convenience. This underscores attention to optimizing storage and eliminating waste – very much in line with a tidy, efficient workflow.

**Tags:** Python, File I/O, Hashing, System Utility

---

## **Adobe Automation Scripts**

### **Create Photo Grid (Photoshop)**

**Description:** An ingenious script that automates Adobe Photoshop to create a **photo grid collage**. Given a folder of images (e.g., artwork or photos), this script opens Photoshop via AppleScript (on macOS) or possibly via the COM interface (on Windows) and arranges the images into a grid within a single canvas. It likely determines grid dimensions (e.g., 5x5 images), resizes images to fit cells, and uses Photoshop’s scripting to place each image. The reference in the code shows usage of **JavaScript for Photoshop (ExtendScript)** and **AppleScript** to drive the process. This means the user orchestrated a multi-layer automation: Python -> AppleScript -> Photoshop JavaScript, to achieve what normally would require tedious manual work or expensive plugin. The result is a perfectly aligned mosaic of images (for example, generating contact sheets, Instagram photo grids, etc.) in a single Photoshop file or export image.

**Tags:** Python, AppleScript/JS, Adobe Photoshop, Automation, Creative Workflow

python

``

```jsx
# Snippet: Automating Photoshop for a 5x5 image grid (via AppleScript)
js_code = """
    // Photoshop JavaScript: create a new document and arrange images in a grid
    var gridWidth = 5, gridHeight = 5;
    // ... (open each image file, resize and position it into the grid) ...
"""
apple_script = f'''
tell application "Adobe Photoshop 2021"
    activate
    do javascript "{js_code}"
end tell
'''
run_applescript(apple_script)  # Executes the automation in Photoshop
```

### **Photoshop Mockup Automation**

**Description:** This project targets the automation of **mockup creation** in Photoshop. Designers often have to put their artwork into mockup templates (like showing a logo on a t-shirt, or art in a frame). Doing this manually for dozens of designs is time-consuming. This script likely opens a Photoshop mockup file, replaces the placeholder (smart object) with a given input image (the design), and then saves out the result (e.g., a JPEG of the design on a product). By looping this process, it can generate hundreds of product mockup images in one go. The script might utilize Photoshop’s COM automation on Windows or AppleScript on Mac, similar to the Photo Grid. It demonstrates automation in the graphic design workflow, empowering the user to produce professional visuals at scale – a clear blend of **technical automation and creative output**.

**Tags:** Python, Photoshop Scripting, Design Automation, Productivity

---

## **Miscellaneous & Experimental**

### **Riddle-Game**

**Description:** A small fun project – likely a **text-based riddle game** implemented in Python. The user may input answers to riddles, and the script checks them or gives hints. It might contain a collection of riddles (perhaps loaded from a file or API) that it quizzes the player on. This could have been an exercise in simple game design or just a playful coding session. While not directly on the automation or AI theme, it shows the lighter, creative coding side and the ability to handle user input/output in a program. Possibly it was also a test-bed for using GPT to generate riddles or to evaluate answers (tying it subtly to the AI theme).

**Tags:** Python, Game, Fun, *Experiment*

### **X-Python (Sandbox)**

**Description:** A directory or script that served as an **experimental sandbox** for the user. It might contain assorted Python snippets, testing of libraries, or concept proofs that don’t constitute a full project on their own. The name “x-python” suggests a placeholder or scratch space. This is where creative chaos likely reigned as the user tried out ideas (some of which evolved into the projects listed above). It’s included to acknowledge the ever-present undercurrent of exploration in a developer’s journey.

**Tags:** Python, Experiments, Scratch-work

### **Trashy-Python (Scratch Pad)**

**Description:** Similarly, this represents a **“trashy”** or throwaway collection of scripts – maybe quick-and-dirty solutions written to solve immediate problems, later superseded by cleaner versions. It could be literally scripts used to parse or clean up “trash” files (like removing junk files, etc.), but more likely it’s a tongue-in-cheek name for the scratch pad. It shows that not every code is glamorous; sometimes messy experimentation is needed to eventually achieve polished results. In the portfolio context, it’s a nod to authenticity – behind each polished automation, there might be a pile of drafts and mistakes that were essential in the creative process.

**Tags:** Python, Misc, *In Progress*

### **Colab Notebooks**

**Description:** The repository contains a `colab` folder, indicating **Jupyter notebooks (Colaboratory)** used for experiments. These could range from data science explorations, training small ML models, or trying out APIs in an interactive way. Colab is often used for quick tests especially when GPUs are needed or sharing results with others. The presence of notebooks (with ~19% of the repo being Jupyter Notebook by the stats) means the user not only writes scripts but also engages in exploratory data analysis or prototyping in a notebook environment. This could include visualizations, step-by-step AI model usage, etc. It adds depth to the portfolio, showing the researcher side of the user’s skill set.

**Tags:** Jupyter Notebook, Prototyping, Data Analysis, Experiments

### **TableContentsPython (Repo TOC Generator)**

**Description:** This meta-script likely generates a **table of contents for the repository’s Python scripts**. Perhaps the user wrote it to automatically produce the list of projects (which could have even been used in preparing this very catalog!). It probably scans directories, reads file names or docstrings, and outputs a structured list. This demonstrates reflective automation – using code to document code. It aligns with the user’s organized approach to chaos: even their numerous experimental scripts can be indexed and cataloged by another script. This tool ensures that as the repository grows, one can keep track of everything inside, reinforcing the notion of an *“interactive content hub”* where each piece knows its place.

**Tags:** Python, File System, Introspection, Meta-automation

### **Misc One-off Scripts**

**Description:** In addition to the above, there are various one-off Python scripts with numeric or unique names (e.g., `8mb.py` for video compression to <8MB, `300dpi.py` to adjust image DPI, `2leomotion.py` perhaps an experiment with motion interpolation, etc.). Each of these addresses a specific task or problem the user encountered. While individually small, they collectively showcase a **breadth of problem-solving**. For instance:

- **8mb.py series:** Likely a set of scripts to compress or split videos to fit under file size limits (e.g., Discord’s 8 MB upload limit). They use FFmpeg to reduce quality or cut video intelligently.
- **300dpi.py:** Ensures images meet a 300 DPI resolution standard, possibly for print. It might batch-convert images to the required DPI without resizing.
- **1500-cutout-orn-process.py:** Could be a very niche image processing pipeline (the name hints at “cutout” – perhaps removing backgrounds or slicing images into ornaments?). Possibly related to some art project.
- **15days.py / 2025-vid.py:** These might be date-related or video timeline experiments (15 days timelapse generator? A video for year 2025?).
- **9mb.py:** Similar to 8mb, just another variant or threshold.
- **2leomotion.py:** Perhaps a script combining “Leo” (Leonardo?) and “motion” – maybe generating animations from images or using the Leonardo AI in a video context.
- Others with cryptic names are likely tied to the experiments with AI and media.

Though it’s not necessary to detail each of these, they collectively emphasize the user’s habit of **quickly scripting solutions for every odd task**, which is a strength of a creative coder. They round out the portfolio as evidence of hands-on experience and an ever-curious mind that tries things out.

**Tags:** Python, FFmpeg, ImageMagick, One-off Solutions, *Assorted*

---

Each project in this catalog is a testament to an overarching ethos: **technology as creative empowerment**. From automating tedious tasks to weaving AI into art, these scripts and tools form an ecosystem – an **“AI Alchemy” lab – where code transfigures chaos into order and imagination into reality. Whether it’s a social media spell, a data ritual, or an artistic incantation, this portfolio embodies a fusion of **poetic automation** and practical innovation, true to the user’s unique creative-technical brand. Welcome to the hub of **Chaos Automation**, where every script is both a tool and a story.

06:20 PM18:20