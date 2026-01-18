import InfoBox from "../InfoBox";
import SectionHeader from "../SectionHeader";

const BlogPost5 = () => {
  return (
    <>
      <div className="text-lg text-muted-foreground leading-relaxed mb-8">
        <p>An insider's perspective on the hidden costs of AI development and what it means for indie innovation.</p>
      </div>

      <InfoBox type="highlight" title="Coming Soon">
        This insightful article by Justin / The Synth Alchemist is currently being written. Topics will include:
        <ul className="space-y-2 mt-3">
          <li>• The real costs behind AI operations</li>
          <li>• Why every API call has a price tag</li>
          <li>• How indie developers compete with big tech</li>
          <li>• The future of sustainable AI innovation</li>
        </ul>
      </InfoBox>

      <SectionHeader 
        title="Every 'Whoa!' Has a Price Tag" 
        subtitle="Understanding the economics of AI"
      />

      <p className="text-foreground/90 leading-relaxed mb-6">
        Behind every impressive AI generation is a complex infrastructure of GPUs, storage, and compute power – all of which come with real costs that independent developers must navigate.
      </p>

      <div className="text-center py-12">
        <p className="text-muted-foreground">Full content coming soon.</p>
      </div>
    </>
  );
};

export default BlogPost5;
