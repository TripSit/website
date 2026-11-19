import { fireEvent, render, screen, within } from "@testing-library/react";
import type { Drug } from "tripsit_drug_db";
import BenzosPage, { getStaticProps } from "@/pages/benzos";
import BenzoConverter from "@/components/calculators/BenzoConverter";
import {
  benzosFrom,
  convertDose,
  equivalentMg,
  type Benzo,
} from "@/components/calculators/benzoData";

function drug(name: string, extra: Partial<Drug> = {}): Drug {
  return {
    name,
    pretty_name: name.charAt(0).toUpperCase() + name.slice(1),
    properties: {},
    ...extra,
  } as Drug;
}

function benzo(
  name: string,
  equivalentMgValue: number,
  extra: Partial<Benzo> = {},
): Benzo {
  return {
    name,
    prettyName: name.charAt(0).toUpperCase() + name.slice(1),
    aliases: [],
    equivalence: `${equivalentMgValue}mg ~=10mg Diazepam`,
    equivalentMg: equivalentMgValue,
    summary: null,
    effects: null,
    duration: null,
    afterEffects: null,
    doses: [],
    ...extra,
  };
}

async function realBenzos(): Promise<Benzo[]> {
  const { props } = await getStaticProps();
  return props.benzos;
}

const converted = () => screen.getByRole("status", { name: "Converted dose" });

describe("reading the drug database", () => {
  test("takes the first number of the equivalence, keeping both decimals", () => {
    // The old converter's regex read this as 0.2
    expect(equivalentMg("Brotizolam - 0.25mg ~=10mg Diazepam.")).toBe(0.25);
    expect(equivalentMg("Bromazepam - 5-6mg's ~=10mg Diazepam.")).toBe(5);
    expect(equivalentMg("Flutoprazepam - ~2.5mg ~=10mg Diazepam.")).toBe(2.5);
    expect(equivalentMg("roughly equal to diazepam")).toBeUndefined();
    expect(equivalentMg("0mg")).toBeUndefined();
  });

  test("keeps benzos with a usable equivalence, sorted, with their other names and oral doses", () => {
    const benzos = benzosFrom({
      zolam: drug("zolam", {
        aliases: ["Zolam", "zz", "ZZ", "zed"],
        properties: {
          dose_to_diazepam: "Zolam - 2mg ~=10mg Diazepam.",
          summary: "A summary.",
          effects: "Sleepy.",
          duration: "6 hours",
          "after-effects": "Groggy.",
        },
        formatted_dose: {
          Intravenous: { Common: "1mg" },
          Oral: { Common: "2-4mg", Light: "1mg", Fatal: "lots" },
        } as unknown as Drug["formatted_dose"],
      }),
      azepam: drug("azepam", {
        properties: { dose_to_diazepam: "Azepam - 10mg ~=10mg Diazepam." },
        formatted_dose: {
          Rectal: { Strong: "20mg" },
        } as unknown as Drug["formatted_dose"],
      }),
      nodose: drug("nodose", {
        properties: { dose_to_diazepam: "Nodose - 1mg ~=10mg Diazepam." },
      }),
      unparsable: drug("unparsable", {
        properties: { dose_to_diazepam: "about the same as diazepam" },
      }),
      notabenzo: drug("notabenzo"),
    });

    expect(benzos.map((b) => b.name)).toEqual(["azepam", "nodose", "zolam"]);
    const [azepam, nodose, zolam] = benzos;
    expect(zolam).toEqual({
      name: "zolam",
      prettyName: "Zolam",
      aliases: ["zz", "zed"],
      equivalence: "Zolam - 2mg ~=10mg Diazepam.",
      equivalentMg: 2,
      summary: "A summary.",
      effects: "Sleepy.",
      duration: "6 hours",
      afterEffects: "Groggy.",
      doses: [
        { level: "Light", amount: "1mg" },
        { level: "Common", amount: "2-4mg" },
      ],
    });
    // Without an oral route, the first listed route is used
    expect(azepam.doses).toEqual([{ level: "Strong", amount: "20mg" }]);
    expect(nodose).toMatchObject({
      aliases: [],
      summary: null,
      effects: null,
      duration: null,
      afterEffects: null,
      doses: [],
    });
  });

  test("ships the real benzodiazepines from the drug database", async () => {
    const benzos = await realBenzos();
    expect(benzos.length).toBeGreaterThan(20);
    expect(benzos.find((b) => b.name === "alprazolam")).toMatchObject({
      equivalentMg: 0.5,
      aliases: expect.arrayContaining(["xanax"]),
    });
    expect(benzos.find((b) => b.name === "brotizolam")?.equivalentMg).toBe(
      0.25,
    );
  });

  test("converts through the diazepam equivalents", () => {
    expect(
      convertDose(1, benzo("alprazolam", 0.5), benzo("diazepam", 10)),
    ).toBe(20);
    expect(
      convertDose(10, benzo("diazepam", 10), benzo("clonazepam", 0.5)),
    ).toBe(0.5);
  });
});

describe("the converter page", () => {
  test("starts on alprazolam to diazepam and converts a typed dose", async () => {
    render(<BenzosPage benzos={await realBenzos()} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Benzo Converter" }),
    ).toBeVisible();
    expect(converted()).toHaveTextContent("Enter a dose to convert.");
    expect(
      screen.getByRole("combobox", { name: "Benzodiazepine you have" }),
    ).toHaveValue("alprazolam");
    expect(
      screen.getByRole("combobox", { name: "Benzodiazepine to convert to" }),
    ).toHaveValue("diazepam");

    fireEvent.change(
      screen.getByRole("textbox", { name: "Dose you have (mg)" }),
      {
        target: { value: "1" },
      },
    );
    expect(converted()).toHaveTextContent(
      "1 mg of Alprazolam is roughly 20 mg of Diazepam.",
    );
  });

  test("accepts brand names and shows both drugs' details with factsheet links", async () => {
    render(<BenzosPage benzos={await realBenzos()} />);
    const from = screen.getByRole("combobox", {
      name: "Benzodiazepine you have",
    });
    const to = screen.getByRole("combobox", {
      name: "Benzodiazepine to convert to",
    });

    expect(
      within(from).getByRole("option", { name: "Xanax (Alprazolam)" }),
    ).toBeInTheDocument();
    fireEvent.change(from, { target: { value: "diazepam/valium" } });
    fireEvent.change(to, { target: { value: "clonazepam" } });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Dose you have (mg)" }),
      {
        target: { value: "10" },
      },
    );

    expect(from).toHaveValue("diazepam/valium");
    expect(converted()).toHaveTextContent(
      "10 mg of Diazepam is roughly 0.5 mg of Clonazepam.",
    );
    const target = screen.getByRole("region", {
      name: "Converting to: Clonazepam",
    });
    expect(
      within(target).getByRole("link", { name: "Clonazepam" }),
    ).toHaveAttribute("href", "/factsheets/clonazepam");
    expect(
      within(target).getByText("Clonazepam - 0.5mg ~=10mg Diazepam."),
    ).toBeVisible();
    expect(
      within(target).getByRole("heading", { name: "Oral dose" }),
    ).toBeVisible();
  });

  test("ignores doses that aren't positive numbers", () => {
    render(
      <BenzoConverter
        benzos={[benzo("alprazolam", 0.5), benzo("diazepam", 10)]}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Dose you have (mg)" });
    for (const value of ["-1", "abc", "0"]) {
      fireEvent.change(input, { target: { value } });
      expect(converted()).toHaveTextContent("Enter a dose to convert.");
    }
  });

  test("asks what a dose like 1.500 means instead of guessing", () => {
    render(
      <BenzoConverter
        benzos={[benzo("alprazolam", 0.5), benzo("diazepam", 10)]}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Dose you have (mg)" });
    // 1.500 is 1.5 in the US and 1500 in Germany.
    fireEvent.change(input, { target: { value: "1.500" } });
    expect(converted()).toHaveTextContent(
      "“1.500” could mean 1500 or 1.5. Type 1500 or 1.5 instead.",
    );
    fireEvent.change(input, { target: { value: "1.5" } });
    expect(converted()).toHaveTextContent(
      "1.5 mg of Alprazolam is roughly 30 mg of Diazepam.",
    );
  });

  test("falls back to the first benzos and skips missing details", () => {
    render(
      <BenzoConverter benzos={[benzo("azepam", 10), benzo("zolam", 2)]} />,
    );

    expect(
      screen.getByRole("combobox", { name: "Benzodiazepine you have" }),
    ).toHaveValue("azepam");
    expect(
      screen.getByRole("combobox", { name: "Benzodiazepine to convert to" }),
    ).toHaveValue("zolam");
    // No aliases anywhere, so no "Other names" group
    expect(screen.queryByRole("group", { name: "Other names" })).toBeNull();
    expect(screen.getAllByText("No dose information available")).toHaveLength(
      2,
    );
    expect(screen.queryByRole("heading", { name: "Summary" })).toBeNull();
  });

  test("uses one benzo for both sides when there is only one", () => {
    render(<BenzoConverter benzos={[benzo("azepam", 10)]} />);
    expect(
      screen.getByRole("combobox", { name: "Benzodiazepine to convert to" }),
    ).toHaveValue("azepam");
  });

  test("says so when there is nothing to convert", () => {
    render(<BenzosPage />);
    expect(
      screen.getByText(/couldn't load its benzodiazepine list/),
    ).toBeVisible();
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  test("treats an unknown choice as the first benzo", () => {
    render(
      <BenzoConverter benzos={[benzo("azepam", 10), benzo("zolam", 2)]} />,
    );
    // A value with no matching option leaves the select empty
    fireEvent.change(
      screen.getByRole("combobox", { name: "Benzodiazepine to convert to" }),
      { target: { value: "missing" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Dose you have (mg)" }),
      { target: { value: "10" } },
    );
    expect(converted()).toHaveTextContent(
      "10 mg of Azepam is roughly 10 mg of Azepam.",
    );
  });
});
