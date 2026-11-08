import Link from "next/link";
import BlogSuggestion from "../components/BlogSuggestion";

const domain = process.env.NEXT_PUBLIC_DNS_DOMAIN || "tripsit.me";

// Never fetch or redirect to URLs built from request headers here (see WEB-002 in
// REVIEW-ISSUES.md); only link to the blog on a fixed host.
export default function NotFound() {
  return (
    <div className="global">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <BlogSuggestion blogOrigin={`https://blog.${domain}`} />
      <Link href="/">Return Home</Link>
    </div>
  );
}
