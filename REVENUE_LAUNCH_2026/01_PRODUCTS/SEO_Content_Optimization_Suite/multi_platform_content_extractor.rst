Multi-Platform Content Extractor
=================================

The Multi-Platform Content Extractor extracts content from Ideogram.ai, Suno, and
other platforms with rich metadata and content-aware analysis.

Overview
--------

This tool provides browser automation to extract:
* Images and videos from Ideogram.ai
* Songs and lyrics from Suno
* Rich metadata for all content
* Content-aware analysis and tagging

Features
--------

* **Browser Automation**: Selenium-based extraction
* **Rich Metadata**: Generation IDs, prompts, dimensions, etc.
* **Content-Aware Analysis**: Semantic tagging and categorization
* **CSV/JSON Export**: Structured data export
* **Integration Ready**: Works with existing systems

Quick Start
-----------

.. code-block:: python

   from multi_platform_content_extractor import MultiPlatformContentExtractor

   # Initialize extractor
   extractor = MultiPlatformContentExtractor(headless=True)

   # Extract from Ideogram.ai
   ideogram_assets = extractor.extract_ideogram(
       url="https://ideogram.ai/t/trending",
       max_scrolls=100,
       max_downloads=200
   )

   # Extract from Suno
   suno_songs = extractor.extract_suno(
       url="https://suno.com/discover",
       max_scrolls=100
   )

   # Export
   extractor.export_csv(Path("~/extracted_content"), ideogram_assets)
   extractor.export_json(Path("~/extracted_content"), suno_songs)

   # Close browser
   extractor.close()

API Reference
-------------

.. automodule:: multi_platform_content_extractor
   :members:
   :undoc-members:
   :show-inheritance:

IdeogramAsset Class
~~~~~~~~~~~~~~~~~~~

.. autoclass:: multi_platform_content_extractor.IdeogramAsset
   :members:
   :undoc-members:

SunoSong Class
~~~~~~~~~~~~~~

.. autoclass:: multi_platform_content_extractor.SunoSong
   :members:
   :undoc-members:

ContentAnalysis Class
~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: multi_platform_content_extractor.ContentAnalysis
   :members:
   :undoc-members:

MultiPlatformContentExtractor Class
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: multi_platform_content_extractor.MultiPlatformContentExtractor
   :members:
   :undoc-members:

Methods
-------

extract_ideogram()
~~~~~~~~~~~~~~~~~~

Extracts images and videos from Ideogram.ai.

**Parameters:**
* ``url`` (str): Ideogram.ai URL to extract from
* ``max_scrolls`` (int): Maximum scrolls (default: 500)
* ``max_downloads`` (int): Maximum downloads (default: 2000)
* ``scroll_delay`` (float): Delay between scrolls in seconds (default: 0.2)

**Returns:**
* List of :class:`IdeogramAsset` objects

**Example:**

.. code-block:: python

   assets = extractor.extract_ideogram(
       url="https://ideogram.ai/t/trending",
       max_scrolls=100
   )

extract_suno()
~~~~~~~~~~~~~~

Extracts songs and lyrics from Suno.

**Parameters:**
* ``url`` (str): Suno URL to extract from
* ``max_scrolls`` (int): Maximum scrolls (default: 400)
* ``scroll_delay`` (float): Delay between scrolls in seconds (default: 0.9)

**Returns:**
* List of :class:`SunoSong` objects

**Example:**

.. code-block:: python

   songs = extractor.extract_suno(
       url="https://suno.com/discover",
       max_scrolls=100
   )

analyze_content()
~~~~~~~~~~~~~~~~~

Performs content-aware analysis on extracted assets.

**Parameters:**
* ``asset``: :class:`IdeogramAsset` or :class:`SunoSong` to analyze

**Returns:**
* :class:`ContentAnalysis` with tags, SEO keywords, and suggestions

**Example:**

.. code-block:: python

   for asset in assets:
       analysis = extractor.analyze_content(asset)
       print(f"Tags: {analysis.tags}")
       print(f"SEO Keywords: {analysis.seo_keywords}")

Ideogram.ai Extraction
----------------------

Extracted metadata includes:

* **Generation ID**: Unique generation identifier
* **Frame Index**: Frame number in generation
* **Prompt/Alt Text**: Image description
* **URLs**: Primary image/video URL, poster URL
* **Dimensions**: Natural width/height, video dimensions
* **Aspect Ratio**: Calculated aspect ratio
* **Likes**: Like count (if available)
* **Badges**: Content badges/tags

**Use Cases:**
* Art gallery integration
* Print-on-demand products
* YouTube thumbnails
* Social media content

Suno Extraction
---------------

Extracted metadata includes:

* **Song ID**: Unique song identifier
* **Title**: Song title
* **Author**: Song author/creator
* **Audio URL**: Direct download URL
* **Image URL**: Thumbnail image
* **Lyrics**: Full lyrics (if available)
* **Summary**: Song summary/description
* **Tags**: Content tags
* **Duration**: Song duration

**Use Cases:**
* Music management system
* YouTube background music
* Music licensing
* Content creation

Content Analysis
----------------

Analysis includes:

* **Tags**: Extracted keywords (5-10 tags)
* **Tag Scores**: Confidence scores for each tag
* **SEO Keywords**: SEO-optimized keywords (10-15)
* **Content Category**: Art, music, video, educational, general
* **Suggested Use**: Use case recommendations
* **Metadata**: Source, content type, analysis timestamp

Examples
--------

Extract and Analyze
~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from multi_platform_content_extractor import MultiPlatformContentExtractor

   extractor = MultiPlatformContentExtractor()

   # Extract
   assets = extractor.extract_ideogram("https://ideogram.ai/t/trending")

   # Analyze
   for asset in assets:
       analysis = extractor.analyze_content(asset)
       print(f"{asset.filename}: {analysis.tags}")

   # Export
   extractor.export_csv(Path("~/extracted_content"), assets)
   extractor.close()

Command Line Usage
~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Extract from Ideogram.ai
   python multi_platform_content_extractor.py \
     --ideogram "https://ideogram.ai/t/trending" \
     --max-scrolls 100 \
     --output ~/extracted_content

   # Extract from Suno
   python multi_platform_content_extractor.py \
     --suno "https://suno.com/discover" \
     --max-scrolls 100 \
     --output ~/extracted_content

   # Both
   python multi_platform_content_extractor.py \
     --ideogram "https://ideogram.ai/t/trending" \
     --suno "https://suno.com/discover" \
     --format both \
     --output ~/extracted_content

Best Practices
--------------

1. **Start Small**: Test with ``--max-scrolls 10`` first
2. **Check Output**: Verify CSV/JSON before large extractions
3. **Respect Rate Limits**: Don't extract too aggressively
4. **Save Progress**: Export frequently during long extractions
5. **Analyze Content**: Use content-aware analysis for better results

See Also
--------

* :doc:`hot_trending_content_engine` - Use extracted content
* :doc:`youtube_seo_optimizer` - Generate YouTube content
* :doc:`strategies` - Integration strategies

