function randomString(): string {
  const length = 20 + (crypto.getRandomValues(new Uint8Array(1))[0] % 10);
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let randStr = "";

  for (let i = 0; i < length; i += 1) {
    randStr += String.fromCharCode(33 + (bytes[i] % 94));
  }
  return randStr;
}

export default randomString;
