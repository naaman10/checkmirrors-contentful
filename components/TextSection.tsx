'use client';

interface TextSectionProps {
  content: string;
}

export default function TextSection({ content }: TextSectionProps) {
  return (
    <section className="text-section py-4">
      <div className="container">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
} 