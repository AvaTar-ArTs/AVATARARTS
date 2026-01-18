YouTube SEO Optimizer
=====================

The YouTube SEO Optimizer generates complete SEO-optimized video packages including
titles, descriptions, tags, scripts, and thumbnails optimized for maximum visibility.

Overview
--------

This tool creates complete YouTube content packages with:
* SEO-optimized titles (55-60 characters)
* Complete descriptions (300-500 words)
* 10-15 optimized tags
* Video scripts
* Thumbnail concepts
* Performance estimates

Features
--------

* **Title Optimization**: Keyword-rich, 55-60 characters, power words
* **Description Generation**: Complete with timestamps, CTAs, hashtags
* **Tag Optimization**: 10-15 tags with AEO focus
* **Script Generation**: Answer-focused, engaging structure
* **Thumbnail Concepts**: CTR-optimized design
* **SEO Scoring**: 0-100 score with recommendations

Quick Start
-----------

.. code-block:: python

   from youtube_seo_optimizer import YouTubeSEOOptimizer

   # Initialize optimizer
   optimizer = YouTubeSEOOptimizer()

   # Generate video package
   video = optimizer.generate_seo_optimized_video(
       topic="AI Content Automation 2025",
       keywords="ai automation, content creation, workflow automation",
       content_type="tutorial",
       generate_script=True,
       generate_thumbnail=True
   )

   # Analyze SEO
   analysis = optimizer.analyze_seo(video)

   # Save package
   optimizer.save_video_package(video, Path("~/youtube_content"))

API Reference
-------------

.. automodule:: youtube_seo_optimizer
   :members:
   :undoc-members:
   :show-inheritance:

YouTubeVideo Class
~~~~~~~~~~~~~~~~~~

.. autoclass:: youtube_seo_optimizer.YouTubeVideo
   :members:
   :undoc-members:

SEOAnalysis Class
~~~~~~~~~~~~~~~~~

.. autoclass:: youtube_seo_optimizer.SEOAnalysis
   :members:
   :undoc-members:

YouTubeSEOOptimizer Class
~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: youtube_seo_optimizer.YouTubeSEOOptimizer
   :members:
   :undoc-members:

Methods
-------

generate_seo_optimized_video()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Generates complete SEO-optimized YouTube video package.

**Parameters:**
* ``topic`` (str): Video topic
* ``keywords`` (str): Comma-separated keywords
* ``content_type`` (str): Type ("music", "art", "tutorial", "case_study")
* ``generate_script`` (bool): Generate script (default: True)
* ``generate_thumbnail`` (bool): Generate thumbnail (default: True)

**Returns:**
* :class:`YouTubeVideo` with complete package

**Example:**

.. code-block:: python

   video = optimizer.generate_seo_optimized_video(
       topic="Cinematic Dark Ambient Music",
       keywords="cinematic music, ambient, focus music",
       content_type="music"
   )

analyze_seo()
~~~~~~~~~~~~~

Analyzes and optimizes SEO for a video package.

**Parameters:**
* ``video`` (:class:`YouTubeVideo`): Video to analyze

**Returns:**
* :class:`SEOAnalysis` with recommendations

**Example:**

.. code-block:: python

   analysis = optimizer.analyze_seo(video)
   print(f"SEO Score: {analysis.seo_score:.1f}/100")
   for rec in analysis.recommendations:
       print(f"- {rec}")

Title Optimization
------------------

Titles are optimized for:

* **Length**: 55-60 characters (optimal for YouTube)
* **Keyword Placement**: Primary keyword in first 40 characters
* **Power Words**: EXPLAINED, ULTIMATE, COMPLETE, INSANE
* **Emotional Triggers**: "You NEED to See This", "Don't Miss This"
* **Trending Indicators**: "🔥 HOT TRENDING", "2025"

**Example Titles:**
* "🔥 AI Content Automation 2025 EXPLAINED | You NEED to See This"
* "Cinematic Music COMPLETE Guide | Ultimate Background Music"
* "Why AI Art is BLOWING UP | The Real Reasons"

Description Optimization
-------------------------

Descriptions include:

* **Hook** (125 chars): Primary keyword + emotional trigger
* **Value Proposition**: What they'll learn
* **Detailed Explanation**: 3-4 paragraphs
* **Key Takeaways**: Bullet points
* **Timestamps**: 5-8 chapters
* **Call-to-Action**: Subscribe, like, comment
* **Links**: Playlists, related videos, social
* **Hashtags**: 15-20 trending hashtags

**Keyword Density**: 3-5% (optimal)

Tag Optimization
----------------

Tags are prioritized:

1. **Primary Keyword** (exact match)
2. **Primary Variations** (3-5 tags)
3. **Long-Tail Keywords** (3-5 tags)
4. **Trending Indicators** (2-3 tags)
5. **Platform Tags** (1-2 tags)
6. **Content Type Tags** (2-3 tags)
7. **Broad Tags** (1-2 tags)

**Total**: 10-15 tags (YouTube optimal)

SEO Scoring
-----------

**Title (35 points):**
* Keyword in title: 20 points
* Keyword in first 40 chars: 5 points
* Optimal length (55-60): 10 points

**Description (45 points):**
* Keyword density (3-5%): 15 points
* Keyword in first 125 chars: 10 points
* Optimal length (300-500 words): 10 points
* Answer-focused: 5 points
* Timestamps: 5 points

**Tags (15 points):**
* Primary keyword in tags: 5 points
* Optimal count (10-15): 5 points
* Long-tail keywords: 5 points

**Trending (5 points):**
* Trend score factor: 5 points

**Target**: 85+ for top 1-5% content

Examples
--------

Generate Video Package
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from youtube_seo_optimizer import YouTubeSEOOptimizer

   optimizer = YouTubeSEOOptimizer()

   video = optimizer.generate_seo_optimized_video(
       topic="AI Content Automation",
       keywords="ai automation, content creation, workflow",
       content_type="tutorial"
   )

   print(f"Title: {video.title}")
   print(f"SEO Score: {video.seo_score:.1f}/100")
   print(f"Estimated CTR: {video.estimated_ctr:.1f}%")

Command Line Usage
~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   python youtube_seo_optimizer.py \
     --topic="AI Content Automation 2025" \
     --keywords="ai automation,content creation,workflow" \
     --type=tutorial \
     --script \
     --thumbnail \
     --output=~/youtube_content

Best Practices
--------------

1. **Optimize Title First**: Most important for SEO
2. **Include Keywords Naturally**: 3-5% density, not stuffed
3. **Add Timestamps**: Improves engagement and SEO
4. **Use Hashtags**: 15-20 trending hashtags
5. **Track Performance**: Monitor CTR and rankings

See Also
--------

* :doc:`hot_trending_content_engine` - Trend discovery
* :doc:`aeo_seo_guide` - AEO/SEO strategies
* :doc:`strategies` - Best practices

