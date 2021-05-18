export default function compose(...fns) {
  return (a) => fns.reduceRight((b, fn) => fn(b), a);
}
