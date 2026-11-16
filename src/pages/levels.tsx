import CalculatorPage from "../components/calculators/CalculatorPage";
import LevelCalculator from "../components/calculators/LevelCalculator";

// Formerly tripsit-levelling-calculator.netlify.app (TripSit/LevelCalculator).
// TripBot's /levels command links here.
export default function LevelsPage() {
  return (
    <CalculatorPage
      title="Discord Levelling Calculator"
      description="Work out how much XP you need to reach a level in the TripSit Discord, and roughly how many messages or hours of voice chat that takes."
      path="/levels"
      intro={
        <>
          <p>
            Find out how much XP you need to reach a level in the{" "}
            <a href="https://discord.gg/tripsit">TripSit Discord</a>, and
            roughly how many messages or hours of voice chat that takes.
          </p>
          <p>
            The messages and voice hours are estimates, based on about 20 XP for
            each message and 10 XP for each minute in voice chat. Thanks to
            Hipperooni, who made the original calculator.
          </p>
        </>
      }
    >
      <LevelCalculator />
    </CalculatorPage>
  );
}
