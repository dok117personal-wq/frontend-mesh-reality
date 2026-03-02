/**
 * JSON-LD Component
 * 
 * This component renders structured data in JSON-LD format for better SEO.
 * JSON-LD (JavaScript Object Notation for Linked Data) helps search engines
 * understand the content and context of your web pages.
 */

export default function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
