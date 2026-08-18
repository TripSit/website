import { render, screen } from "@testing-library/react";
import Legend from "../Legend";
import { LEGEND_ORDER, RISK } from "../comboData";

describe("Legend", () => {
  it("renders a label and glyph for every risk in LEGEND_ORDER", () => {
    render(<Legend />);
    LEGEND_ORDER.forEach((key) => {
      const r = RISK[key];
      expect(screen.getByText(r.label)).toBeInTheDocument();
      expect(screen.getByText(r.glyph)).toBeInTheDocument();
    });
  });
});
