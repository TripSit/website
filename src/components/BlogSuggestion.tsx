"use client";

import { useSyncExternalStore } from "react";

// Old articles moved from tripsit.me/<post> to updates.tripsit.me/<post>, so suggest the
// same path on the blog. The path is read in the browser (the 404 page stays static) and
// is appended to a fixed origin, so even "//other.host/..." stays on the blog's host.
// Blog URLs end in "/", and the blog's own redirect to add it is broken (it points at an
// internal port), so add the slash here.
const noSubscribe = () => () => {};
const getPathname = () => globalThis.location.pathname;
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

  const blogPath = pathname.endsWith("/") ? pathname : `${pathname}/`;

  return (
    <p>
      Looking for an older article? It may have moved to{" "}
      <a href={`${blogOrigin}${blogPath}`}>our blog</a>.
    </p>
  );
}
