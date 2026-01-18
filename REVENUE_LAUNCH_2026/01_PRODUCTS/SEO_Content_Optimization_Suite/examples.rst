Examples and Tutorials
======================

Practical examples and tutorials for using the SEO Content Optimization Suite.

Basic Usage
-----------

Discover Hot Trends
~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from hot_trending_content_engine import HotTrendingContentEngine

   # Initialize engine
   engine = HotTrendingContentEngine()

   # Discover trends
   trends = engine.discover_hot_trends(
       niche="content creation, AI, music, art",
       min_trend_score=75.0,
       max_results=10
   )

   # Display results
   for i, trend in enumerate(trends, 1):
       print(f"{i}. {trend.keyword}")
       print(f"   Score: {trend.trend_score:.1f}/100")
       print(f"   Growth: {trend.growth_rate:.1f}%")
       print(f"   Platforms: {', '.join(trend.platforms)}")

Generate Content Package
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from hot_trending_content_engine import HotTrendingContentEngine

   engine = HotTrendingContentEngine()

   # Get a trend
   trends = engine.discover_hot_trends(min_trend_score=80.0, max_results=1)
   if trends:
       trend = trends[0]
       
       # Generate package
       package = engine.generate_trending_content(trend)
       
       # View results
       print(f"Title: {package.title}")
       print(f"SEO Score: {package.seo_score:.1f}/100")
       print(f"AEO Score: {package.aeo_score:.1f}/100")
       print(f"Tags: {', '.join(package.tags[:5])}")

Advanced Usage
--------------

Extract and Generate
~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from hot_trending_content_engine import HotTrendingContentEngine
   from multi_platform_content_extractor import MultiPlatformContentExtractor
   from pathlib import Path

   # Extract content
   extractor = MultiPlatformContentExtractor()
   ideogram_assets = extractor.extract_ideogram(
       "https://ideogram.ai/t/trending",
       max_scrolls=50
   )

   # Generate YouTube package
   engine = HotTrendingContentEngine()
   trends = engine.discover_hot_trends(niche="ai art, digital art")
   
   if trends and ideogram_assets:
       package = engine.generate_trending_content(trends[0])
       
       # Use extracted assets
       package.thumbnail_concept = ideogram_assets[0].prompt_or_alt
       
       # Save package
       engine.save_content_package(package, Path("~/youtube_content"))

YouTube Optimization
~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from youtube_seo_optimizer import YouTubeSEOOptimizer
   from pathlib import Path

   optimizer = YouTubeSEOOptimizer()

   # Generate video package
   video = optimizer.generate_seo_optimized_video(
       topic="AI Content Automation 2025",
       keywords="ai automation, content creation, workflow",
       content_type="tutorial",
       generate_script=True
   )

   # Analyze SEO
   analysis = optimizer.analyze_seo(video)
   
   print(f"SEO Score: {analysis.seo_score:.1f}/100")
   print(f"Recommendations:")
   for rec in analysis.recommendations:
       print(f"  - {rec}")

   # Save package
   optimizer.save_video_package(video, Path("~/youtube_content"))

Content Extraction
------------------

Extract from Ideogram.ai
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from multi_platform_content_extractor import MultiPlatformContentExtractor
   from pathlib import Path

   extractor = MultiPlatformContentExtractor(headless=True)

   try:
       # Extract assets
       assets = extractor.extract_ideogram(
           url="https://ideogram.ai/t/trending",
           max_scrolls=100,
           max_downloads=200
       )

       # Analyze each asset
       for asset in assets:
           analysis = extractor.analyze_content(asset)
           print(f"{asset.filename}: {analysis.tags}")

       # Export
       extractor.export_csv(Path("~/extracted_content"), assets)
       extractor.export_json(Path("~/extracted_content"), assets)

   finally:
       extractor.close()

Extract from Suno
~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from multi_platform_content_extractor import MultiPlatformContentExtractor
   from pathlib import Path

   extractor = MultiPlatformContentExtractor(headless=True)

   try:
       # Extract songs
       songs = extractor.extract_suno(
           url="https://suno.com/discover",
           max_scrolls=100
       )

       # Analyze each song
       for song in songs:
           analysis = extractor.analyze_content(song)
           print(f"{song.title} by {song.author}")
           print(f"  Tags: {analysis.tags}")
           print(f"  Category: {analysis.content_category}")

       # Export
       extractor.export_csv(Path("~/extracted_content"), songs)

   finally:
       extractor.close()

Complete Workflow
-----------------

End-to-End Content Creation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   from hot_trending_content_engine import HotTrendingContentEngine
   from multi_platform_content_extractor import MultiPlatformContentExtractor
   from youtube_seo_optimizer import YouTubeSEOOptimizer
   from pathlib import Path

   # Step 1: Discover trends
   engine = HotTrendingContentEngine()
   trends = engine.discover_hot_trends(
       niche="ai art, digital art",
       min_trend_score=80.0,
       max_results=5
   )

   if not trends:
       print("No hot trends found")
       exit()

   # Step 2: Extract assets
   extractor = MultiPlatformContentExtractor()
   ideogram_assets = extractor.extract_ideogram(
       "https://ideogram.ai/t/trending",
       max_scrolls=50
   )

   # Step 3: Generate content for top trend
   trend = trends[0]
   package = engine.generate_trending_content(trend)

   # Step 4: Use extracted assets
   if ideogram_assets:
       package.thumbnail_concept = ideogram_assets[0].prompt_or_alt

   # Step 5: Optimize for YouTube
   optimizer = YouTubeSEOOptimizer()
   youtube_video = optimizer.generate_seo_optimized_video(
       topic=trend.keyword,
       keywords=', '.join(trend.related_keywords[:5]),
       content_type="art"
   )

   # Step 6: Save everything
   output_dir = Path("~/content_packages")
   engine.save_content_package(package, output_dir)
   optimizer.save_video_package(youtube_video, output_dir)

   print(f"✅ Complete package saved to {output_dir}")

Command Line Examples
---------------------

Hot Trending Content
~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Discover trends
   python hot_trending_content_engine.py \
     --niche="content creation, AI, music" \
     --min-score=75.0 \
     --max-results=10

   # Generate content
   python hot_trending_content_engine.py \
     --niche="content creation, AI, music" \
     --min-score=75.0 \
     --max-results=5 \
     --generate \
     --output=~/hot_trending_content

YouTube SEO
~~~~~~~~~~~

.. code-block:: bash

   python youtube_seo_optimizer.py \
     --topic="AI Content Automation 2025" \
     --keywords="ai automation,content creation,workflow" \
     --type=tutorial \
     --script \
     --thumbnail \
     --output=~/youtube_content

Content Extraction
~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Ideogram.ai
   python multi_platform_content_extractor.py \
     --ideogram "https://ideogram.ai/t/trending" \
     --max-scrolls 100 \
     --output ~/extracted_content

   # Suno
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

