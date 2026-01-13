To connect your Google Drive and YouTube API properly, follow these detailed steps:

### Connecting to Google Drive API

1. **Create a Google Cloud Console Project:**
   * Log in to the [Google Cloud Console](https://console.cloud.google.com/).
   * Click on "Select a project" > "New project."
   * Enter a project name and select a location, then click "Create."
2. **Enable Google Drive API:**
   * Navigate to **APIs & Services > Library**.
   * Search for "Google Drive API" and click "Enable."
3. **Configure OAuth Consent Screen:**
   * Go to **OAuth consent screen** in the left sidebar.
   * Select "External" and click "Create."
   * Fill in the required fields and add `make.com` and `integromat.com` to the Authorized domains.
   * Click "Save and continue."
4. **Create Credentials:**
   * Go to **Credentials** in the left sidebar.
   * Click on "+ Create Credentials" > "OAuth client ID."
   * Choose "Web application" and set the redirect URI to `https://www.integromat.com/oauth/cb/google-restricted`.
   * Save your Client ID and Client Secret.
5. **Scopes for Google Drive:**
   * Add the following scopes:
     * `https://www.googleapis.com/auth/drive`
     * `https://www.googleapis.com/auth/drive.readonly`

### Connecting to YouTube API

1. **Enable YouTube Data API:**
   * In the same Google Cloud Console project, go to **APIs & Services > Library**.
   * Search for "YouTube Data API" and click "Enable."
2. **Configure OAuth Consent Screen (if not done previously):**
   * Follow the same steps as for Google Drive.
3. **Create Credentials for YouTube:**
   * Go to **Credentials**.
   * Click on "+ Create Credentials" > "OAuth client ID."
   * Choose "Web application" and set the redirect URI to `https://www.integromat.com/oauth/cb/google-restricted`.
   * Save your Client ID and Client Secret.
4. **Scopes for YouTube:**
   * Add the following scopes:
     * `https://www.googleapis.com/auth/youtube`
     * `https://www.googleapis.com/auth/youtube.upload`

### Final Steps

* After setting up both APIs, you can connect them to Make by adding the respective modules and using the Client ID and Client Secret for authentication.
* Ensure you authorize the application when prompted.

This guide should help you set up the necessary connections and scopes for both Google Drive and YouTube APIs. If you need further assistance with your scenario in Make, feel free to ask!