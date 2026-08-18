// Rejection sampling avoids the modulo bias of `byte % max`: since 256 isn't
// evenly divisible by most `max` values, a plain modulo would make the low
// remainders come up more often than the high ones.
function randomByteBelow(max: number): number {
  const limit = 256 - (256 % max);
  let value: number;
  do {
    value = crypto.getRandomValues(new Uint8Array(1))[0];
  } while (value >= limit);
  return value % max;
}

function randomString(): string {
  const length = 20 + randomByteBelow(10);
  let randStr = "";

  for (let i = 0; i < length; i += 1) {
    randStr += String.fromCharCode(33 + randomByteBelow(94));
  }
  return randStr;
}

export default randomString;
