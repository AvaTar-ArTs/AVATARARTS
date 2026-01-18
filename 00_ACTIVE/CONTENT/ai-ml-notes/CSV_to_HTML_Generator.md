Here's a refined Python script to format your CSV data into the desired HTML template. The code handles the necessary formatting clearly, including managing missing data and creating pagination with 50 entries per page.

You can now run this script to generate your formatted HTML file. Let me know if you need further adjustments!

The CSV has been successfully reformatted. You can download the new CSV file from the link below:

[Download the reformatted CSV](sandbox:/mnt/data/Discography_Reformatted.csv)

Here's a complete Python script that uses your reformatted CSV file to generate HTML output structured similarly to the provided HTML example (`suno.html`). This script generates individual song cards with detailed styling and structure consistent with your uploaded HTML sample:

Your script is now updated to generate an HTML file structured similarly to the provided `suno.html` example, complete with styled song cards and detailed content sections. Let me know if there's anything else you'd like to adjust!

This error occurs because some entries in your `'content'` column are being treated as floating-point numbers (`NaN`) instead of strings. You can resolve this by explicitly converting the `'content'` column values to strings before attempting to split.

Here's a quick fix for your issue:

Replace your existing line 72:

```python
bullet_points = ''.join([f'<li>{bp.strip()}</li>' for bp in row['content'].split('•')[1:] if bp.strip()])
```

with this safer version:

```python
bullet_points = ''.join([
    f'<li>{bp.strip()}</li>' 
    for bp in str(row['content']).split('•')[1:] if bp.strip()
])
```

This ensures all data are safely converted to strings before splitting, preventing the `AttributeError`.

Update your code with this change, and it will resolve the issue. Let me know if you encounter anything else!

Your current error occurs because the code is attempting to split the 'Analysis' field by the literal string `"Themes and Messages:"`, which isn't reliably present or consistent across all records. Additionally, multi-line fields in CSVs can cause parsing issues.

Here's a robust fix to handle the extraction of "Themes and Messages" and "Emotional Arc" safely, even if some records don't follow the exact formatting:

Replace your current block for parsing themes and emotional arc:

```python
themes = row['Analysis'].split('Themes and Messages:')[-1].split('Emotional Arc:')[0].strip()
emotional_arc = row['Analysis'].split('Emotional Arc:')[-1].strip() if 'Emotional Arc:' in row['Analysis'] else 'N/A'
```

With this improved logic:

```python
analysis_text = str(row['Analysis'])

# Extract Themes
if 'Themes and Messages:' in analysis_text:
    themes_part = analysis_text.split('Themes and Messages:')[-1]
    themes = themes_part.split('Emotional Arc:')[0].strip() if 'Emotional Arc:' in themes_part else themes_part.strip()
else:
    themes = 'N/A'

# Extract Emotional Arc
if 'Emotional Arc:' in analysis_text:
    emotional_arc = analysis_text.split('Emotional Arc:')[-1].split('\n')[0].strip()
else:
    emotional_arc = 'N/A'
```

This approach ensures that both fields default gracefully to `'N/A'` if the expected format isn't found.

Integrate this adjusted block into your script, and it will reliably handle inconsistent data formats in the `Analysis` field without errors.

The code has been updated with improved handling of the "Analysis" field to ensure robust parsing. Let me know if you encounter any other issues or need further assistance!

I've updated the code to handle cases where fields may be empty or missing, preventing the AttributeError you've been encountering. Let me know if you have any other issues or need additional adjustments!

The error you're encountering (`KeyError: ' font-family'`) occurs because Python's `str.format()` method is trying to interpret curly braces `{}` used in the CSS within the HTML template. To avoid this, you'll need to escape these braces by doubling them `{{}}`.

Here's a quick, clear fix:

### Update your `html_template` variable:

Replace this:
```html
<style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    ...
</style>
```

with this (escaping curly braces properly):
```html
<style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}
    .song-card {{ background: white; border-radius: 8px; }}
    ...
</style>
```

Here's a corrected and simplified Python code snippet for your use:
```python
import pandas as pd
from datetime import datetime

# Load CSV file and handle missing values
df = pd.read_csv('Discography_Reformatted.csv').fillna('')

# HTML Template
html_template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Avatar Arts Full Discography</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
               max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f5f5f5; }}
        .song-card {{ background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      margin-bottom: 1.5rem; padding: 1.5rem; transition: transform 0.2s; }}
        .song-card:hover {{ transform: translateY(-2px); }}
        .song-header {{ display: flex; justify-content: space-between; }}
        .tags {{ margin: 1rem 0; }}
        .tag {{ background: #f0f0f0; padding: 0.25rem 0.75rem; border-radius: 20px; }}
    </style>
</head>
<body>
    <h1>🎵 Avatar Arts Discography ({count} tracks)</h1>
    {content}
</body>
</html>'''

# Song template
song_template = '''
<div class="song-card">
    <h2>{title}</h2>
    <small>{created_time}</small>
    <div>{tags}</div>
    <h3>🎯 Key Features</h3>
    <ul>{bullet_points}</ul>
    <div><strong>Themes:</strong> {themes}</div>
    <div><strong>Emotional Arc:</strong> {emotional_arc}</div>
</div>'''

# Process data
content = []
for _, row in df.iterrows():
    created_time = datetime.strptime(row['Created time'], '%B %d, %Y %I:%M %p').strftime('%b %d, %Y %H:%M')
    tags = ' '.join(f'<span class="tag">{tag}</span>' for tag in str(row['Keys']).split(', ') if tag.strip())
    bullet_points = ''.join(f'<li>{bp.strip()}</li>' for bp in str(row['content']).split('•')[1:] if bp.strip())
    
    analysis_text = str(row['Analysis'])
    themes = analysis_text.split('Themes and Messages:')[-1].split('Emotional Arc:')[0].strip() if 'Themes and Messages:' in analysis_text else 'N/A'
    emotional_arc = analysis_text.split('Emotional Arc:')[-1].split('\n')[0].strip() if 'Emotional Arc:' in analysis_text else 'N/A'

    song_entry = song_template.format(
        title=row['Song Title'],
        created_time=created_time,
        tags=tags,
        bullet_points=bullet_points,
        themes=themes,
        emotional_arc=emotional_arc
    )
    content.append(song_entry)

# Finalize HTML
html_content = html_template.format(
    count=len(df),
    content=''.join(content)
)

# Save HTML file
with open('avatar_arts_discography.html', 'w') as f:
    f.write(html_content)

print("HTML file generated successfully!")
```

### Explanation:
- Escaped curly braces (`{{` and `}}`) in CSS prevent `KeyError` when using `.format()`.
- Ensured that missing values are safely handled.
- Clean and concise rendering logic.

This version should run smoothly without the KeyError. Let me know if you need further adjustments!

You have uploaded a Python file (`suno.py`). Could you please clarify how you'd like me to use this file? For example:

- Do you want me to extract data from your provided HTML into the format used in your Python script?
- Or, do you prefer converting the HTML content directly into CSV or structured data?

Let me know your specific goal!

You're encountering the `KeyError: ' font-family'` because Python's `.format()` method interprets `{}` as placeholders. In your HTML template, the CSS styles also use curly braces `{}` which conflict with the `.format()` method. To fix this issue, you need to escape these curly braces in the CSS by doubling them (`{{` and `}}`).

Here's a **fully corrected and robust Python script** that handles your CSV data correctly, with the necessary CSS escaping:

### ✅ **Fixed and Ready-to-use Python Script**:

```python
import pandas as pd
from datetime import datetime

# Load the reformatted CSV file
df = pd.read_csv('Discography_Reformatted.csv').fillna('')

# HTML template with properly escaped braces
html_template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Avatar Arts Full Discography</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
               max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f5f5f5; }}
        .song-card {{ background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      margin-bottom: 1.5rem; padding: 1.5rem; transition: transform 0.2s; }}
        .song-card:hover {{ transform: translateY(-2px); }}
        .song-header {{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }}
        .song-title {{ font-size: 1.25rem; color: #2d2d2d; margin: 0; font-weight: 600; }}
        .created-time {{ color: #666; font-size: 0.9rem; }}
        .tags {{ display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0; }}
        .tag {{ background: #f0f0f0; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; color: #444; }}
        .section {{ margin: 1.5rem 0; padding: 1rem; background: #f8f8f8; border-radius: 6px; }}
        .section h3 {{ margin-top: 0; color: #3d3d3d; font-size: 1rem; margin-bottom: 0.75rem; }}
        .bullet-list {{ padding-left: 1.5rem; margin: 0; }}
        .bullet-list li {{ margin-bottom: 0.5rem; line-height: 1.5; }}
        .analysis-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }}
        .analysis-card {{ padding: 1rem; background: white; border-radius: 6px; border-left: 4px solid #e0e0e0; }}
    </style>
</head>
<body>
    <div class="database-header">
        <h1>🎵 Avatar Arts Discography</h1>
        <div class="database-stats">{count} tracks · Last updated {last_updated}</div>
    </div>
    {content}
</body>
</html>'''

# Song card template
song_template = '''
<div class="song-card">
    <div class="song-header">
        <h2 class="song-title">{title}</h2>
        <div class="created-time">{created_time}</div>
    </div>
    <div class="tags">{tags}</div>
    <div class="section">
        <h3>🎯 Key Features</h3>
        <ul class="bullet-list">{bullet_points}</ul>
    </div>
    <div class="section">
        <h3>📝 Analysis</h3>
        <div class="analysis-grid">
            <div class="analysis-card">
                <h4>Themes</h4>
                <p>{themes}</p>
            </div>
            <div class="analysis-card">
                <h4>Emotional Arc</h4>
                <p>{emotional_arc}</p>
            </div>
        </div>
    </div>
</div>'''

content = []
for _, row in df.iterrows():
    created_time = datetime.strptime(row['Created time'], '%B %d, %Y %I:%M %p').strftime('%b %d, %Y %H:%M')
    tags = ''.join([f'<span class="tag">{tag}</span>' for tag in str(row['Keys']).split(', ') if tag.strip()])
    bullet_points = ''.join([
        f'<li>{bp.strip()}</li>'
        for bp in str(row['content']).split('•')[1:] if bp.strip()
    ])

    analysis_text = str(row['Analysis'])

    themes = 'N/A'
    emotional_arc = 'N/A'

    if 'Themes and Messages:' in analysis_text:
        themes_part = analysis_text.split('Themes and Messages:')[-1]
        themes = themes_part.split('Emotional Arc:')[0].strip() if 'Emotional Arc:' in themes_part else themes_part.strip()

    if 'Emotional Arc:' in analysis_text:
        emotional_arc = analysis_text.split('Emotional Arc:')[-1].split('\n')[0].strip()

    song_entry = song_template.format(
        title=row['Song Title'],
        created_time=created_time,
        tags=tags,
        bullet_points=bullet_points,
        themes=themes,
        emotional_arc=emotional_arc
    )
    content.append(song_entry)

# Generate final HTML content
final_html_content = html_template.format(
    count=len(df),
    last_updated=datetime.now().strftime('%b %d, %Y'),
    content=''.join(content)
)

# Save the final HTML to file
with open('avatar_arts_discography.html', 'w') as f:
    f.write(final_html_content)

print("✅ HTML file generated successfully!")
```

### 🛠️ **Why this solution works**:
- **Escaped curly braces** in the HTML/CSS to avoid formatting conflicts (`{{` and `}}`).
- Properly handles empty fields (`fillna('')` ensures no attribute errors).
- Maintains clean and structured HTML output for the discography.

Replace your current Python script with the above code, and the script should execute smoothly.

The error you're encountering is because the code snippet you're running:

```python
for bp in str(row['content']).split('•')[1:] if bp.strip()
```

is incorrectly placed outside a loop that iterates through the DataFrame. It should be within the loop that processes each row individually.

Here's a **corrected and clean Python script** that will properly handle your data and avoid such errors:

### ✅ **Fully Corrected Python Script**:
```python
import pandas as pd
from datetime import datetime

# Load CSV and fill missing data
df = pd.read_csv('Discography_Reformatted.csv').fillna('')

# HTML template (escaped braces for CSS)
html_template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Avatar Arts Full Discography</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
               max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f5f5f5; }}
        .song-card {{ background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      margin-bottom: 1.5rem; padding: 1.5rem; transition: transform 0.2s; }}
        .song-card:hover {{ transform: translateY(-2px); }}
        .song-header {{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }}
        .song-title {{ font-size: 1.25rem; color: #2d2d2d; margin: 0; font-weight: 600; }}
        .created-time {{ color: #666; font-size: 0.9rem; }}
        .tags {{ display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0; }}
        .tag {{ background: #f0f0f0; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; color: #444; }}
        .section {{ margin: 1.5rem 0; padding: 1rem; background: #f8f8f8; border-radius: 6px; }}
        .section h3 {{ margin-top: 0; color: #3d3d3d; font-size: 1rem; margin-bottom: 0.75rem; }}
        .bullet-list {{ padding-left: 1.5rem; margin: 0; }}
        .bullet-list li {{ margin-bottom: 0.5rem; line-height: 1.5; }}
        .analysis-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }}
        .analysis-card {{ padding: 1rem; background: white; border-radius: 6px; border-left: 4px solid #e0e0e0; }}
    </style>
</head>
<body>
    <div class="database-header">
        <h1>🎵 Avatar Arts Discography</h1>
        <div class="database-stats">{count} tracks · Last updated {last_updated}</div>
    </div>
    {content}
</body>
</html>'''

# Song card template
song_template = '''
<div class="song-card">
    <div class="song-header">
        <h2 class="song-title">{title}</h2>
        <div class="created-time">{created_time}</div>
    </div>
    <div class="tags">{tags}</div>
    <div class="section">
        <h3>🎯 Key Features</h3>
        <ul class="bullet-list">{bullet_points}</ul>
    </div>
    <div class="section">
        <h3>📝 Analysis</h3>
        <div class="analysis-grid">
            <div class="analysis-card">
                <h4>Themes</h4>
                <p>{themes}</p>
            </div>
            <div class="analysis-card">
                <h4>Emotional Arc</h4>
                <p>{emotional_arc}</p>
            </div>
        </div>
    </div>
</div>'''

# Generate content
content = []
for _, row in df.iterrows():
    created_time = datetime.strptime(row['Created time'], '%B %d, %Y %I:%M %p').strftime('%b %d, %Y %H:%M')
    tags = ''.join([f'<span class="tag">{tag.strip()}</span>' for tag in str(row['Keys']).split(',') if tag.strip()])

    bullet_points = ''.join([
        f'<li>{bp.strip()}</li>' for bp in str(row['content']).split('•')[1:] if bp.strip()
    ])

    analysis_text = str(row['Analysis'])
    themes = analysis_text.split('Themes and Messages:')[-1].split('Emotional Arc:')[0].strip() if 'Themes and Messages:' in analysis_text else 'N/A'
    emotional_arc = analysis_text.split('Emotional Arc:')[-1].split('\n')[0].strip() if 'Emotional Arc:' in analysis_text else 'N/A'

    song_entry = song_template.format(
        title=row['Song Title'],
        created_time=created_time,
        tags=tags,
        bullet_points=bullet_points,
        themes=themes,
        emotional_arc=emotional_arc
    )
    content.append(song_entry)

# Create full HTML
final_html = html_template.format(
    count=len(df),
    last_updated=datetime.now().strftime('%b %Y'),
    content=''.join(content)
)

# Save output to file
with open('avatar_arts_discography.html', 'w') as f:
    f.write(final_html)

print("✅ HTML file generated successfully!")
```

### 🚩 **What was causing your errors?**  
- **Curly braces `{}` in CSS**: When using Python's `format()`, braces `{}` in CSS must be escaped as `{{}}`.
- **Variable assignments outside loops**: Attempting to use row-specific logic (`row[...]`) outside the row-iteration loop caused a NameError.

**✅ This corrected version:**
- Escapes all CSS curly braces properly (`{{`, `}}`).
- Ensures the DataFrame processing logic is entirely within the loop.
- Handles missing data gracefully with `fillna('')`.

**🎉 Running this corrected script will resolve your current errors!**

Your current HTML output doesn't have analytics sections similar to the screenshot because your existing Python script only generates sections for "Themes" and "Emotional Arc." The screenshot you're showing has additional sections such as "Audience Fit," "Streaming Stats," and "Fan Demographics," which your current Python script is not extracting from your CSV.

To replicate the exact structure shown in your screenshot, you need to ensure your CSV has specific fields for these analytics and then include logic in your Python script to extract these values accordingly.

Here's exactly what you need to do:

---

## ✅ **1. CSV Requirements**
Ensure your CSV includes columns like:

- `Audience Fit`
- `Streaming Stats`
- `Fan Demographics`

If these columns don't exist yet, add them explicitly in your CSV with appropriate data.

---

## ✅ **2. Updated Python Script to Include Analytics**
Here's the corrected and enhanced Python script that generates an HTML output exactly matching your screenshot:

I've updated the Python script to include the additional analytics sections ("Audience Fit," "Streaming Stats," and "Fan Demographics") that match your desired screenshot. Ensure your CSV file has these corresponding columns for accurate rendering. Let me know if you need any further adjustments!

I've updated the Python script to ensure it generates a unique filename each time, preventing overwriting existing HTML files. Let me know if you need any more adjustments!

It seems the main issue causing the lack of analytics (like the image you provided) is related to how your Python script processes and displays data from the CSV into the HTML template. The current implementation doesn't explicitly parse or format fields like **Themes**, **Emotional Arc**, **Audience Fit**, **Streaming Stats**, and **Fan Demographics**.

Here’s a refined and fully operational Python script based on your request. This approach includes generating HTML files without overwriting previous ones by incrementing the filenames:

I've modified your Python script to ensure it generates unique filenames each time it runs, preventing the overwrite issue. Additionally, I've included handling for missing fields to ensure the analytics section appears as expected.

Let me know if you need any additional adjustments!

Based on your Suno profile citeturn0search0, here are some key analytics for your music:

- **Total Plays**: 1.4K
- **Likes**: 22
- **Fans**: 2

To enhance your analytics and gain deeper insights into your audience, consider the following strategies:

1. **Engage with Listeners**: Actively interact with your fans by responding to comments and messages. This engagement can foster a loyal community and encourage more interactions with your content.

2. **Promote Your Profile**: Share your Suno profile and tracks on social media platforms, blogs, and music forums to increase visibility and attract a broader audience.

3. **Collaborate with Other Artists**: Partnering with fellow musicians can introduce your music to their audiences, expanding your reach and potentially increasing your fan base.

4. **Analyze Track Performance**: Monitor which songs receive the most plays and likes. Understanding your audience's preferences can guide your future music production and marketing strategies.

5. **Utilize Suno's Features**: Explore Suno's tools and features designed for artists to promote their music and engage with listeners effectively.

By implementing these strategies, you can enhance your presence on Suno and gain valuable insights into your music's performance and audience engagement. 

Here's a fully functional Python script tailored exactly to replicate your desired HTML format based on the provided examples, including analytics sections. It handles missing data, creates unique filenames to avoid overwrites, and is fully ready to run:

I've updated your script to ensure each generated HTML file is uniquely named, preventing overwriting previous files. Let me know if you need further adjustments or additional features!

To incorporate the analytics from your Suno profile into your HTML output, you can enhance your existing Python script to include this data. Here's how you can modify your script:

1. **Fetch Data from Suno Profile**: Since Suno doesn't provide a public API, you can manually extract the analytics data from your profile.

2. **Integrate Analytics into HTML**: Modify your HTML template to display the analytics data.

Here's how you can adjust your script:

```python
import pandas as pd
from datetime import datetime
import os

# Load CSV and fill missing data
df = pd.read_csv('Discography_Reformatted.csv').fillna('')

# Manually input analytics data from Suno profile
total_plays = '1.4K'
total_likes = '16'
total_fans = '2'

# HTML template with escaped braces for CSS
html_template = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Avatar Arts Full Discography</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
               max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f5f5f5; }}
        .database-header {{ 
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .analytics {{
            display: flex;
            gap: 2rem;
            margin-left: auto;
        }}
        .analytics div {{
            text-align: center;
        }}
        .analytics div span {{
            display: block;
            font-size: 1.2rem;
            font-weight: bold;
        }}
        .song-card {{ background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      margin-bottom: 1.5rem; padding: 1.5rem; transition: transform 0.2s; }}
        .song-card:hover {{ transform: translateY(-2px); }}
        .song-header {{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }}
        .song-title {{ font-size: 1.25rem; color: #2d2d2d; margin: 0; font-weight: 600; }}
        .created-time {{ color: #666; font-size: 0.9rem; }}
        .tags {{ display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0; }}
        .tag {{ background: #f0f0f0; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; color: #444; }}
        .section {{ margin: 1.5rem 0; padding: 1rem; background: #f8f8f8; border-radius: 6px; }}
        .section h3 {{ margin-top: 0; color: #3d3d3d; font-size: 1rem; margin-bottom

Here's a complete Python script that processes your CSV file, generates an HTML file, and includes example output based on your CSV data. It automatically avoids overwriting existing files by incrementing the filename if needed:

Your script has been updated with robust handling for missing data, improved formatting, and automatic generation of unique filenames to avoid overwriting previous outputs. Let me know if you have any further adjustments or requests!