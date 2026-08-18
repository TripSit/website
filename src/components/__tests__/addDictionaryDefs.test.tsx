import { render, screen } from "@testing-library/react";
import addDictionaryDefs from "../addDictionaryDefs";
import dictionary from "../../assets/dictionary.json";

describe("addDictionaryDefs", () => {
  it("returns [''] for undefined text", () => {
    expect(addDictionaryDefs(undefined)).toEqual([""]);
  });

  it("leaves words with no dictionary entry as plain strings", () => {
    const result = addDictionaryDefs("hello world");
    expect(result).toEqual(["hello ", "world "]);
  });

  it("wraps a recognized word in a tooltip carrying its definition", () => {
    render(<>{addDictionaryDefs("please note agonist here")}</>);
    expect(screen.getByText("agonist")).toBeInTheDocument();
    const tooltipHost = screen.getByText("agonist").closest("[aria-label]");
    expect(tooltipHost).toHaveAttribute("aria-label", dictionary.agonist);
  });

  it("strips commas before matching, but keeps the comma out of the rendered word", () => {
    render(<>{addDictionaryDefs("an agonist, basically")}</>);
    expect(screen.getByText("agonist,")).toBeInTheDocument();
  });
});
