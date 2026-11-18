import CalculatorPage from "../components/calculators/CalculatorPage";
import VolumetricCalculator from "../components/calculators/VolumetricCalculator";

// Formerly volume.tripsit.me (TripSit/volumetric); that host now redirects here.
export default function VolumePage() {
  return (
    <CalculatorPage
      title="Volumetric Dosing"
      description="Work out how much water to dissolve a substance in, how strong the solution is, and how much of it to take for a given dose."
      path="/volume"
      intro={
        <>
          <p>
            Dissolve a known amount of a substance in a known amount of solvent
            (usually water). You can then measure a dose much more accurately by
            measuring the liquid than by weighing the powder.
          </p>
          <p>
            Read more in our{" "}
            <a href="https://wiki.tripsit.me/wiki/Quick_Guide_to_Volumetric_Dosing">
              quick guide to volumetric dosing
            </a>
            {". "}
            Always label your solutions with the substance and its
            concentration.
          </p>
        </>
      }
    >
      <VolumetricCalculator />
    </CalculatorPage>
  );
}
