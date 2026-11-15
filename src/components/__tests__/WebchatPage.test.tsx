import { render, screen } from "@testing-library/react";
import WebchatPage from "@/pages/webchat";

jest.mock(
  "next/dynamic",
  () => () =>
    function Widget({ server, channel }: { server: string; channel: string }) {
      return (
        <div
          role="region"
          aria-label="Chat widget"
          data-server={server}
          data-channel={channel}
        />
      );
    },
);

test("mounts the configured chat widget alongside navigation and footer links", () => {
  render(<WebchatPage />);
  const widget = screen.getByRole("region", { name: "Chat widget" });
  expect(widget).toHaveAttribute("data-server", "960606557622657026");
  expect(widget).toHaveAttribute("data-channel", "1052634176161054782");
  expect(screen.getByRole("navigation", { name: "Main" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Privacy policy" })).toBeVisible();
});
