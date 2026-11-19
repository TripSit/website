import { fireEvent, render, screen } from "@testing-library/react";
import addDictionaryDefs from "../addDictionaryDefs";
import dictionary from "../../assets/dictionary.json";

describe("addDictionaryDefs", () => {
  it("returns nothing for undefined text", () => {
    expect(addDictionaryDefs(undefined)).toEqual([]);
  });

  it("leaves words with no dictionary entry as plain text", () => {
    const { container } = render(<>{addDictionaryDefs("hello world")}</>);
    expect(container.innerHTML).toBe("hello world ");
  });

  it("wraps a recognized word in a tooltip that describes it", async () => {
    render(<>{addDictionaryDefs("please note agonist here")}</>);
    const word = screen.getByText("agonist");
    // The word keeps its own name: no aria-label replacing it with the definition.
    expect(word.closest("[aria-label]")).toBeNull();
    fireEvent.mouseOver(word);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent(dictionary.agonist);
    expect(word.closest("[aria-describedby]")).toHaveAttribute(
      "aria-describedby",
      tooltip.id,
    );
  });

  it("strips commas before matching, but keeps the comma out of the rendered word", () => {
    render(<>{addDictionaryDefs("an agonist, basically")}</>);
    expect(screen.getByText("agonist,")).toBeInTheDocument();
  });
});
