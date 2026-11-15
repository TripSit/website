function toQueryString(
  params = {} as {
    // [key: string]: string | number | boolean | undefined | null | Array<string>;
    [key: string]: string;
  },
) {
  if (typeof params === "object" && Object.keys(params).length) {
    const searchParams = new URLSearchParams(params);
    return `?${searchParams.toString()}`;
  }
  return "";
}

export default toQueryString;
