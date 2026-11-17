import ComboChart from "../../../components/comboChart/ComboChart";
import { chartProps } from "../../../utils/comboChart.server";

export function getStaticProps() {
  return { props: chartProps("en") };
}

export default ComboChart;
