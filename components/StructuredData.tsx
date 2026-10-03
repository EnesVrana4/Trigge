import { SERVICES } from "@/lib/data";
import { pageSchema } from "@/lib/seo";

/**
 * Machine-readable facts about the page: who we are, what we sell, where we
 * work. Search engines use it for rich results, and AI assistants read it when
 * they answer questions about companies like ours.
 */
export default function StructuredData(props: {
  path: string;
  title: string;
  description: string;
  faq?: boolean;
  service?: (typeof SERVICES)[number];
}) {
  return (
    <script
      type="application/ld+json"
      // The data is ours, built from lib/data.ts, so there is nothing to escape
      // beyond the closing-tag guard below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(pageSchema(props)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
