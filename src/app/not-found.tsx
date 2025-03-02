import Link from "next/link";
import { RedirectType, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";

async function fetchUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch (error) {
    return false;
  }
}

export default async function NotFound() {
  const referer = (await headers()).get("referer");
  if (referer) {
    const blogUrl = referer.replace("https://", "https://blog.");
    if (await fetchUrl(blogUrl)) {
      permanentRedirect(blogUrl, "replace" as RedirectType);
    }
  }
  return (
    <div className="global">
      <h2>Not Found </h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
