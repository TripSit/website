// jsdom does no layout, so every element measures 0 x 0. The factsheets table renders only
// the rows that fit (row virtualization), so in a 0-pixel table it would render none. Give
// elements a size for the test; with rows as tall as the table, it renders the first row
// plus its overscan, which covers every fixture used in these tests.
export function giveTableRoom() {
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 1200,
    bottom: 800,
    width: 1200,
    height: 800,
    toJSON: () => ({}),
  } as DOMRect);
}
