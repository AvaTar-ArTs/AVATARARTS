import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CommercialLicense = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="font-display text-4xl font-bold gradient-text mb-8">Commercial License</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. License Grant</h2>
            <p className="text-muted-foreground mb-4">
              Subject to your compliance with these terms and applicable subscription tier, SuNova grants you a 
              limited, non-exclusive, non-transferable license to use AI-generated content for commercial purposes 
              as specified in your plan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Ownership and Rights</h2>
            <p className="text-muted-foreground mb-4">
              You own the videos generated using SuNova, provided you have the necessary rights to the input music track. 
              This ownership is contingent upon: (a) having valid rights to the source music, (b) maintaining an active 
              subscription or having purchased the applicable plan, and (c) compliance with these license terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Commercial Use Authorization</h2>
            <p className="text-muted-foreground mb-4">
              With an appropriate commercial license, you may use generated content for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>YouTube monetization and streaming platforms</li>
              <li>Social media promotion and advertising</li>
              <li>Live performances and public displays</li>
              <li>Commercial albums and music releases</li>
              <li>Client work and commissioned projects</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Music Rights Responsibility</h2>
            <p className="text-muted-foreground mb-4">
              You are solely responsible for ensuring you have proper rights to the music you upload. If using 
              Suno-generated music, you must comply with Suno's commercial terms. For other music sources, you 
              must have appropriate licenses or ownership rights. SuNova is not responsible for music licensing issues.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Restrictions</h2>
            <p className="text-muted-foreground mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Resell or redistribute AI-generated content as standalone assets</li>
              <li>Use generated content for training competing AI models</li>
              <li>Create content that violates laws or infringes third-party rights</li>
              <li>Remove or obscure attribution when required by your plan</li>
              <li>Use the service to generate harmful, illegal, or deceptive content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Attribution Requirements</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your subscription tier, attribution may be required. Pro and Enterprise plans typically 
              allow commercial use without attribution. Free and basic tiers may require "Created with SuNova" credit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Content Standards</h2>
            <p className="text-muted-foreground mb-4">
              Generated content must comply with community standards and applicable laws. We reserve the right to 
              refuse service or remove content that violates these standards, even if technically generated successfully.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You agree to indemnify and hold SuNova harmless from any claims arising from your use of generated 
              content, including but not limited to copyright infringement claims related to source music or 
              improper commercial use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. License Termination</h2>
            <p className="text-muted-foreground mb-4">
              Upon termination or expiration of your subscription, you may continue to use previously generated 
              content, but may not generate new content. However, if termination is due to violation of terms, 
              all license rights may be revoked.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Updates to License Terms</h2>
            <p className="text-muted-foreground">
              We may update these license terms periodically. Continued use of the service after changes 
              constitutes acceptance of updated terms. Content generated under previous terms retains those rights.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommercialLicense;
