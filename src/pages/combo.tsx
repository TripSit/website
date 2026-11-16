import Head from "next/head";
import type { Drug } from "tripsit_drug_db";
import ComboChecker from "../components/comboChecker/ComboChecker";
import { substanceNicknames } from "../components/comboChecker/comboData";

export async function getStaticProps() {
  // Only the nicknames reach the page, so the 1.6 MB drug database stays on the server.
  const { default: drugs } = await import("tripsit_drug_db/drugs.json");
  // TypeScript gives the JSON a literal type; the package's Drug type describes its entries.
  return {
    props: {
      nicknames: substanceNicknames(drugs as unknown as Record<string, Drug>),
    },
  };
}

export default function ComboPage({
  nicknames = {},
}: Readonly<{ nicknames?: Record<string, string[]> }>) {
  return (
    <>
      <Head>
        <title>Drug Combinations - TripSit</title>
        <meta
          name="description"
          content="Check how two or more substances interact before you mix. A quick-reference harm-reduction guide from TripSit."
        />
        {/* Poppins is loaded globally in _document.tsx; Futura/Letter Gothic are self-hosted via the CSS module. */}
      </Head>
      <ComboChecker nicknames={nicknames} />
    </>
  );
}
