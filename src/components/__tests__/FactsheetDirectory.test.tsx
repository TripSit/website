import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Drug } from "tripsit_drug_db";
import type { GetStaticPropsContext } from "next";
import FactsheetsPage, { getStaticProps } from "@/pages/factsheets";
import { fetchDrugs } from "@/utils/drugs";

jest.mock("@/utils/drugs", () => ({ fetchDrugs: jest.fn() }));
jest.mock("../Header", () => () => null);
jest.mock("../Head", () => () => null);
jest.mock("../Factsheets", () => () => null);

test("includes canonical factsheet links in server-rendered HTML", async () => {
  jest.mocked(fetchDrugs).mockResolvedValue([
    {
      name: "α-pbp",
      pretty_name: "Alpha-PBP",
      aliases: ["duplicate"],
    } as Drug,
  ]);
  const result = await getStaticProps({} as GetStaticPropsContext);
  expect(result).toHaveProperty("revalidate", 3600);
  if (!("props" in result)) throw new Error("Expected directory props");
  const props = await result.props;
  expect(props.directory).toEqual([
    { name: "α-pbp", pretty_name: "Alpha-PBP" },
  ]);
  const html = renderToStaticMarkup(<FactsheetsPage {...props} />);
  expect(html).toContain('href="/factsheets/%CE%B1-pbp"');
  render(<FactsheetsPage {...props} />);
  const directory = screen.getByRole("navigation", {
    name: "Factsheet directory",
  });
  expect(
    within(directory).getByRole("link", { name: "Alpha-PBP" }),
  ).toHaveAttribute("href", "/factsheets/%CE%B1-pbp");
});

test("does not publish an empty directory when the upstream database fails", async () => {
  jest.mocked(fetchDrugs).mockRejectedValue(new Error("HTTP 503"));
  await expect(getStaticProps({} as GetStaticPropsContext)).rejects.toThrow(
    "HTTP 503",
  );
});
