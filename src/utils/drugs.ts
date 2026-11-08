import { useQuery } from "@tanstack/react-query";
import type { Drug } from "tripsit_drug_db";

// TripSit's drug database. Each page load fetches it once; the factsheets table and the
// factsheet pages then share that copy through the app-wide QueryClient in _app.tsx.
export const DRUGS_URL =
  "https://raw.githubusercontent.com/TripSit/drugs/main/drugs.json";

// The file is over 1 MB and changes rarely, so navigating between pages reuses it
// instead of downloading it again. The table's refresh button still refetches.
export const DRUGS_STALE_TIME = 30 * 60 * 1000;

export async function fetchDrugs(): Promise<Drug[]> {
  const response = await fetch(DRUGS_URL);
  if (!response.ok) {
    throw new Error(`Fetching drugs.json failed: HTTP ${response.status}`);
  }
  return Object.values((await response.json()) as Record<string, Drug>);
}

export function useDrugs() {
  return useQuery({
    queryKey: ["drugs"],
    queryFn: fetchDrugs,
    staleTime: DRUGS_STALE_TIME,
  });
}
