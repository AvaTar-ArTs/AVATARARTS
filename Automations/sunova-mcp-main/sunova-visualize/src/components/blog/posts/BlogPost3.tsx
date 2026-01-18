import InfoBox from "../InfoBox";
import SectionHeader from "../SectionHeader";

const BlogPost3 = () => {
  return (
    <>
      <div className="text-lg text-muted-foreground leading-relaxed mb-8">
        <p>This article explores advanced techniques and best practices for maintaining character continuity in AI-generated music videos.</p>
      </div>

      <InfoBox type="highlight" title="Coming Soon">
        This comprehensive guide on character consistency in AI video generation is currently being written. Check back soon for expert insights on:
        <ul className="space-y-2 mt-3">
          <li>• Maintaining character appearance across scenes</li>
          <li>• Using reference images effectively</li>
          <li>• Advanced prompt engineering techniques</li>
          <li>• Style consistency and visual coherence</li>
        </ul>
      </InfoBox>

      <SectionHeader 
        title="Why Character Consistency Matters" 
        subtitle="The foundation of professional AI videos"
      />

      <p className="text-foreground/90 leading-relaxed mb-6">
        One of the biggest challenges in AI video generation is maintaining consistent character appearances throughout your video. When a character's look changes unexpectedly between shots, it breaks immersion and makes your video feel amateurish.
      </p>

      <div className="text-center py-12">
        <p className="text-muted-foreground">Content is being finalized and will be published soon.</p>
      </div>
    </>
  );
};

export default BlogPost3;
