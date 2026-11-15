import { render, screen, act } from "@testing-library/react";
import type { ComponentType } from "react";
import dynamic from "next/dynamic";

jest.mock("next/dynamic", () => jest.fn(() => () => null));
jest.mock("particles-bg", () => ({ __esModule: true, default: () => null }));
jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@widgetbot/react-embed", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@heroui/react", () => ({}));

test.each([
  "@/components/Particles",
  "@/components/DrugInfo",
  "@/components/Webchat",
])("loads the browser-only dependency in %s", async (moduleName) => {
  jest.mocked(dynamic).mockClear();
  jest.isolateModules(() => {
    jest.requireActual(moduleName);
  });
  const [loader, options] = jest.mocked(dynamic).mock.calls[0] as unknown as [
    () => Promise<{ default: ComponentType }>,
    { ssr: boolean; loading?: ComponentType },
  ];
  expect(options.ssr).toBe(false);
  const dependency = await loader();
  expect(dependency.default).toEqual(expect.any(Function));
  if (options.loading) {
    const Loading = options.loading;
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeVisible();
  }
});

test("selects the production WidgetBot server", async () => {
  jest.replaceProperty(process, "env", {
    ...process.env,
    NODE_ENV: "production",
  });
  try {
    let Webchat: ComponentType = () => null;
    jest.isolateModules(() => {
      Webchat = jest.requireActual("@/components/Webchat").default;
    });
    const widget = jest.fn(() => null);
    jest.mocked(dynamic).mockReturnValue(widget);
    jest.isolateModules(() => {
      Webchat = jest.requireActual("@/components/Webchat").default;
    });
    await act(async () => {
      render(<Webchat />);
    });
    expect(widget).toHaveBeenCalledWith(
      expect.objectContaining({
        server: "179641883222474752",
        channel: "1021385869262864464",
        shard: "https://emerald.widgetbot.io",
      }),
      undefined,
    );
  } finally {
    jest.restoreAllMocks();
  }
});
