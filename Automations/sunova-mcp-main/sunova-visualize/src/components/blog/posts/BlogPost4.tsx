import InfoBox from "../InfoBox";
import SectionHeader from "../SectionHeader";

const BlogPost4 = () => {
  return (
    <>
      <div className="text-lg text-muted-foreground leading-relaxed mb-8">
        <p>A comprehensive guide to transforming your Suno.com tracks into professional music videos using AI technology.</p>
      </div>

      <InfoBox type="highlight" title="Coming Soon">
        This complete step-by-step guide is being finalized. You'll learn:
        <ul className="space-y-2 mt-3">
          <li>• How to create music with Suno AI</li>
          <li>• Preparing your track for video generation</li>
          <li>• Using SuNova to create synchronized visuals</li>
          <li>• Publishing and sharing your final video</li>
        </ul>
      </InfoBox>

      <SectionHeader 
        title="From Song to Screen in One Day" 
        subtitle="The complete AI music video workflow"
      />

      <p className="text-foreground/90 leading-relaxed mb-6">
        Content coming soon with full details on the entire journey from composing with Suno to creating videos with SuNova.
      </p>
    </>
  );
};

export default BlogPost4;
