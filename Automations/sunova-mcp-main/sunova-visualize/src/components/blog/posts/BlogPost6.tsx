import InfoBox from "../InfoBox";
import SectionHeader from "../SectionHeader";

const BlogPost6 = () => {
  return (
    <>
      <div className="text-lg text-muted-foreground leading-relaxed mb-8">
        <p>Discover the fascinating process behind AI-generated music videos and how SuNova creates cinematic magic.</p>
      </div>

      <InfoBox type="highlight" title="Coming Soon">
        This technical deep dive is currently being written. Topics include:
        <ul className="space-y-2 mt-3">
          <li>• Audio analysis and beat detection</li>
          <li>• Visual style planning and generation</li>
          <li>• Scene architecture and timing</li>
          <li>• Quality control and iteration</li>
        </ul>
      </InfoBox>

      <SectionHeader 
        title="The AI Video Generation Pipeline" 
        subtitle="What happens when you press Create"
      />

      <p className="text-foreground/90 leading-relaxed mb-6">
        Full content coming soon with detailed technical insights into the AI video generation process.
      </p>
    </>
  );
};

export default BlogPost6;
