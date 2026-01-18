interface QuoteBlockProps {
  children: React.ReactNode;
  author?: string;
}

const QuoteBlock = ({ children, author }: QuoteBlockProps) => {
  return (
    <div className="my-8 border-l-4 border-primary pl-6 py-4 bg-muted/20 rounded-r-lg">
      <blockquote className="text-xl font-display italic text-foreground/90">
        {children}
      </blockquote>
      {author && (
        <cite className="text-sm text-muted-foreground mt-2 block not-italic">
          — {author}
        </cite>
      )}
    </div>
  );
};

export default QuoteBlock;
