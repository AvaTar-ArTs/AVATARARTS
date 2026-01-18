
## 1. Transcript  
## 2. Control  
## 3. Video  

![Video Preview](media/image5.png)

---

## Google Drive Connection

> **Tip:** Use your *Default* Google account when setting up the Make for Google Sheets add-on.

---

# Connect Google Drive and Make

To connect an email ending in `@gmail.com` or `@googlemail.com`, you must create a custom OAuth client in the Google Cloud Platform and obtain your project client credentials to establish the connection in Make.

---

## Requirements

- You must have a [**Gmail account**](https://myaccount.google.com/).
- Make’s use and transfer of information received from Google APIs to any other app will adhere to the [**Google API Services User Data Policy**](https://developers.google.com/terms/api-services-user-data-policy).

---

# Connect Gmail and Make

To connect an email ending in `@gmail.com` or `@googlemail.com`, you need to [**create a custom OAuth client**](https://apps.make.com/google-email#iVHgC) in the Google Cloud Platform and use your project client credentials to establish the connection in Make.

There are two ways to connect, depending on your credentials:

- **Default credentials provided by Make:**  
  Use this if your company has a paid Google Cloud Platform subscription and uses a custom domain (e.g., `yourname@yourcompany.com`).  
  [**Proceed to Create the connection in Make**](https://apps.make.com/google-email#M9-Qq) (you can skip step 3).

- **Your custom credentials:**  
  If you only have restricted access to the Gmail API (cannot use default credentials), you must [**create a custom OAuth client in Google Cloud Platform**](https://apps.make.com/google-email#iVHgC).  
  Use this option if:
  - You don’t have a Google Cloud Platform subscription, use a free Google Account, and your email ends with `@gmail.com` or `@googlemail.com`.
  - You use a paid Google Account and want more control over what the Gmail app in Make can do.

  > **Note:** You need the `serviceusage.services.enable` permission. If you don’t have it, ask your Google Cloud Platform Project Owner or IAM Admin to grant it.

  After creating your custom OAuth client, [**create the connection in Make**](https://apps.make.com/google-email#M9-Qq) and follow all the steps.

---

## Create and Configure a Google Cloud Platform Project for Gmail

To connect to Make using your own client credentials, create and configure a project in the Google Cloud Platform.  
**This is required if your email ends with `@gmail.com` or `@googlemail.com`.**

### 1. Create a Google Cloud Platform Project

1. Log in to the [**Google Cloud Platform**](https://console.cloud.google.com/) with your Google credentials.
2. On the welcome page, click **Create or select a project** > **New project**.  
   If you already have a project, [**go to step 5**](https://apps.make.com/google-email).
   
   ![Google Cloud Platform](media/image7.png)

3. Enter a **Project name** and select the **Location**.
4. Click **Create**.

   ![Select a project](media/image3.png)

5. In the top menu, ensure your new project is selected in the **Select a project** dropdown.  
   > **Permission required:** `serviceusage.services.enable`. If you don’t have it, ask your Project Owner or IAM Admin.

---

### 2. Enable APIs for Gmail

1. Open the left navigation menu and go to **APIs & Services** > **Library**.
2. Search for **Gmail API**.

   ![Gmail API](media/image2.png)

3. Click **Gmail API**, then **Enable**.  
   If you see **Manage** instead of **Enable**, the API is already enabled.

---

### 3. Configure Your OAuth Consent Screen

1. In the left sidebar, click **Google Auth Platform**.  
   If you don’t see it, click **View all products** at the top, then pin **Google Auth Platform** to the sidebar.

   ![Google Auth Platform](media/image8.png)

2. Click **Get Started**.
3. In **Overview > App information**, enter *Make* as the app name and provide your Gmail address. Click **Next**.
4. Under **Audience**, select **External**. Click **Next**.  
   [More info on user types](https://support.google.com/cloud/answer/9110914#exceptions-ver-reqts)
5. Under **Contact Information**, enter your Gmail address and click **Next**.
6. Under **Finish**, agree to the Google User Data Policy.
7. Click **Continue** > **Create**.
8. Click **Create OAuth Client**.

   ![Create OAuth client](media/image6.png)

9. In **Branding > Authorized domains**, add `make.com` and `integromat.com`. Click **Save**.
10. *(Optional)* In **Audience**, add your Gmail address on the **Test users** page, then click **Save and continue** if you want the project to remain in **Testing** status.  
    > See the note below about publishing status.
11. In **Data Access**, click **Add or remove scopes** and add:
    - `https://www.googleapis.com/auth/userinfo.email`
    - `https://mail.google.com`
    You can add scopes using a table with filters or manually. Click **Update**.
12. Click **Save**.

#### Publishing Status

- **Testing:** You must reauthorize your connection in Make every week.  
- **In production:** No weekly reauthorization required.  
  To update, go to **Google Auth Platform > Audience** and click **Publish app**.  
  If you see **Needs verification**, you can either go through the [Google verification process](https://support.google.com/cloud/answer/13463073?authuser=1&visit_id=638718595933013017-1855034908&rd=1) or connect to your unverified app (currently allowed, but not guaranteed indefinitely).

[More info on publishing status](https://support.google.com/cloud/answer/10311615#zippy=)

---

### 4. Create Your Gmail Client Credentials

1. In **Google Auth Platform**, click **Clients**.
2. Click **+ Create Client**.

   ![Create Client](media/image4.png)

3. In **Application type**, select **Web application**.
4. Update the **Name** of your OAuth client for easy identification.
5. In **Authorized redirect URIs**, click **+ Add URI** and enter:  
   ```
   https://www.integromat.com/oauth/cb/google-restricted
   ```
   ![Authorize redirect URI](media/image9.png)
6. Click **Create**.
7. Click the OAuth 2.0 Client you created, copy your **Client ID** and **Client secret**, and store them safely.  
   You’ll use these in Make.

---

### 5. Create the Connection in Make

1. Log in to your Make account, add a Gmail module to your scenario, and click **Create a connection**.
2. *(Optional)* In **Connection name**, enter a name for the connection.
3. *(Optional, for non-@gmail or @googlemail domains)* Enable **Show advanced settings** and enter your Client ID and Client secret from the previous section.  
   [More info](https://apps.make.com/google-email#iVHgC)
4. Click **Sign in with Google**.
5. If prompted, authenticate, grant permissions, and confirm access.

> **Success!** You can now use the Gmail app in your scenarios.  
> To make changes to your connection later, follow [these steps](https://help.make.com/connect-an-application#tN2pJ).

---

## Google Sheets Automation

For use with the Watch Changes module, paste your scenario’s webhook URL here: