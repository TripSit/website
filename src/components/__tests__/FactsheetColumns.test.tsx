import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Drug } from "tripsit_drug_db";
import { useDrugs } from "@/utils/drugs";
import Factsheets from "../Factsheets";

jest.mock("@/utils/drugs", () => ({ useDrugs: jest.fn() }));
jest.mock("@heroui/react", () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
    Accordion: Object.assign(Wrapper, {
      Item: ({
        children,
      }: {
        children: (state: { isExpanded: boolean }) => ReactNode;
      }) => (
        <>
          {children({ isExpanded: false })}
          {children({ isExpanded: true })}
        </>
      ),
      Heading: Wrapper,
      Trigger: Wrapper,
      Panel: Wrapper,
      Body: Wrapper,
    }),
  };
});
jest.mock("material-react-table", () => ({
  useMaterialReactTable: (options: unknown) => options,
  MaterialReactTable: ({
    table,
  }: {
    table: {
      data: Drug[];
      columns: {
        id?: string;
        accessorKey?: keyof Drug;
        accessorFn?: (row: Drug) => unknown;
        Cell?: (props: { cell: { getValue: () => unknown } }) => ReactNode;
      }[];
      renderTopToolbarCustomActions: () => ReactNode;
    };
  }) => (
    <>
      {table.renderTopToolbarCustomActions()}
      {table.data.map((row) => (
        <div key={row.name}>
          {table.columns.map((column) => {
            const value = column.accessorFn
              ? column.accessorFn(row)
              : row[column.accessorKey as keyof Drug];
            return (
              <div key={column.id ?? column.accessorKey}>
                {column.Cell
                  ? column.Cell({ cell: { getValue: () => value } })
                  : String(value ?? "")}
              </div>
            );
          })}
        </div>
      ))}
    </>
  ),
}));

test("formats all optional factsheet columns and tolerates missing values", () => {
  const refetch = jest.fn();
  jest.mocked(useDrugs).mockReturnValue({
    data: [
      {
        name: "full",
        pretty_name: "Full",
        aliases: ["Alias"],
        properties: {
          "test-kits": "Reagent result",
          categories: ["tentative"],
          summary: "Summary",
        },
        formatted_effects: ["Example effect"],
        pweffects: { Nausea: "example" },
      },
      { name: "minimal", pretty_name: "Minimal", properties: {} },
    ],
    refetch,
  } as unknown as ReturnType<typeof useDrugs>);
  render(<Factsheets />);
  expect(screen.getByText("Reagent result")).toBeVisible();
  expect(screen.getByText("Example effect")).toBeVisible();
  expect(screen.getByText("Nausea")).toBeVisible();
  expect(screen.getByText("Minimal")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Refresh Data" }));
  expect(refetch).toHaveBeenCalledTimes(1);
});
