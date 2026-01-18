interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  number?: number;
}

const SectionHeader = ({ title, subtitle, number }: SectionHeaderProps) => {
  return (
    <div className="my-12">
      {number && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-display font-bold text-xl mb-4">
          {number}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
