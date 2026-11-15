// Splits text on spaces for rendering word by word. Each word's key is where it starts in
// the text, which stays unique when a word repeats and stable for the same text.
export function splitWords(text: string): { word: string; key: number }[] {
  let start = 0;
  return text.split(" ").map((word) => {
    const key = start;
    start += word.length + 1;
    return { word, key };
  });
}
