# Checkout & OG Setup (2025-09-09)
1) Upload `og-shadowchannel.jpg` and `og-podcast2video.jpg` to the same folder as your HTML pages (or host on your CDN).  
2) Open the HTML files to confirm the `<meta property="og:image">` now references those filenames. For production, use absolute URLs.
3) Inject your live checkout links:
```
python inject_checkout_urls.py --shadow https://YOUR_SHADOW_CHECKOUT --podcast https://YOUR_PODCAST_CHECKOUT
```
4) Re-upload the HTML to your site. Test link previews (Twitter Card Validator / Meta Sharing Debugger).

Tip: Prefer absolute OG URLs like `https://yourdomain.com/assets/og-shadowchannel.jpg` for reliable previews.
