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

  it("says when no explanation has been written yet, if notes are shown", () => {
    const { rerender } = render(
      <ComboCard title="A + B" risk="caution" note="" showNote delay="0s" />,
    );
    expect(
      screen.getByText(
        "No explanation has been written for this combination yet.",
      ),
    ).toBeVisible();

    rerender(
      <ComboCard
        title="A + B"
        risk="caution"
        note=""
        showNote={false}
        delay="0s"
      />,
    );
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it.each([
    [undefined, "Details for A + B"],
    [0, "Details for A + B"],
    [1, "Details and 1 source for A + B"],
    [4, "Details and 4 sources for A + B"],
  ])("links to the pair's page, counting %s sources", (sourceCount, name) => {
    render(
      <ComboCard
        title="A + B"
        risk="caution"
        note=""
        showNote={false}
        delay="0s"
        href="/combo/a/b"
        sourceCount={sourceCount}
      />,
    );
    expect(screen.getByRole("link", { name })).toHaveAttribute(
      "href",
      "/combo/a/b",
    );
  });

  it("has no details link without a page to go to", () => {
    render(
      <ComboCard title="A + B" risk="caution" note="" showNote delay="0s" />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
