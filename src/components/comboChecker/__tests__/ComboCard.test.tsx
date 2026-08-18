import { render, screen } from "@testing-library/react";
import ComboCard from "../ComboCard";
import { RISK } from "../comboData";

describe("ComboCard", () => {
  it("renders the title, risk label, and glyph", () => {
    render(
      <ComboCard
        title="LSD + Cannabis"
        risk="caution"
        note="Some note"
        showNote={false}
        delay="0s"
      />,
    );
    expect(screen.getByText("LSD + Cannabis")).toBeInTheDocument();
    expect(screen.getByText(RISK.caution.label)).toBeInTheDocument();
    expect(screen.getByText(RISK.caution.glyph)).toBeInTheDocument();
  });

  it("shows the note only when showNote is true", () => {
    const { rerender } = render(
      <ComboCard
        title="A + B"
        risk="dangerous"
        note="Be careful"
        showNote={false}
        delay="0s"
      />,
    );
    expect(screen.queryByText("Be careful")).not.toBeInTheDocument();

    rerender(
      <ComboCard
        title="A + B"
        risk="dangerous"
        note="Be careful"
        showNote
        delay="0s"
      />,
    );
    expect(screen.getByText("Be careful")).toBeInTheDocument();
  });

  it("does not render a note element when the note is empty, even if showNote is true", () => {
    render(
      <ComboCard title="A + B" risk="unknown" note="" showNote delay="0s" />,
    );
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });
});
