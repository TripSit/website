"use client";

import { useSyncExternalStore } from "react";

// Old articles moved from tripsit.me/<post> to blog.tripsit.me/<post>, so suggest the
// same path on the blog. The path is read in the browser (the 404 page stays static) and
// is appended to a fixed origin, so even "//other.host/..." stays on the blog's host.
const noSubscribe = () => () => {};
const getPathname = () => window.location.pathname;
const getServerPathname = () => "/";

export default function BlogSuggestion({
  blogOrigin,
}: {
  readonly blogOrigin: string;
}) {
  const pathname = useSyncExternalStore(
    noSubscribe,
    getPathname,
    getServerPathname,
  );

  return (
    <p>
      Looking for an older article? It may have moved to{" "}
      <a href={`${blogOrigin}${pathname}`}>our blog</a>.
    </p>
  );
}
