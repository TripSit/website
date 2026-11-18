import type { GetStaticPropsContext } from "next";
import ComboChart from "../../../components/comboChart/ComboChart";
import {
  LANGUAGES,
  isChartLanguage,
} from "../../../components/comboChart/translations";
import { chartProps } from "../../../utils/comboChart.server";

export function getStaticPaths() {
  return {
    paths: Object.keys(LANGUAGES)
      .filter((lang) => lang !== "en")
      .map((lang) => ({ params: { lang } })),
    fallback: false,
  };
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  const language = params?.lang;
  if (!isChartLanguage(language) || language === "en")
    return { notFound: true };
  return { props: chartProps(language) };
}

export default ComboChart;
