import type { Drug } from "tripsit_drug_db";
import CalculatorPage from "../components/calculators/CalculatorPage";
import BenzoConverter from "../components/calculators/BenzoConverter";
import { benzosFrom, type Benzo } from "../components/calculators/benzoData";

export async function getStaticProps() {
  // Only the benzodiazepines reach the page, so the 1.6 MB drug database stays on the server.
  const { default: drugs } = await import("tripsit_drug_db/drugs.json");
  return {
    props: {
      benzos: benzosFrom(drugs as unknown as Record<string, Drug>),
    },
  };
}

// Formerly benzos.tripsit.me (TripSit/Benzo-Calculator); that host now redirects here.
export default function BenzosPage({
  benzos = [],
}: Readonly<{ benzos?: Benzo[] }>) {
  return (
    <CalculatorPage
      title="Benzo Converter"
      description="Roughly convert a dose of one benzodiazepine into an equivalent dose of another, with each drug's effects and dose ranges side by side."
      path="/benzos"
      intro={
        <>
          <p>
            Work out roughly how much of one benzodiazepine matches a dose of
            another. Research both substances thoroughly before you take either.
          </p>
          <p>
            Compare their effects too: even at a similar dose, a different benzo
            might not feel the way you&apos;re used to.
          </p>
        </>
      }
    >
      <BenzoConverter benzos={benzos} />
    </CalculatorPage>
  );
}
