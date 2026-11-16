import { render, screen } from "@testing-library/react";
import { envOrDefault } from "@/utils/envOrDefault";
import NotFound from "@/pages/404";

const blogHost = `updates.${envOrDefault(process.env.NEXT_PUBLIC_DNS_DOMAIN, "tripsit.me")}`;

function blogLink() {
  return new URL(
    screen.getByRole("link", { name: "our blog" }).getAttribute("href") ?? "",
  );
}

describe("NotFound", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("suggests the same path on the blog", () => {
    window.history.pushState({}, "", "/some-old-post");
    render(<NotFound />);

    expect(blogLink().host).toBe(blogHost);
    expect(blogLink().pathname).toBe("/some-old-post/");
  });

  it("keeps an existing trailing slash", () => {
    window.history.pushState({}, "", "/some-old-post/");
    render(<NotFound />);

    expect(blogLink().pathname).toBe("/some-old-post/");
  });

  it("keeps the blog host when the path looks protocol-relative", () => {
    window.history.pushState(
      {},
      "",
      `${window.location.origin}//evil.example/x`,
    );
    render(<NotFound />);

    expect(blogLink().host).toBe(blogHost);
  });

  it("links to live help and back home", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("main").querySelector('a[href="/webchat"]'),
    ).toHaveTextContent("Get Help Now");
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("keeps the site's header and footer", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeVisible();
    expect(screen.getByRole("contentinfo")).toBeVisible();
  });
});
