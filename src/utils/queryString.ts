export default (
  params = {} as {
    // [key: string]: string | number | boolean | undefined | null | Array<string>;
    [key: string]: string;
  },
) => {
  if (typeof params === "object" && Object.keys(params).length) {
    const searchParams = new URLSearchParams(params);
    return `?${searchParams.toString()}`;
  }
  console.log("Params should be a non empty object");
  return "";
};
