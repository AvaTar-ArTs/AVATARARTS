# Viral Reel Scraper and Content Calendar Tool

- **Conversation ID:** `b7e56948-a1b5-4ae5-aa23-526e371759d0`
- **Inserted at:** `2025-03-10T05:48:48.629000+08:00`
- **Updated at:** `2025-03-10T05:49:50.522000+08:00`

---

### 1. User  
 - model: `deepseek-reasoner` | time: `2025-03-10T05:48:49.129000+08:00`

```markdown
do some deep seo/keyword/tag researcg on tiktok/youtube/instagram so i can find the top rising trend hashtags and keys..

Also, if possible:
 I need to create a tool that pulls the top reels on Instagram for a certain search keyword, analyzes them, and creates a content calendar based on the insights from those reels.

Details blow

Pulling Viral Reels

INPUT:
Search instagram keyword
Pull top 100 Reels based on views and engagement. These reels must be at least 90% organic views.

Criteria for viral reels (this needs to be able to be changed)

Views: 100K+
Likes: 1K+
Shares: 100+
Comments: 100+
Views geo: 75%+ US, CA, AUS, UK
Views timeframe: 50% of views from last 30 days
OUTPUT: Spreadsheet with this data in columns:

(A) Video link

(B) Views from last 30 days
(C) Total Views
(D) Total Likes
(E) Total Shares
(F) Total Comments

(G) Video hook - you will use an OCR tool to pull the text that is visible during the first 1 seconds of the reel (e.g. text overlay). This the the ‘hook’

(H) Reel style (b-roll, talking head, green screen, comedy, meme, reaction)

(I) Screenshot of first 1s of video

(J) Caption

Analyzing Viral Reels

INPUT
Then I will give input and tell you my brand and my audience and my instagram handle.  
ANALYZE From there I want you to use insights from the viral reels and recreate reels for me baed on the insights.

Analyze:

Hook
Caption
Reel style (b-roll, talking head, green screen, comedy, meme, reaction)
Thematic video elements
General analysis of why this worked
OUTPUT
Create 30 days of viral reels for my content based on the analysis.

(A) Video link that was the inspiration
(B) Reel Style
(C)Video Hook
(D) Entire Video Text overlay (if broll style)
(C) Video Text Script (if talking head)

I would like this for IG first, then we can re-hire for TikTok and other platforms. My goal is to build this + build a relationship with a developer for multiple projects!
```

### 2. Think  
 - model: `deepseek-reasoner` | time: `2025-03-10T05:48:49.129000+08:00`

```markdown
Okay, let's break down what the user is asking for. They want to do deep SEO/keyword/hashtag research on platforms like TikTok, YouTube, and Instagram to find rising trends. Then, they want a tool that pulls top Instagram Reels based on specific criteria and generates a content calendar from that analysis. 

First, I need to outline the steps for the SEO and keyword research part. For each platform, the methods might differ. For Instagram, hashtag research is crucial, while YouTube relies more on keywords and tags. TikTok uses trending sounds and challenges. I should mention tools like Instagram's native search, Keyword Tool, and third-party platforms like Hootsuite or Later for hashtag tracking. Also, TikTok's Creative Center and YouTube's Keyword Planner could be useful.

Next, the tool development part. The user wants to scrape Instagram Reels with certain viral criteria. But Instagram's API is limited, so maybe using a third-party service or web scraping with Python libraries like Selenium or BeautifulSoup. However, they need to ensure the views are 90% organic, which complicates things. Maybe look into engagement metrics versus follower count to estimate organic reach. 

The criteria for viral Reels are strict: views over 100K, likes 1K+, etc. The tool needs to filter based on these, which can be adjusted. The output is a spreadsheet with video links and various metrics. Then, using OCR for the video hook. Tesseract OCR with Python could work here, but processing the first second of the video would require frame extraction, maybe with OpenCV. 

For the analysis part, once the data is collected, they need to analyze hooks, styles, captions, etc. Then, generating a content calendar based on these insights. The user wants 30 days of content ideas inspired by the top Reels. 

Challenges: Instagram's API limitations and data privacy issues. Web scraping might be against Instagram's terms, so they might need to use approved third-party tools. Also, ensuring the views are mostly organic could be tricky. Maybe checking if the account has a high follower count vs. views ratio. If a Reel has 100K views but the account only has 1K followers, it's more likely organic. 

The tool would need to process each Reel, extract metadata, run OCR on the first frame, classify the style (maybe using a simple dropdown or ML model if possible), and compile everything into a spreadsheet. For the content calendar, the analysis would involve identifying common elements in successful Reels and adapting them to the user's brand. 

Potential developers would need expertise in Python, API integration, web scraping, OCR, and maybe frontend for a UI. They should also be aware of legal aspects regarding data scraping. 

I should also mention alternatives if building the tool is too complex, like using existing platforms like Hootsuite or Sprout Social for analytics, and Later for content calendaring. Maybe a hybrid approach using existing tools and custom scripts for specific tasks. 

Finally, the user wants a relationship with a developer for multiple projects, so scalability and maintainability of the tool are important. They might need a backend with a database to store scraped data, a frontend for inputting keywords and adjusting criteria, and automated reporting features.
```

### 3. Assistant  
 - model: `deepseek-reasoner` | time: `2025-03-10T05:48:49.129000+08:00`

```markdown
Here's a structured plan to achieve your goals, including technical requirements, tools, and developer considerations:

---

### **Phase 1: Keyword/Hashtag Research for TikTok/YouTube/Instagram**
#### **Tools & Methods**
1. **Instagram**:
   - Use Instagram’s native search (autocomplete suggestions for keywords/hashtags).
   - Tools: Later, Hootsuite, Meta Business Suite, Keyword Tool (keywordtool.io), Display Purposes.
   - Track rising hashtags with *RiteTag* or *Hashtagify*.

2. **TikTok**:
   - TikTok Creative Center (official trending data).
   - Tools: Pentos, TrendTok, VidIQ, Exploding Topics.
   - Analyze trending sounds/challenges in your niche.

3. **YouTube**:
   - YouTube Search Autocomplete & Trending Page.
   - Tools: TubeBuddy, VidIQ, Google Trends, Ahrefs.
   - Filter by "Last 30 days" to find rising trends.

#### **Action Steps**:
- Export keyword/hashtag lists and prioritize by search volume/competition.
- Focus on hashtags with growing usage (e.g., #BookTok → #BookReviewTok).

---

### **Phase 2: Viral Reel Scraper & Analysis Tool**
#### **Core Features**
1. **Data Scraping**:
   - Use **Python + Instagram API** (limited) or third-party tools like *Phantombuster* or *Apify*.
   - Filter reels by:
     - Views (100k+), likes (1k+), shares (100+), comments (100+).
     - Geo-location (US/CA/AUS/UK) via proxy/IP filtering.
     - 50%+ views from the last 30 days (use timestamp analysis).

2. **OCR for Video Hooks**:
   - Use **Tesseract OCR** (Python) or AWS Rekognition to extract text from the first 1 second of reels.
   - Integrate with *OpenCV* for frame extraction.

3. **Reel Style Classification**:
   - Train a simple ML model (TensorFlow/PyTorch) to categorize styles (b-roll, talking head, etc.) or use manual tagging.

4. **Output Spreadsheet**:
   - Automate with Python libraries like *Pandas* and *OpenPyXL*.

#### **Developer Requirements**:
- Backend: Python (scraping, data analysis), API integration.
- Frontend: Optional dashboard (React.js/Django).
- Budget: $5k–$15k+ depending on complexity.

---

### **Phase 3: Content Calendar Generator**
#### **Workflow**
1. **Input Brand Details**:
   - Audience demographics, brand voice, Instagram handle.

2. **Analysis Engine**:
   - Identify patterns in hooks, captions, and styles from scraped reels.
   - Use NLP (e.g., spaCy) to analyze caption sentiment/CTAs.

3. **Content Scripting**:
   - Generate 30-day calendar with:
     - Video concepts inspired by top reels.
     - Customized hooks/scripts (e.g., "5 Secrets to..." if trending).
     - Recommended posting times based on audience activity.

#### **Output**:
- Spreadsheet/PDF with daily reel ideas, scripts, and inspiration links.

---

### **Phase 4: Developer Hiring & Execution**
#### **Hiring Tips**
1. **Skills Needed**:
   - Python (scraping, OCR, data analysis).
   - Experience with Instagram API/TikTok API.
   - Frontend (if building a dashboard).

2. **Platforms**:
   - Upwork, Toptal, or GitHub to find developers with portfolio projects in social media analytics.

3. **MVP Approach**:
   - Start with a basic scraper (proof of concept), then add OCR/ML features.

#### **Cost-Saving Alternatives**:
- Use no-code tools like *Zapier* + *Airtable* for manual analysis.
- Leverage existing tools like Hootsuite (analytics) and Canva (content creation).

---

### **Example Output (Content Calendar)**
| Day | Reel Style      | Hook Text             | Script Idea                          | Inspiration Link       |
|-----|-----------------|-----------------------|--------------------------------------|------------------------|
| 1   | B-Roll          | "You’re doing it WRONG!" | Show quick cuts of common mistakes + solutions. | [Link]                |
| 2   | Talking Head    | "I quit my 9-5 for this" | Share a personal story with cuts to b-roll.     | [Link]                |

---

### **Next Steps**
1. Start with Instagram scraper development.
2. Hire a Python developer (post a job on Upwork with this spec).
3. Test the MVP with 1-2 keywords before scaling.

Let me know if you need help drafting a job post or evaluating developers!
```
