import { getOrganizationLocalBusinessJsonLd } from '@/utils/structuredData';

/**
 * Renders site-wide Organization and LocalBusiness JSON-LD in the document.
 * Place once in the root layout (e.g. at start of body).
 */
export default function OrganizationStructuredData() {
  const scripts = getOrganizationLocalBusinessJsonLd();
  return (
    <>
      {scripts.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
