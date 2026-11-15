import { splitWords } from "../splitWords";

describe("splitWords", () => {
  it("keys each word by where it starts in the text", () => {
    expect(splitWords("an agonist, an")).toEqual([
      { word: "an", key: 0 },
      { word: "agonist,", key: 3 },
      { word: "an", key: 12 },
    ]);
  });
});
