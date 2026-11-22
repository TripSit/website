import type { GetStaticPropsContext } from "next";
import Head from "../../../components/Head";
import ComboPair from "../../../components/comboChecker/ComboPair";
import {
  chartPairs,
  pairPath,
  substanceFromSlug,
  substanceSlug,
} from "../../../components/comboChecker/comboLinks";
import {
  comboPairProps,
  type ComboPairProps,
} from "../../../utils/comboPair.server";

// One page per pair on the chart (300), built with the site. Pairs are addressed in chart
// order only (/combo/mdma/ssris); any other address is a 404.
export function getStaticPaths() {
  return {
    paths: chartPairs().map(([first, second]) => ({
      params: { first: substanceSlug(first), second: substanceSlug(second) },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  const first = substanceFromSlug(String(params?.first));
  const second = substanceFromSlug(String(params?.second));
  if (
    !first ||
    !second ||
    first === second ||
    pairPath(first, second) !== `/combo/${params?.first}/${params?.second}`
  ) {
    return { notFound: true };
  }
  return { props: comboPairProps(first, second) };
}

export default function ComboPairPage(props: Readonly<ComboPairProps>) {
  const { first, second, rating, note, definition, path, indexable } = props;
  const pair = `${first} + ${second}`;
  return (
    <>
      <Head
        title={`${pair}: ${rating.label} - TripSit`}
        description={
          note
            ? `${pair}: ${rating.label}. ${note}`
            : `TripSit's drug combination chart rates ${pair} as ${rating.label}. ${definition}`
        }
        path={path}
        image="/assets/img/comboChart.png"
        imageAlt="TripSit's drug combination chart"
        noindex={!indexable}
      />
      <ComboPair {...props} />
    </>
  );
}
