import { render, screen } from "@testing-library/react";
import ReflectPage from "@/pages/reflect";
import ReflectPrivacyPage from "@/pages/reflect/privacy";
import ReflectTermsPage from "@/pages/reflect/terms";

test("introduces the app with store and community links, its features and its legal pages", () => {
  render(<ReflectPage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Reflect" }),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: /Google Play/ })).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Join the Reflect Discord" }),
  ).toHaveAttribute("href", "https://discord.gg/3sT6w9aKV3");
  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "Estimated effect timeline",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Read the privacy policy" }),
  ).toHaveAttribute("href", "/reflect/privacy");
  expect(
    screen.getByRole("link", { name: "Read the terms of service" }),
  ).toHaveAttribute("href", "/reflect/terms");
  expect(screen.getByRole("navigation", { name: "Main" })).toBeVisible();
});

test.each([
  ["Privacy Policy", ReflectPrivacyPage, "Location"],
  ["Terms of Service", ReflectTermsPage, "No warranty"],
])(
  "hosts the %s with its sections, contact address and a way back",
  (title, Page, section) => {
    render(<Page />);
    expect(
      screen.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
    expect(screen.getByText("Last updated: 15 November 2026")).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: section }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "reflect@aero.nu" }),
    ).toHaveAttribute("href", "mailto:reflect@aero.nu");
    expect(
      screen.getByRole("link", { name: "Back to Reflect" }),
    ).toHaveAttribute("href", "/reflect");
  },
);

test("points the terms at the privacy policy hosted alongside them", () => {
  render(<ReflectTermsPage />);
  expect(
    screen.getByRole("link", { name: "https://tripsit.me/reflect/privacy" }),
  ).toHaveAttribute("href", "/reflect/privacy");
});
