import Link from "next/link";
import CalculatorPage from "../components/calculators/CalculatorPage";
import DxmCalculator from "../components/calculators/DxmCalculator";

// Formerly dxm.tripsit.me (TripSit/DXM-Calculator); that host now redirects here.
export default function DxmPage() {
  return (
    <CalculatorPage
      title="DXM Dosage Calculator"
      description="Work out how much DXM you need to reach each plateau, based on your weight and the strength of your product."
      path="/dxm"
      intro={
        <>
          <p>
            Work out how much <Link href="/factsheets/dxm">DXM</Link> you need
            to reach each plateau, based on your weight and the strength of the
            product you&apos;re using. Our wiki describes{" "}
            <a href="https://wiki.tripsit.me/wiki/DXM#Plateaus">
              the plateau model and the effects of each plateau
            </a>
            {"."}
          </p>
          <p>
            DXM products may also contain other ingredients that can be
            dangerous, so make sure DXM is the only active ingredient in yours.
            Read more about{" "}
            <a href="https://wiki.tripsit.me/wiki/DXM#Adulteration">
              DXM adulterants
            </a>
            {"."}
          </p>
          <p>
            Before combining DXM with other drugs, check our{" "}
            <Link href="/combo">combo chart</Link>. Read the label and research
            the product thoroughly before you use it.
          </p>
        </>
      }
    >
      <DxmCalculator />
    </CalculatorPage>
  );
}
