// Reads an environment variable with a fallback, treating an empty value as unset.
// The Dockerfile copies build args into the environment (ENV X=$X), so a build arg that
// wasn't passed arrives as "" rather than undefined; `??` alone would keep that empty value.
export function envOrDefault(value: string | undefined, fallback: string) {
  return value === undefined || value === "" ? fallback : value;
}
