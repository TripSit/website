import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

const blogHost = `blog.${process.env.NEXT_PUBLIC_DNS_DOMAIN || "tripsit.me"}`;

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
    expect(blogLink().pathname).toBe("/some-old-post");
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

  it("links back home", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
