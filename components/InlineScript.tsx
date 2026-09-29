"use client";

/**
 * A script that runs while the HTML is parsed, before the first paint. The
 * server renders it as JavaScript; on the client React renders it as inert
 * text/plain, so it never runs twice and React doesn't warn about a <script>
 * rendered from a component. suppressHydrationWarning covers the type mismatch.
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
