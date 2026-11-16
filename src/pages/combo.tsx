import Head from "next/head";
import ComboChecker from "../components/comboChecker/ComboChecker";

export default function ComboPage() {
  return (
    <>
      <Head>
        <title>Drug Combinations - TripSit</title>
        <meta
          name="description"
          content="Check how two or more substances interact before you mix. A quick-reference harm-reduction guide from TripSit."
        />
        {/* ComboChecker loads Poppins with next/font; Futura/Letter Gothic are self-hosted via the CSS module. */}
      </Head>
      <ComboChecker />
    </>
  );
}
