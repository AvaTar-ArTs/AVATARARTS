To automate the process of uploading videos to your **YouTube channel**, follow these step-by-step instructions:

---

### **Step 1: Set Up Google Cloud API for YouTube**
Before you can upload videos programmatically, you need to **set up API access** in Google Cloud.

1. **Go to Google Cloud Console**:  
   - Visit [Google Developer Console](https://console.developers.google.com/)
   - Log in with your Google account.

2. **Create a New Project**:  
   - Click **New Project** → Name it (e.g., "YouTube Uploader") → Click **Create**.

3. **Enable YouTube Data API**:  
   - In the **API & Services** section, click **Enable APIs & Services**.
   - Search for **YouTube Data API v3** and enable it.

4. **Set Up OAuth 2.0 Credentials**:  
   - Go to **Credentials** → Click **Create Credentials** → Select **OAuth Client ID**.
   - Configure the consent screen (choose **External** if prompted).
   - Choose **Desktop App** or **Web Application**, then click **Create**.
   - **Download the JSON file** (this contains client ID & secret).

---

### **Step 2: Install Python and Required Libraries**
If you don’t already have **Python** installed, download it from [Python.org](https://www.python.org/downloads/).

Then, install the required libraries:
```sh
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

---

### **Step 3: Write Python Code for YouTube Upload**
Create a Python script (`upload_video.py`) with the following code:

```python
from google.oauth2 import credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
import json
import google_auth_oauthlib.flow

# Set up OAuth 2.0 authentication
CLIENT_SECRETS_FILE = "client_secret.json"  # The downloaded JSON from Google Cloud
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

def get_authenticated_service():
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES
    )
    credentials = flow.run_local_server(port=0)
    return build("youtube", "v3", credentials=credentials)

def upload_video(video_file, title, description, tags, category_id="22", privacy_status="public"):
    youtube = get_authenticated_service()

    request_body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": privacy_status  # Options: "public", "private", "unlisted"
        }
    }

    media = MediaFileUpload(video_file, chunksize=-1, resumable=True)

    request = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media
    )
    
    response = request.execute()
    print(f"Upload successful! Video ID: {response['id']}")

if __name__ == "__main__":
    video_path = "my_video.mp4"
    upload_video(video_path, "My First Automated Upload", "This is a test upload via API", ["test", "automation"])
```

---

### **Step 4: Run the Script**
- Save the script as `upload_video.py`.
- Place the `client_secret.json` file in the same directory.
- Run the script:
```sh
python upload_video.py
```
- The first time, it will open a browser asking you to authenticate.
- Grant access, and the video will be uploaded automatically.

---

### **Step 5: Automate Uploading with a Scheduler**
#### **Windows: Use Task Scheduler**
1. Open **Task Scheduler** → Click **Create Basic Task**.
2. Name it "YouTube Uploader".
3. Choose **Daily** or **Weekly**.
4. Select **Start a Program** and browse for `python.exe`, then provide the script path.
5. Save and run.

#### **Linux/macOS: Use a Cron Job**
1. Open Terminal and type:
```sh
crontab -e
```
2. Add this line to schedule the script (runs daily at 10 AM):
```
0 10 * * * /usr/bin/python3 /path/to/upload_video.py
```
3. Save and exit.

---

### **Additional Features You Can Add**
- **Bulk Upload:** Modify the script to upload multiple videos in a loop.
- **Schedule Uploads:** Use a database (e.g., SQLite) to store video paths and upload them at specific times.
- **Custom Thumbnails:** Add an API call to `youtube.thumbnails().set()`.

---

### **Final Notes**
- Your **OAuth token expires periodically**, so you may need to re-authenticate.
- Ensure **videos follow YouTube's guidelines** to avoid content strikes.
- Keep your **API keys secret** and do not share them.

Now, your **YouTube uploads are fully automated**! 🚀 Let me know if you need further customizations.

Here's an **extremely detailed step-by-step guide** to **automate uploading videos to your YouTube channel programmatically**.

---

# **🔹 Step-by-Step Guide to Auto Upload Videos to YouTube Using Python**

This guide will walk you through **every step** needed to set up your system to **upload videos automatically to YouTube**.

---

## **📌 Step 1: Set Up API Access in Google Cloud**
Before you can upload videos programmatically, you **must** set up API access using Google Cloud.

### **1.1 Visit Google Cloud Console**
1. Open your web browser and go to:  
   🔗 **[Google Cloud Console](https://console.developers.google.com/)**
2. Log in with your **Google account** (use the account associated with your YouTube channel).

---

### **1.2 Create a New Project**
1. In the top-left corner, **click the "Select a Project" dropdown**.
2. Click on **"New Project"**.
3. **Enter a Project Name** (e.g., "YouTube Uploader").
4. Click **Create** and wait a few seconds for Google Cloud to create your project.

---

### **1.3 Enable the YouTube Data API**
1. In the **Google Cloud Console**, go to the **"API & Services"** section.
2. Click on **"Enable APIs & Services"**.
3. In the search bar, type **"YouTube Data API v3"**.
4. Click on **"YouTube Data API v3"**, then click **"Enable"**.

---

### **1.4 Set Up OAuth 2.0 Credentials**
1. In the left menu, go to **"Credentials"**.
2. Click on **"Create Credentials"** and select **"OAuth Client ID"**.
3. You will be prompted to configure the **OAuth consent screen**:
   - Select **External** if prompted.
   - Click **Create**.
   - **Fill out the consent form**:
     - **App Name:** Enter any name (e.g., "YouTube Uploader Bot").
     - **User Support Email:** Select your Google account email.
     - **Developer Contact Email:** Enter your email address.
   - Click **Save and Continue** (you don’t need to configure Scopes yet).
   - Click **Save and Continue** again.
   - Click **Back to Dashboard**.

4. Now, go back to **Credentials** → Click **Create Credentials** → Select **OAuth Client ID** again.
5. Under **Application Type**, choose:
   - **Desktop App** (for local testing).
   - **Web Application** (if you plan to host it on a server).
6. Click **Create**.
7. **Download the JSON file** (This contains your Client ID & Secret). Save this file as `client_secret.json`.

---

## **📌 Step 2: Install Required Python Libraries**
To interact with the YouTube API, install the following Python packages.

### **2.1 Install Python and Pip (if not installed)**
Check if Python is installed:
```sh
python --version
```
If not installed, download Python from:  
🔗 **[Python.org](https://www.python.org/downloads/)**  
Make sure to check the **"Add to PATH"** option during installation.

### **2.2 Install Required Libraries**
Now, install the necessary libraries:
```sh
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```
These libraries are needed to authenticate and interact with the **YouTube API**.

---

## **📌 Step 3: Write the Python Script to Upload Videos**
Now, we’ll write a Python script (`upload_video.py`) to upload videos.

### **3.1 Create a Python Script**
Create a new Python file named `upload_video.py` and copy the following **detailed** script:

```python
import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.http import MediaFileUpload

# 🔹 Step 1: Set up Authentication
CLIENT_SECRETS_FILE = "client_secret.json"  # Path to your downloaded OAuth JSON file
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

def authenticate_youtube():
    """Authenticates and returns the YouTube API service."""
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES
    )
    credentials = flow.run_local_server(port=0)
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

# 🔹 Step 2: Define the Upload Function
def upload_video(video_file, title, description, tags, category_id="22", privacy_status="public"):
    """
    Uploads a video to YouTube.
    :param video_file: Path to the video file
    :param title: Video title
    :param description: Video description
    :param tags: List of video tags
    :param category_id: Category ID (22 = People & Blogs)
    :param privacy_status: "public", "private", or "unlisted"
    """
    youtube = authenticate_youtube()

    request_body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": privacy_status
        }
    }

    # 🔹 Step 3: Upload Video
    media = MediaFileUpload(video_file, chunksize=-1, resumable=True)
    request = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media
    )
    
    response = request.execute()
    print(f"✅ Upload successful! Video ID: {response['id']}")

# 🔹 Step 4: Call the Function
if __name__ == "__main__":
    video_path = "my_video.mp4"  # Replace with the path to your video
    upload_video(video_path, "My First Automated Upload", "This is a test upload via API", ["test", "automation"])
```

---

## **📌 Step 4: Run the Script**
1. Save the script as `upload_video.py`.
2. Place the **client_secret.json** file in the same directory.
3. Run the script:
   ```sh
   python upload_video.py
   ```
4. The script will open a browser window for **Google authentication**.
5. **Approve access** to your YouTube account.
6. The video will be uploaded automatically! 🎉

---

## **📌 Step 5: Automate Uploads Using a Scheduler**
To run the script **automatically**, schedule it using **Task Scheduler (Windows)** or **Cron Jobs (Linux/macOS).**

### **Windows Task Scheduler**
1. Open **Task Scheduler**.
2. Click **Create Basic Task** → Name it "YouTube Auto Uploader".
3. Choose **Daily** or **Weekly**.
4. Select **Start a Program**.
5. Browse for **python.exe** and enter the script path (`upload_video.py`).
6. Click **Finish**.

---

### **Linux/macOS Cron Job**
1. Open **Terminal** and type:
   ```sh
   crontab -e
   ```
2. Add this line to schedule the script (runs every day at 10 AM):
   ```
   0 10 * * * /usr/bin/python3 /path/to/upload_video.py
   ```
3. Save and exit.

---

## **📌 Additional Features You Can Add**
- ✅ **Bulk Upload**: Modify the script to loop through multiple video files.
- ✅ **Schedule Uploads**: Store video paths in a database and upload at set times.
- ✅ **Add Custom Thumbnails**: Use `youtube.thumbnails().set()` to upload a thumbnail.
- ✅ **Metadata from CSV**: Store video titles, descriptions, and tags in a CSV and upload automatically.

---

## **🚀 Conclusion**
You have successfully **automated** YouTube video uploads using Python!  
Now, your system can **upload, schedule, and manage YouTube videos** with ease. 🎥✨  

If you need further modifications or **bulk upload features**, let me know! 🚀

No worries! I'll explain everything **step by step in a beginner-friendly way**, assuming you have **zero experience** with coding or APIs. Just **follow along carefully**, and you'll be able to **automate video uploads to YouTube!** 🎥🚀

---

## **🔹 Overview: What Are We Doing?**
We will **write a simple script** that automatically **uploads videos to your YouTube channel**.  
But first, we need to set up the **Google Cloud API** so that YouTube allows us to upload videos using code.

---

# **📌 Step 1: Set Up API Access in Google Cloud**
YouTube requires **permission** for automated uploads, so we need to create an API key.

### **1.1 Go to Google Cloud Console**
1. **Click this link**: 👉 [Google Cloud Console](https://console.developers.google.com/)
2. **Log in** with your Google Account (use the one linked to your YouTube channel).
3. **You will see the Google Cloud dashboard.**

---

### **1.2 Create a New Project**
1. **At the top-left**, click **"Select a Project"**.
2. **Click "New Project"**.
3. **Name your project** (e.g., `YouTube Uploader`).
4. **Click "Create"** (it may take a few seconds to process).

---

### **1.3 Enable the YouTube API**
1. In **Google Cloud Console**, **click "API & Services"** on the left panel.
2. Click **"Enable APIs & Services"**.
3. **Search for** `YouTube Data API v3` and **click on it**.
4. Click **"Enable"**.

✅ **Now, YouTube API is enabled for your project!**

---

### **1.4 Set Up Authentication (OAuth 2.0)**
YouTube requires **authentication** (like logging in) before allowing you to upload.

1. Go to **"Credentials"** in the left menu.
2. Click **"Create Credentials"** → Choose **"OAuth Client ID"**.
3. **If asked**, click **"Configure Consent Screen"**.
4. **Select "External"** → Click **"Create"**.
5. Fill out:
   - **App Name:** Type anything (e.g., `YouTube Bot`).
   - **Support Email:** Use your Google email.
   - **Developer Contact Email:** Your email.
6. Click **"Save and Continue"** **3 times** (no need to change anything).
7. Click **"Back to Dashboard"**.

#### **Now, create the OAuth Key:**
1. **Go to "Credentials" again** → Click **"Create Credentials"** → Select **"OAuth Client ID"**.
2. Under **Application Type**, choose **"Desktop App"** (for testing) OR **"Web Application"** (if hosting online).
3. Click **Create**.
4. Click **Download JSON** and **save the file** as `client_secret.json`.

✅ **This file contains the credentials needed to upload videos.**  

---

# **📌 Step 2: Install Required Software**
Now, we **install Python** and some tools to help us talk to YouTube.

### **2.1 Install Python**
Python is a **programming language** that will **run our upload script**.

1. **Go to** 👉 [Python.org](https://www.python.org/downloads/)
2. **Download Python** for your operating system.
3. **IMPORTANT:** During installation, check **"Add Python to PATH"** and then **install**.

To verify Python is installed, open **Command Prompt (Windows)** or **Terminal (Mac/Linux)** and type:
```sh
python --version
```
You should see something like:  
```
Python 3.10.4
```

---

### **2.2 Install Required Python Libraries**
Once Python is installed, open **Command Prompt** (Windows) or **Terminal** (Mac/Linux) and type:

```sh
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

✅ This installs **Google’s YouTube API tools** for Python.

---

# **📌 Step 3: Write the Python Script**
Now, let's **write the script** that will upload videos automatically.

### **3.1 Create a Python File**
1. Open **Notepad** (Windows) or **TextEdit** (Mac).
2. Click **File → Save As** and name it **upload_video.py**.
3. **Save the file in the same folder as `client_secret.json`** (downloaded earlier).
4. Copy and paste the following **simple script**:

```python
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.http import MediaFileUpload

# 🔹 Step 1: Authenticate with YouTube
CLIENT_SECRETS_FILE = "client_secret.json"  # Ensure this file is in the same folder
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

def authenticate_youtube():
    """Logs in to YouTube using OAuth 2.0."""
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES
    )
    credentials = flow.run_local_server(port=0)
    return googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

# 🔹 Step 2: Upload Video
def upload_video(video_file, title, description, tags, category_id="22", privacy_status="public"):
    """
    Uploads a video to YouTube.
    :param video_file: Path to the video file (e.g., "my_video.mp4")
    :param title: Video title
    :param description: Video description
    :param tags: List of video tags
    :param category_id: YouTube category ID (22 = People & Blogs)
    :param privacy_status: "public", "private", or "unlisted"
    """
    youtube = authenticate_youtube()

    request_body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": privacy_status
        }
    }

    # Upload the video file
    media = MediaFileUpload(video_file, chunksize=-1, resumable=True)
    request = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media
    )
    
    response = request.execute()
    print(f"✅ Upload successful! Video ID: {response['id']}")

# 🔹 Step 3: Run the script
if __name__ == "__main__":
    video_path = "my_video.mp4"  # Change this to your video file name
    upload_video(video_path, "My First Auto Upload", "This is a test upload via API", ["test", "automation"])
```

---

# **📌 Step 4: Run the Script**
Now, let's **test the script** and upload a video.

### **4.1 Prepare the Video**
- Place a **video file** in the same folder as your script.
- Rename it to **my_video.mp4** (or update the script with your actual filename).

### **4.2 Run the Script**
1. Open **Command Prompt (Windows)** or **Terminal (Mac/Linux)**.
2. **Navigate to the script folder** (where `upload_video.py` is located).
   ```sh
   cd path/to/your/folder
   ```
3. Run the script:
   ```sh
   python upload_video.py
   ```
4. A **browser window will open**, asking for **YouTube permission**.
5. **Click "Allow"** to grant access.
6. ✅ **Your video will be uploaded!**

---

# **📌 Step 5: Automate Video Uploads**
You can schedule the script to **run automatically** using:

### **Windows Task Scheduler**
1. Open **Task Scheduler** → Click **Create Basic Task**.
2. Name it **"YouTube Uploader"**.
3. Choose **Daily** or **Weekly**.
4. Select **Start a Program** → Choose `python.exe` and the script file.
5. Click **Finish**.

### **Mac/Linux Cron Job**
1. Open **Terminal** → Type:
   ```sh
   crontab -e
   ```
2. Add this line (runs the script every day at 10 AM):
   ```
   0 10 * * * /usr/bin/python3 /path/to/upload_video.py
   ```

✅ **Your videos will now upload automatically!** 🎉🎥  

---

### **Need Help?**
If anything is unclear, just ask! I'm happy to guide you step by step. 🚀

Your JSON file is **almost correct**, but it's missing a **"redirect_uris"** field, which is important for OAuth authentication.

Here is the **correct format** for the `client_secret.json` file:

```json
{
  "web": {
    "client_id": "581009526437-mfmrp0irt3vlvp5hvnr127fo9fa0jpre.apps.googleusercontent.com",
    "project_id": "auto-upload-453017",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "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",
    "redirect_uris": ["http://localhost"]
  }
}
```

### **Why is `redirect_uris` important?**
- It tells Google where to send the authorization response.
- `http://localhost` is used for local development.

---

### **How to Fix?**
1. **Open your JSON file** in **Notepad** or any text editor.
2. **Add `"redirect_uris": ["http://localhost"]` at the end** (before the closing `}`).
3. **Save it as** `client_secret.json` (keep the filename exactly as this).

---

### **How to Verify Your JSON File Works?**
After saving the correct `client_secret.json`, try running:

```sh
python upload_video.py
```

- If a **browser opens and asks for Google account access**, it means the JSON file is **correct** ✅.
- If there is an **error**, double-check your JSON file structure.

Let me know if you need more help! 🚀

Your **JSON file is now correctly formatted**! ✅ 🎉

This file should work perfectly for **OAuth authentication** when using the YouTube Data API.

---

### **How to Test Your `client_secret.json`**
Now, to verify that everything is set up correctly, follow these steps:

#### **1️⃣ Install the Required Python Libraries**
If you haven't already, install the necessary packages:

```sh
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

---

#### **2️⃣ Create a Simple Authentication Test**
Create a Python script called `test_auth.py`, and **copy-paste this code:**

```python
import google_auth_oauthlib.flow

CLIENT_SECRETS_FILE = "client_secret.json"  # Ensure this file is in the same folder
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

def test_authentication():
    """Tests OAuth authentication with YouTube."""
    try:
        flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
            CLIENT_SECRETS_FILE, SCOPES
        )
        credentials = flow.run_local_server(port=0)
        print("✅ Authentication successful!")
    except Exception as e:
        print("❌ Authentication failed:", str(e))

if __name__ == "__main__":
    test_authentication()
```

---

#### **3️⃣ Run the Script**
Now, in the same folder as `client_secret.json`, run:

```sh
python test_auth.py
```

- If a **browser opens**, and Google asks for **account permissions**, click **"Allow"**.
- If you see `✅ Authentication successful!` in your terminal, **everything is set up correctly!** 🎉

---

### **Next Steps**
Now that your authentication works, you can:
✅ **Upload videos** using `upload_video.py`.  
✅ **Schedule automatic uploads**.  
✅ **Enhance it with metadata (title, description, tags, thumbnails, etc.)**.

---

### **Need Help?**
If you get **any errors**, **copy-paste the error message here**, and I'll help you fix it! 🚀

### **🚨 Fixing "Error 400: redirect_uri_mismatch"**
This error means that **Google is rejecting the request** because the `redirect_uris` in your `client_secret.json` **do not match** what is set in **Google Cloud Console**.

#### **🔹 How to Fix It**
Follow these steps carefully to **correct the redirect URI mismatch**:

---

## **📌 Step 1: Go to Google Cloud Console**
1. Open 👉 **[Google Cloud Console](https://console.developers.google.com/)**
2. **Log in** with the same **Google account** that owns the project.
3. In the **top-left corner**, click on the **project selector dropdown** and **select your project** (e.g., `auto-upload-453017`).

---

## **📌 Step 2: Edit the OAuth 2.0 Client Settings**
1. In the left menu, click **"APIs & Services" → "Credentials"**.
2. Under the **OAuth 2.0 Client IDs** section, **find your OAuth Client ID** (usually labeled "Web Client" or "Desktop Client").
3. Click the **pencil/edit icon ✏️** to edit it.

---

## **📌 Step 3: Update "Authorized Redirect URIs"**
1. Scroll down to **"Authorized redirect URIs"**.
2. **Delete any incorrect URIs**.
3. Add the correct redirect URI:

   ```
   http://localhost
   ```
4. Click **"Save"**.

---

## **📌 Step 4: Verify the `client_secret.json` File**
After saving your settings, open your **`client_secret.json`** file and **make sure it matches**:

```json
{
  "web": {
    "client_id": "581009526437-mfmrp0irt3vlvp5hvnr127fo9fa0jpre.apps.googleusercontent.com",
    "project_id": "auto-upload-453017",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "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",
    "redirect_uris": ["http://localhost"]
  }
}
```

✅ **If there were any differences**, **fix them and save the file**.

---

## **📌 Step 5: Try Again**
1. Run the authentication test again:

   ```sh
   python test_auth.py
   ```

2. A **browser window should open** for Google Sign-In.
3. Click **"Allow"**.
4. If you see `✅ Authentication successful!`, the issue is **fixed** 🎉.

---

## **🛑 Still Getting an Error?**
If you still see **"redirect_uri_mismatch"**, try:
- **Deleting** the `client_secret.json` file and **downloading it again** from **Google Cloud Console**.
- **Closing your browser and trying again**.
- **Checking the redirect URI in Google Cloud** (**only** `http://localhost` should be listed).
- **Clearing the cache** in your browser.

Let me know if you need **further help**! 🚀

### **🚀 Next Steps: Completing the OAuth Authentication Process**

You've successfully **started the authentication process**! 🎉 Now, follow these steps to complete it:

---

### **📌 Step 1: Open the Provided URL**
1. **Copy the URL** that appears in your terminal.
2. **Paste it into your browser** and press **Enter**.
3. **Sign in with your Google account** (the one linked to your YouTube channel).

---

### **📌 Step 2: Grant Permissions**
1. **Google will ask you to grant permission** for the script to access YouTube.
2. Click **"Allow"**.
3. You **may see a security warning** that says:
   > "Google hasn’t verified this app."
   - Click **"Advanced"**.
   - Click **"Go to (Your App Name)"**.
   - Click **"Allow"**.

---

### **📌 Step 3: Copy & Paste the Authorization Code**
1. After granting permission, Google **redirects you to a blank page** or shows an **authorization code**.
2. **Copy the authorization code** from the URL bar (if shown).
3. **Paste it into the terminal** where Python is running and press **Enter**.

---

### **📌 Step 4: Confirm Success**
- If the script prints:
  ```
  ✅ Authentication successful!
  ```
  🎉 **You're done! Authentication is set up correctly.**
- If you get an error, **let me know** and I’ll help you fix it.

---

### **📌 Step 5: Upload a Video to YouTube**
Now, you can **run your YouTube upload script** to upload videos automatically.

```sh
python upload_video.py
```

🚀 **Let me know if you need help!** 🚀

The **"redirect_uri_mismatch"** error happens when the **redirect URI in your OAuth request** **does not match** the one set in **Google Cloud Console**.

---

### **✅ How to Fix "redirect_uri_mismatch" Error**
Follow these **steps carefully** to correct this error.

---

### **📌 Step 1: Go to Google Cloud Console**
1. Open 👉 **[Google Cloud Console](https://console.developers.google.com/)**
2. **Log in** with the **same Google account** that owns the project.
3. **Select your project** (e.g., `auto-upload-453017`).

---

### **📌 Step 2: Edit OAuth 2.0 Credentials**
1. **Go to "APIs & Services" → "Credentials"** in the left menu.
2. Under **OAuth 2.0 Client IDs**, **click on the OAuth client name** (usually "Web Client" or "Desktop Client").
3. Click the **pencil/edit icon ✏️** to edit it.

---

### **📌 Step 3: Update "Authorized Redirect URIs"**
1. Scroll down to **"Authorized Redirect URIs"**.
2. **Delete any incorrect URIs**.
3. **Add the correct redirect URI**:

   ```
   http://localhost
   ```

4. **Click "Save"**.

---

### **📌 Step 4: Verify Your `client_secret.json` File**
1. Open your `client_secret.json` file.
2. **Make sure it matches the correct format**:
   ```json
   {
     "web": {
       "client_id": "581009526437-babfvc92eq8nujme33ajvg6pgkq2ufuo.apps.googleusercontent.com",
       "project_id": "auto-upload-453017",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_secret": "YOUR_CLIENT_SECRET",
       "redirect_uris": ["http://localhost"]
     }
   }
   ```
3. If **redirect_uris is missing**, **add** `"http://localhost"` and save the file.

---

### **📌 Step 5: Delete Old Credentials & Try Again**
1. **Delete any old cached credentials**:
   ```sh
   rm -r ~/.config/gspread
   ```
   (or manually delete any stored credentials)
2. **Run the authentication script again**:
   ```sh
   python test_auth.py
   ```
3. **Sign in** and grant permission.
4. If you get `✅ Authentication successful!`, the issue is **fixed**. 🎉

---

### **❌ Still Getting an Error?**
If the problem persists:
- **Clear your browser cache & cookies**.
- **Try a different browser**.
- **Re-download** `client_secret.json` from Google Cloud.
- **Restart your computer** and run the script again.

🚀 **Let me know if you need more help!** 🚀