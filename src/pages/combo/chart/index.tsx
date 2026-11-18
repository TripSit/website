import { chartProps } from "../../../utils/comboChart.server";

export function getStaticProps() {
  return { props: chartProps("en") };
}

export { default } from "../../../components/comboChart/ComboChart";
