# Scrape Dynamic Images with Selenium Python

- **Conversation ID:** `23375148-4a0f-4a11-ba3b-196167518c46`
- **Inserted at:** `2025-06-10T18:55:20.195000+08:00`
- **Updated at:** `2025-06-10T18:56:23.610000+08:00`

---

### 1. User  
 - model: `deepseek-reasoner` | time: `2025-06-10T18:55:21.427000+08:00`

```markdown
for https://mydesigns.io/dream {as in ALL we scroll the html to load the {<img class="object-cover object-center transition-all duration-500 group-hover:scale-105" crossorigin="anonymous" alt="Vibrant Fishing Graphic Design" loading="lazy" src="https://cdn.mydesigns.io/dynamic-thumbnail/7b2270617468223a22657874656e73696f6e2f647265616d65722f696d6167652f64303736323863392d343839352d346462362d616331642d3561313137313934616338632e706e67222c227769647468223a3830302c2274797065223a22696d6167652f61766966227d.avif">} from src="([^"]+) to scrape and copy to csv || https://mydesigns.io/dream?category=Art&filterBy=MOST_LIKES
```

### 2. Think  
 - model: `deepseek-reasoner` | time: `2025-06-10T18:55:21.427000+08:00`

```markdown
We are going to scrape the website https://mydesigns.io/dream?category=Art&filterBy=MOST_LIKES
 The images are loaded dynamically as we scroll. We'll use Selenium to simulate scrolling and wait for images to load.
 Steps:
 1. Set up Selenium with a web driver (we'll use Chrome) and headless mode for efficiency.
 2. Navigate to the URL.
 3. Scroll to the bottom of the page repeatedly to load all images.
 4. Parse the page source to extract image URLs from the `src` attribute of the <img> tags with the given class.
 5. Write the image URLs to a CSV file.

 Note: The image elements have a class that includes "object-cover", and we are looking for the `src` attribute.

 However, note that the example image element uses a `src` attribute that points to a .avif image. We want to capture the actual image source.

 Let's look at the example: 
   <img ... src="https://cdn.mydesigns.io/dynamic-thumbnail/...avif">

 We are going to extract all such `src` values.

 Since the page uses lazy loading, we need to wait for images to appear as we scroll.

 We'll use:
   - WebDriverWait to wait for the presence of elements.
   - We'll scroll in steps and wait for new content to load.

 Plan for scrolling:
   - We'll scroll to the bottom, wait for new images to load, then scroll again until no new images are loaded.

 Let's code accordingly.
```

### 3. Assistant  
 - model: `deepseek-reasoner` | time: `2025-06-10T18:55:21.427000+08:00`

```markdown
To scrape the dynamically loaded images from the infinite-scrolling page at `https://mydesigns.io/dream?category=Art&filterBy=MOST_LIKES`, follow this Python solution using Selenium and BeautifulSoup:

``\`python
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time

# Configure Selenium WebDriver
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")  # Run in headless mode
driver = webdriver.Chrome(options=options)

url = "https://mydesigns.io/dream?category=Art&filterBy=MOST_LIKES"
driver.get(url)

# Initialize variables for scrolling
last_height = driver.execute_script("return document.body.scrollHeight")
image_urls = set()
scroll_attempts = 0
max_attempts = 5  # Stop after 5 consecutive scrolls without new content

print("Starting scraping...")
while scroll_attempts < max_attempts:
    # Scroll to bottom
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)  # Allow time for new images to load
    
    # Parse current page source with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Find all target image elements
    images = soup.find_all('img', {
        'class': 'object-cover object-center transition-all duration-500 group-hover:scale-105',
        'crossorigin': 'anonymous',
        'loading': 'lazy'
    })
    
    # Extract new image URLs
    new_count = 0
    for img in images:
        src = img.get('src')
        if src and src not in image_urls:
            image_urls.add(src)
            new_count += 1
    
    print(f"Found {new_count} new images (Total: {len(image_urls)})")
    
    # Check if reached bottom
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        scroll_attempts += 1
    else:
        scroll_attempts = 0
    last_height = new_height

driver.quit()

# Save results to CSV
with open('dream_images.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Image_URL'])
    for url in image_urls:
        writer.writerow([url])

print(f"Scraping complete! Saved {len(image_urls)} image URLs to dream_images.csv")
``\`

### Key Features:
1. **Dynamic Scrolling**: Automatically scrolls to the bottom of the page until no new content loads
2. **Headless Browser**: Uses Chrome in headless mode for efficiency
3. **Duplicate Prevention**: Tracks unique image URLs using a set
4. **Failure Safeguard**: Stops after 5 consecutive scrolls without new content
5. **CSV Output**: Saves all image URLs in a clean CSV format

### Requirements:
- Install required packages:
  ``\`bash
  pip install selenium beautifulsoup4 webdriver-manager
  ``\`
- Chrome browser must be installed

### Output:
The script generates a `dream_images.csv` file containing all scraped image URLs in this format:
``\`
Image_URL
https://cdn.mydesigns.io/dynamic-thumbnail/...1.avif
https://cdn.mydesigns.io/dynamic-thumbnail/...2.avif
...
``\`

### Customization Options:
1. **Adjust scrolling behavior**:
   - Modify `time.sleep(2)` to change loading wait time
   - Change `max_attempts` to alter scroll termination sensitivity
2. **Add explicit waits** (if needed):
   ``\`python
   WebDriverWait(driver, 10).until(
       EC.presence_of_element_located((By.CSS_SELECTOR, "img[loading='lazy']"))
   )
   ``\`
3. **Filter specific URLs**:
   ``\`python
   # Add inside the image extraction loop:
   if ".avif" in src:  # Only keep AVIF format
   ``\`

This solution handles the dynamic loading of images through infinite scrolling and efficiently captures all target image URLs while avoiding duplicates.
```
