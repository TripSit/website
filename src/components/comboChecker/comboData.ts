// Combo Checker data + interaction logic.
// Ported verbatim from the "Combo Checker" Claude Design handoff (curated dataset
// and rule-based pair generation). Keep the generation rules in sync with the design.

export type RiskKey =
  | "synergy"
  | "nosynergy"
  | "decrease"
  | "caution"
  | "unsafe"
  | "dangerous"
  | "unknown";

export interface RiskDef {
  label: string;
  glyph: string;
  badge: string; // solid badge bg
  cBg: string; // tonal container bg
  cText: string; // on-container text
}

export const SUBSTANCES: string[] = [
  "2C-x",
  "5-MeO-xxT",
  "Alcohol",
  "AMT",
  "Amphetamines",
  "Benzodiazepines",
  "Caffeine",
  "Cannabis",
  "Cocaine",
  "Diphenhydramine",
  "DMT",
  "DOx",
  "DXM",
  "GHB/GBL",
  "Ketamine",
  "Lithium",
  "LSD",
  "MAOIs",
  "MDMA",
  "Mephedrone",
  "Mescaline",
  "Mushrooms",
  "MXE",
  "NBOMes",
  "Nitrous",
  "Opioids",
  "PCP",
  "SSRIs",
  "Tramadol",
];

// Material 3 Expressive tonal roles (light): container bg / on-container text / solid badge
export const RISK: Record<RiskKey, RiskDef> = {
  synergy: {
    label: "Low Risk & Synergy",
    glyph: "↑",
    badge: "#3A8C42",
    cBg: "#EAF4EA",
    cText: "#234D29",
  },
  nosynergy: {
    label: "Low Risk & No Synergy",
    glyph: "◉",
    badge: "#2E72BD",
    cBg: "#EAF1F9",
    cText: "#234E78",
  },
  decrease: {
    label: "Low Risk & Decrease",
    glyph: "↓",
    badge: "#2293A0",
    cBg: "#E6F2F3",
    cText: "#1E545B",
  },
  caution: {
    label: "Caution",
    glyph: "!",
    badge: "#B5811C",
    cBg: "#F7EFDD",
    cText: "#6B4E12",
  },
  unsafe: {
    label: "Unsafe",
    glyph: "!!",
    badge: "#CA6A2E",
    cBg: "#F8ECE2",
    cText: "#723A18",
  },
  dangerous: {
    label: "Dangerous",
    glyph: "✕",
    badge: "#C5453F",
    cBg: "#F8E8E7",
    cText: "#6E2522",
  },
  unknown: {
    label: "Unknown",
    glyph: "?",
    badge: "#6B7077",
    cBg: "#EEEFF1",
    cText: "#3C3F44",
  },
};

export const RANK: Record<RiskKey, number> = {
  dangerous: 6,
  unsafe: 5,
  caution: 4,
  unknown: 3,
  decrease: 2,
  nosynergy: 1,
  synergy: 0,
};

export const LEGEND_ORDER: RiskKey[] = [
  "synergy",
  "nosynergy",
  "decrease",
  "caution",
  "unsafe",
  "dangerous",
  "unknown",
];

type Combo = [RiskKey, string];

const LOW_RISK = "Generally low risk.";

function buildCombos(): Record<string, Combo> {
  const combos: Record<string, Combo> = {
    "Alcohol|Amphetamines": [
      "caution",
      "The stimulant masks alcohol's depressant effects, making it easy to drink to dangerous levels. Hard on the heart and dehydrating.",
    ],
    "Alcohol|Benzodiazepines": [
      "dangerous",
      "Both are CNS depressants. Together they can dangerously suppress breathing and cause blackouts, memory loss, or death.",
    ],
    "Alcohol|Caffeine": [
      "caution",
      "Caffeine masks how drunk you feel, leading to over-drinking. Both dehydrate the body.",
    ],
    "Alcohol|Cannabis": [
      "decrease",
      "Cannabis can intensify alcohol and increase nausea and dizziness ('the spins'). Take it slow.",
    ],
    "Alcohol|Cocaine": [
      "caution",
      "Produces cocaethylene, which is toxic to the heart and liver, and masks intoxication.",
    ],
    "Alcohol|DXM": [
      "caution",
      "Both cause CNS depression and nausea. Increased risk of vomiting and impaired coordination.",
    ],
    "Alcohol|GHB/GBL": [
      "dangerous",
      "Both are depressants with overlapping mechanisms. Can cause vomiting, unconsciousness, and fatal respiratory depression.",
    ],
    "Alcohol|Ketamine": [
      "caution",
      "Both depress the CNS. Increases sedation and the risk of vomiting and unconsciousness.",
    ],
    "Alcohol|LSD": [
      "caution",
      "Alcohol can dull the trip and increase nausea, while LSD lowers your sense of how drunk you are.",
    ],
    "Alcohol|MAOIs": [
      "caution",
      "Tyramine in beer and wine combined with MAOIs can dangerously raise blood pressure.",
    ],
    "Alcohol|MDMA": [
      "caution",
      "Both dehydrate the body and strain the liver. Worsens the comedown and overheating risk.",
    ],
    "Alcohol|Mushrooms": [
      "caution",
      "Alcohol can dampen the experience and increase nausea.",
    ],
    "Alcohol|Opioids": [
      "dangerous",
      "Both depress the central nervous system. A leading cause of fatal overdose through respiratory failure.",
    ],
    "Alcohol|SSRIs": [
      "nosynergy",
      "SSRIs may amplify alcohol's impairment. Generally low risk but increases drowsiness.",
    ],
    "Alcohol|Tramadol": [
      "unsafe",
      "Tramadol lowers the seizure threshold and depresses breathing; alcohol worsens both.",
    ],
    "Amphetamines|Benzodiazepines": [
      "caution",
      "Benzos mask overstimulation, prompting redosing. Conflicting effects strain the body.",
    ],
    "Amphetamines|Caffeine": [
      "caution",
      "Additive stimulation raises heart rate and blood pressure, anxiety, and insomnia.",
    ],
    "Amphetamines|Cannabis": [
      "caution",
      "Cannabis can increase anxiety and the risk of thought loops with stimulants.",
    ],
    "Amphetamines|Cocaine": [
      "caution",
      "Two strong stimulants sharply increase strain on the heart and the risk of panic.",
    ],
    "Amphetamines|DXM": [
      "unsafe",
      "DXM raises heart rate; with a stimulant this strains the cardiovascular system and can cause serotonin issues.",
    ],
    "Amphetamines|GHB/GBL": [
      "caution",
      "The stimulant masks GHB's sedation, making it easy to overdose on GHB.",
    ],
    "Amphetamines|Ketamine": [
      "caution",
      "Conflicting effects; stimulation plus dissociation can be disorienting and raise blood pressure.",
    ],
    "Amphetamines|LSD": [
      "caution",
      "Stimulants can increase anxiety and intensify the trip, making it harder to manage.",
    ],
    "Amphetamines|MAOIs": [
      "dangerous",
      "MAOIs block breakdown of the stimulant, risking a hypertensive crisis and serotonin syndrome.",
    ],
    "Amphetamines|MDMA": [
      "unsafe",
      "Increased neurotoxicity and severe cardiovascular strain. Worsens the comedown.",
    ],
    "Amphetamines|Mushrooms": [
      "caution",
      "Stimulants can amplify anxiety and make the trip harder to control.",
    ],
    "Amphetamines|Opioids": [
      "caution",
      "Opposing effects mask each other; if the stimulant wears off first, dangerous opioid depression can follow.",
    ],
    "Amphetamines|SSRIs": [
      "nosynergy",
      "SSRIs blunt the stimulant effect. Low risk, but watch for raised serotonin.",
    ],
    "Amphetamines|Tramadol": [
      "unsafe",
      "Tramadol lowers the seizure threshold and is serotonergic; with a stimulant this raises seizure and serotonin risk.",
    ],
    "Benzodiazepines|Caffeine": [
      "nosynergy",
      "Caffeine may partly counteract sedation. Generally low risk.",
    ],
    "Benzodiazepines|Cannabis": [
      "caution",
      "Combined sedation and dizziness can increase the chance of greening out.",
    ],
    "Benzodiazepines|Cocaine": [
      "caution",
      "Each masks the other, encouraging heavy redosing of both.",
    ],
    "Benzodiazepines|DXM": [
      "unsafe",
      "Both depress the CNS and impair coordination. Heavy sedation and risk of unconsciousness.",
    ],
    "Benzodiazepines|GHB/GBL": [
      "dangerous",
      "Both are potent CNS depressants. High risk of respiratory depression and death.",
    ],
    "Benzodiazepines|Ketamine": [
      "caution",
      "Combined sedation increases the risk of unconsciousness and vomiting.",
    ],
    "Benzodiazepines|LSD": [
      "decrease",
      "Benzodiazepines reduce trip intensity and are often used to stop a bad one.",
    ],
    "Benzodiazepines|MAOIs": [
      "nosynergy",
      "Generally low risk, with no notable synergy.",
    ],
    "Benzodiazepines|MDMA": [
      "decrease",
      "Benzos reduce intensity and can blunt the MDMA experience.",
    ],
    "Benzodiazepines|Mushrooms": [
      "decrease",
      "Benzodiazepines reduce trip intensity and can abort a difficult experience.",
    ],
    "Benzodiazepines|Opioids": [
      "dangerous",
      "Both suppress breathing. A very common and dangerous overdose combination.",
    ],
    "Benzodiazepines|SSRIs": [
      "nosynergy",
      "Low risk; the two are often co-prescribed.",
    ],
    "Benzodiazepines|Tramadol": [
      "unsafe",
      "Combined CNS and respiratory depression, plus tramadol's seizure risk.",
    ],
    "Caffeine|Cannabis": [
      "nosynergy",
      "Generally low risk; caffeine may slightly increase anxiety.",
    ],
    "Caffeine|Cocaine": [
      "caution",
      "Additive stimulation strains the heart and increases anxiety.",
    ],
    "Caffeine|DXM": [
      "caution",
      "Caffeine adds cardiovascular strain to DXM's stimulating effects.",
    ],
    "Caffeine|GHB/GBL": [
      "caution",
      "Caffeine can mask GHB's sedation, encouraging redosing.",
    ],
    "Caffeine|Ketamine": ["nosynergy", LOW_RISK],
    "Caffeine|LSD": [
      "caution",
      "Caffeine can increase anxiety and jitteriness during a trip.",
    ],
    "Caffeine|MAOIs": [
      "caution",
      "MAOIs can potentiate caffeine, raising blood pressure and anxiety.",
    ],
    "Caffeine|MDMA": [
      "caution",
      "Additive stimulation and dehydration raise heart rate and overheating risk.",
    ],
    "Caffeine|Mushrooms": [
      "caution",
      "Caffeine may heighten anxiety during the trip.",
    ],
    "Caffeine|Opioids": [
      "caution",
      "Caffeine can mask opioid sedation; minor cardiovascular interaction.",
    ],
    "Caffeine|SSRIs": ["nosynergy", "Low risk."],
    "Caffeine|Tramadol": [
      "nosynergy",
      "Low risk, though caffeine may marginally affect the seizure threshold.",
    ],
    "Cannabis|Cocaine": [
      "caution",
      "Stimulants increase anxiety and the risk of thought loops, which can lead to negative experiences.",
    ],
    "Cannabis|DXM": [
      "caution",
      "Cannabis can intensify DXM and increase nausea and disorientation.",
    ],
    "Cannabis|GHB/GBL": [
      "caution",
      "Combined sedation and dizziness raise the risk of greening out.",
    ],
    "Cannabis|Ketamine": [
      "synergy",
      "Cannabis intensifies the dissociative experience. Start low; it can become overwhelming.",
    ],
    "Cannabis|LSD": [
      "synergy",
      "Cannabis intensifies and extends the trip, and can increase anxiety, so dose carefully.",
    ],
    "Cannabis|MAOIs": ["nosynergy", LOW_RISK],
    "Cannabis|MDMA": [
      "synergy",
      "Cannabis can enhance the MDMA experience, especially during the comedown.",
    ],
    "Cannabis|Mushrooms": [
      "synergy",
      "Cannabis intensifies the psychedelic experience. Can increase anxiety; use sparingly.",
    ],
    "Cannabis|Opioids": [
      "synergy",
      "Cannabis can enhance and prolong opioids. Generally low risk at moderate doses.",
    ],
    "Cannabis|SSRIs": ["nosynergy", "Low risk."],
    "Cannabis|Tramadol": [
      "caution",
      "Cannabis may intensify tramadol, with minor added sedation.",
    ],
    "Cocaine|DXM": [
      "unsafe",
      "Both raise heart rate and are serotonergic, posing real cardiovascular and serotonin risk.",
    ],
    "Cocaine|GHB/GBL": [
      "caution",
      "The stimulant masks GHB sedation, risking GHB overdose when it wears off.",
    ],
    "Cocaine|Ketamine": [
      "caution",
      "Conflicting effects raise blood pressure; disorientation plus stimulation.",
    ],
    "Cocaine|LSD": [
      "caution",
      "Stimulation can increase anxiety and make the trip harder to manage.",
    ],
    "Cocaine|MAOIs": [
      "dangerous",
      "MAOIs prevent breakdown of cocaine, risking a hypertensive crisis.",
    ],
    "Cocaine|MDMA": [
      "caution",
      "Combined cardiovascular strain and increased neurotoxicity; a harder comedown.",
    ],
    "Cocaine|Mushrooms": [
      "caution",
      "Stimulation can heighten anxiety during the trip.",
    ],
    "Cocaine|Opioids": [
      "dangerous",
      "The classic speedball. The stimulant wears off first, leaving the opioid to fatally depress breathing.",
    ],
    "Cocaine|SSRIs": [
      "nosynergy",
      "Low risk; SSRIs may slightly blunt the effects.",
    ],
    "Cocaine|Tramadol": [
      "caution",
      "Tramadol's seizure risk plus stimulation and a serotonin interaction.",
    ],
    "DXM|GHB/GBL": [
      "unsafe",
      "Both are CNS depressants causing heavy sedation, nausea, and risk of unconsciousness.",
    ],
    "DXM|Ketamine": [
      "caution",
      "Two dissociatives; heavy disorientation and an increased risk of nausea and accidents.",
    ],
    "DXM|LSD": [
      "caution",
      "DXM can intensify and distort the trip unpredictably.",
    ],
    "DXM|MAOIs": [
      "dangerous",
      "High risk of serotonin syndrome, which can be fatal.",
    ],
    "DXM|MDMA": [
      "dangerous",
      "Serotonin syndrome risk plus combined cardiovascular strain. DXM also blocks MDMA metabolism.",
    ],
    "DXM|Mushrooms": [
      "caution",
      "DXM distorts and intensifies the experience and increases nausea.",
    ],
    "DXM|Opioids": [
      "caution",
      "Some DXM acts on opioid receptors; combined sedation and respiratory risk.",
    ],
    "DXM|SSRIs": [
      "unsafe",
      "Both are serotonergic; a meaningful risk of serotonin syndrome.",
    ],
    "DXM|Tramadol": [
      "dangerous",
      "Both are serotonergic and lower the seizure threshold; high risk of serotonin syndrome and seizures.",
    ],
    "GHB/GBL|Ketamine": [
      "unsafe",
      "Combined CNS depression and dissociation; high risk of unconsciousness and vomiting.",
    ],
    "GHB/GBL|LSD": [
      "caution",
      "GHB sedation can clash with the trip; risk of unexpected unconsciousness.",
    ],
    "GHB/GBL|MAOIs": [
      "caution",
      "Limited data; potential for unpredictable interactions.",
    ],
    "GHB/GBL|MDMA": [
      "caution",
      "MDMA masks GHB sedation, risking GHB overdose, with added strain.",
    ],
    "GHB/GBL|Mushrooms": [
      "caution",
      "Sedation can clash with the trip; risk of unexpected unconsciousness.",
    ],
    "GHB/GBL|Opioids": [
      "dangerous",
      "Both are potent depressants; high risk of fatal respiratory depression.",
    ],
    "GHB/GBL|SSRIs": ["nosynergy", LOW_RISK],
    "GHB/GBL|Tramadol": [
      "unsafe",
      "Combined CNS depression plus tramadol's seizure risk.",
    ],
    "Ketamine|LSD": [
      "synergy",
      "A 'k-hole' within a trip. Intensifies and adds dissociation; can be overwhelming.",
    ],
    "Ketamine|MAOIs": [
      "caution",
      "Limited data; MAOIs may potentiate the effects.",
    ],
    "Ketamine|MDMA": [
      "synergy",
      "Often combined; ketamine smooths MDMA stimulation. Watch for over-sedation and accidents.",
    ],
    "Ketamine|Mushrooms": [
      "synergy",
      "Adds dissociation to the trip; can be intense and disorienting.",
    ],
    "Ketamine|Opioids": [
      "unsafe",
      "Combined sedation and respiratory depression; risk of unconsciousness.",
    ],
    "Ketamine|SSRIs": ["nosynergy", LOW_RISK],
    "Ketamine|Tramadol": [
      "unsafe",
      "Tramadol's seizure and serotonin risk plus heavy sedation.",
    ],
    "LSD|MAOIs": [
      "caution",
      "MAOIs can potentiate and prolong LSD unpredictably.",
    ],
    "LSD|MDMA": [
      "synergy",
      "'Candyflip': the two enhance each other. Time them carefully; increased stimulation and intensity.",
    ],
    "LSD|Mushrooms": [
      "synergy",
      "Two psychedelics that combine and intensify. Effects are additive and longer.",
    ],
    "LSD|Opioids": [
      "nosynergy",
      "Generally low risk; opioids may take the edge off.",
    ],
    "LSD|SSRIs": ["decrease", "SSRIs significantly reduce the effects of LSD."],
    "LSD|Tramadol": [
      "caution",
      "Tramadol lowers the seizure threshold and is serotonergic, adding some risk.",
    ],
    "MAOIs|MDMA": [
      "dangerous",
      "MAOIs prevent MDMA breakdown, causing a potentially fatal buildup and serotonin syndrome.",
    ],
    "MAOIs|Mushrooms": [
      "caution",
      "MAOIs strongly potentiate and prolong mushrooms; effects can become overwhelming.",
    ],
    "MAOIs|Opioids": [
      "caution",
      "Some opioids (e.g. tramadol, meperidine) are dangerous with MAOIs; research the specific opioid.",
    ],
    "MAOIs|SSRIs": [
      "dangerous",
      "Combining MAOIs and SSRIs causes serotonin syndrome, which can be fatal.",
    ],
    "MAOIs|Tramadol": [
      "dangerous",
      "High risk of serotonin syndrome and seizures; potentially fatal.",
    ],
    "MDMA|Mushrooms": [
      "synergy",
      "'Hippy flip': MDMA adds warmth and energy to the trip. Watch for over-stimulation.",
    ],
    "MDMA|Opioids": [
      "caution",
      "Opposing effects mask each other, with combined strain on the body and comedown.",
    ],
    "MDMA|SSRIs": [
      "decrease",
      "SSRIs block MDMA's mechanism, greatly reducing its effects.",
    ],
    "MDMA|Tramadol": [
      "dangerous",
      "Both are serotonergic; high risk of serotonin syndrome and seizures.",
    ],
    "Mushrooms|Opioids": [
      "caution",
      "Opioid sedation can clash with the trip, with combined nausea.",
    ],
    "Mushrooms|SSRIs": [
      "decrease",
      "SSRIs can reduce the intensity of mushrooms.",
    ],
    "Mushrooms|Tramadol": [
      "caution",
      "Tramadol's serotonergic and seizure risk add some danger.",
    ],
    "Opioids|SSRIs": [
      "caution",
      "Some opioids raise serotonin with SSRIs (tramadol especially); research the specific opioid.",
    ],
    "Opioids|Tramadol": [
      "caution",
      "Tramadol is itself an opioid; stacking opioids increases respiratory depression and seizure risk.",
    ],
    "SSRIs|Tramadol": [
      "dangerous",
      "Tramadol plus SSRIs is a well-known cause of serotonin syndrome and seizures.",
    ],
  };

  const add = (x: string, y: string, r: RiskKey, n: string) => {
    const k = [x, y].sort().join("|");
    if (x !== y && !combos[k]) combos[k] = [r, n];
  };
  const cross = (A: string[], B: string[], r: RiskKey, n: string) =>
    A.forEach((x) => B.forEach((y) => add(x, y, r, n)));
  const within = (A: string[], r: RiskKey, n: string) => {
    for (let i = 0; i < A.length; i += 1)
      for (let j = i + 1; j < A.length; j += 1) add(A[i], A[j], r, n);
  };

  const Pc = ["LSD", "Mushrooms", "Mescaline", "DMT", "2C-x"];
  const Pl = ["DOx", "AMT", "5-MeO-xxT", "NBOMes"];
  const Pa = Pc.concat(Pl);
  const DIS = ["Ketamine", "MXE", "DXM", "PCP", "Nitrous"];
  const DEP = ["Alcohol", "Benzodiazepines", "GHB/GBL", "Opioids"];
  const STM = ["Amphetamines", "Cocaine", "Caffeine", "MDMA", "Mephedrone"];

  (
    [
      [
        "Alcohol",
        "Mephedrone",
        "caution",
        "Alcohol masks the stimulation and adds cardiovascular and dehydration strain.",
      ],
      [
        "Amphetamines",
        "Mephedrone",
        "caution",
        "Two strong stimulants; additive strain on the heart and a higher risk of anxiety.",
      ],
      [
        "Benzodiazepines",
        "Mephedrone",
        "caution",
        "Benzos mask overstimulation, encouraging redosing of the stimulant.",
      ],
      [
        "Caffeine",
        "Mephedrone",
        "caution",
        "Additive stimulation raises heart rate, blood pressure and anxiety.",
      ],
      [
        "Cannabis",
        "Mephedrone",
        "caution",
        "Cannabis can increase anxiety and thought loops alongside the stimulant.",
      ],
      [
        "Cocaine",
        "Mephedrone",
        "caution",
        "Two stimulants sharply increase cardiovascular strain and the risk of panic.",
      ],
      [
        "GHB/GBL",
        "Mephedrone",
        "caution",
        "The stimulant masks GHB's sedation, making a GHB overdose easy.",
      ],
      [
        "Ketamine",
        "Mephedrone",
        "caution",
        "Conflicting stimulation and dissociation raise blood pressure and disorientation.",
      ],
      [
        "Mephedrone",
        "Opioids",
        "caution",
        "Opposing effects mask each other; opioid depression can follow when the stimulant fades.",
      ],
      [
        "Mephedrone",
        "SSRIs",
        "nosynergy",
        "SSRIs blunt the stimulant effect; watch for raised serotonin.",
      ],
      [
        "MDMA",
        "Mephedrone",
        "dangerous",
        "Both strongly raise serotonin and strain the heart, posing a serious risk of serotonin syndrome.",
      ],
      [
        "MAOIs",
        "Mephedrone",
        "dangerous",
        "MAOIs block breakdown of the stimulant, risking hypertensive crisis and serotonin syndrome.",
      ],
      [
        "DXM",
        "Mephedrone",
        "unsafe",
        "Both are serotonergic and stimulating; cardiovascular and serotonin-syndrome risk.",
      ],
      [
        "Mephedrone",
        "Tramadol",
        "unsafe",
        "Both are serotonergic and lower the seizure threshold, raising seizure and serotonin risk.",
      ],
      [
        "Amphetamines",
        "NBOMes",
        "unsafe",
        "NBOMe compounds strongly constrict blood vessels; with a stimulant this seriously strains the heart.",
      ],
      [
        "Cocaine",
        "NBOMes",
        "unsafe",
        "Heavy vasoconstriction plus stimulation poses a real cardiovascular risk.",
      ],
      [
        "MDMA",
        "NBOMes",
        "unsafe",
        "Combined vasoconstriction and serotonergic strain; best avoided.",
      ],
      [
        "Mephedrone",
        "NBOMes",
        "unsafe",
        "Combined vasoconstriction and stimulation strains the cardiovascular system.",
      ],
      [
        "Caffeine",
        "NBOMes",
        "caution",
        "Caffeine adds cardiovascular strain to an already vasoconstrictive psychedelic.",
      ],
      [
        "Lithium",
        "MDMA",
        "dangerous",
        "Lithium with MDMA significantly raises the risk of seizures.",
      ],
      [
        "Lithium",
        "Mephedrone",
        "dangerous",
        "Lithium markedly raises the seizure risk with stimulants of this type.",
      ],
      [
        "Lithium",
        "Tramadol",
        "unsafe",
        "Both lower the seizure threshold and act on serotonin.",
      ],
      [
        "Lithium",
        "SSRIs",
        "caution",
        "Combined serotonergic effect; in medicine this is monitored closely.",
      ],
      [
        "Lithium",
        "MAOIs",
        "caution",
        "Limited data; potential for a serotonergic interaction.",
      ],
      [
        "Caffeine",
        "Lithium",
        "nosynergy",
        "Caffeine can slightly lower lithium levels; generally low risk.",
      ],
      ["Cannabis", "Lithium", "nosynergy", LOW_RISK],
      [
        "Cannabis",
        "MXE",
        "synergy",
        "Cannabis intensifies the dissociative experience; start low.",
      ],
      [
        "Cannabis",
        "PCP",
        "caution",
        "Cannabis can intensify PCP, increasing confusion and agitation.",
      ],
      [
        "Cannabis",
        "Nitrous",
        "nosynergy",
        "Brief added dizziness; generally low risk.",
      ],
    ] as [string, string, RiskKey, string][]
  ).forEach((e) => add(e[0], e[1], e[2], e[3]));

  (
    ["SSRIs", "MAOIs", "MDMA", "Mephedrone", "Tramadol", "DXM"] as string[]
  ).forEach((y) => {
    add(
      "AMT",
      y,
      "dangerous",
      "AMT is strongly serotonergic; combining sharply raises the risk of serotonin syndrome.",
    );
    add(
      "5-MeO-xxT",
      y,
      "dangerous",
      "5-MeO tryptamines are strongly serotonergic; high risk of serotonin syndrome.",
    );
  });

  Pa.forEach((x) =>
    add(
      x,
      "Lithium",
      "dangerous",
      "Lithium markedly raises the seizure risk with psychedelics and is best avoided.",
    ),
  );
  STM.forEach((y) =>
    add(
      "Lithium",
      y,
      "caution",
      "Lithium may increase the risk of stimulant toxicity.",
    ),
  );
  DEP.forEach((y) =>
    add(
      "Lithium",
      y,
      "caution",
      "Added sedation and the potential for an unpredictable interaction.",
    ),
  );
  DIS.forEach((y) =>
    add(
      "Lithium",
      y,
      "caution",
      "Limited data; lithium may interact unpredictably.",
    ),
  );

  within(
    Pc,
    "synergy",
    "Two psychedelics combine and intensify; effects are additive and last longer.",
  );
  cross(
    Pl,
    Pa,
    "caution",
    "Long-acting or unpredictable psychedelics are much harder to manage when combined.",
  );
  Pc.forEach((x) =>
    add(
      x,
      "MAOIs",
      "caution",
      "MAOIs can strongly potentiate and prolong this psychedelic.",
    ),
  );
  Pl.forEach((x) =>
    add(
      x,
      "MAOIs",
      "dangerous",
      "High risk of serotonin toxicity; this combination is best avoided.",
    ),
  );
  Pc.forEach((x) =>
    add(
      x,
      "SSRIs",
      "decrease",
      "SSRIs typically reduce the effects of this psychedelic.",
    ),
  );
  Pa.forEach((x) =>
    add(
      x,
      "Tramadol",
      "caution",
      "Tramadol lowers the seizure threshold and is serotonergic, adding risk.",
    ),
  );
  cross(
    Pa,
    STM,
    "caution",
    "Stimulants raise anxiety and can make the experience harder to manage.",
  );
  Pa.forEach((x) =>
    add(
      x,
      "Benzodiazepines",
      "decrease",
      "Benzodiazepines reduce intensity and can stop a difficult experience.",
    ),
  );
  cross(
    Pa,
    ["Alcohol", "GHB/GBL", "Opioids"],
    "caution",
    "Depressants can clash with the experience and add confusion or nausea.",
  );
  cross(
    Pa,
    DIS,
    "caution",
    "Adding a dissociative increases disorientation and can be very intense.",
  );
  Pc.forEach((x) =>
    add(
      "Cannabis",
      x,
      "synergy",
      "Cannabis intensifies and extends the psychedelic experience; it can increase anxiety.",
    ),
  );
  Pl.forEach((x) =>
    add(
      "Cannabis",
      x,
      "caution",
      "Cannabis can intensify an already unpredictable psychedelic; use sparingly.",
    ),
  );

  within(
    DIS,
    "caution",
    "Two dissociatives strongly increase disorientation and the risk of accidents.",
  );
  cross(
    DIS,
    DEP,
    "unsafe",
    "Combined CNS depression and dissociation; risk of unconsciousness and vomiting.",
  );
  cross(
    DIS,
    STM,
    "caution",
    "Conflicting stimulation and dissociation raise blood pressure and disorientation.",
  );

  DEP.forEach((y) =>
    add(
      "Diphenhydramine",
      y,
      "unsafe",
      "Additive sedation and respiratory depression, plus a heavy anticholinergic load.",
    ),
  );
  STM.forEach((y) =>
    add(
      "Diphenhydramine",
      y,
      "caution",
      "Opposing effects mask each other and strain the heart.",
    ),
  );
  Pa.forEach((y) =>
    add(
      "Diphenhydramine",
      y,
      "caution",
      "DPH can turn a psychedelic experience confusing or unpleasant.",
    ),
  );
  DIS.forEach((y) =>
    add(
      "Diphenhydramine",
      y,
      "caution",
      "Combined sedation, disorientation and anticholinergic effects.",
    ),
  );
  (["Tramadol", "MAOIs", "SSRIs", "Cannabis", "Lithium"] as string[]).forEach(
    (y) =>
      add(
        "Diphenhydramine",
        y,
        "caution",
        "Increased sedation or anticholinergic strain; take care.",
      ),
  );

  return combos;
}

const COMBOS = buildCombos();

const UNKNOWN_NOTE =
  "There isn't enough reliable data on this combination. Treat it as potentially risky and research it thoroughly.";

export function getCombo(
  a: string,
  b: string,
): { risk: RiskKey; note: string } {
  const v = COMBOS[[a, b].sort().join("|")];
  return v
    ? { risk: v[0], note: v[1] }
    : { risk: "unknown", note: UNKNOWN_NOTE };
}

// Accent color -> tonal container/on-container roles (used for empty state + focus tones).
const ACCENT_TONES: Record<string, { container: string; on: string }> = {
  "#2487ce": { container: "#e3f1fb", on: "#16507b" },
  "#683394": { container: "#efe6f6", on: "#51277a" },
  "#47aeff": { container: "#e4f2ff", on: "#15598c" },
  "#11dbcf": { container: "#d6f7f5", on: "#0a7a73" },
};

export function accentTone(accent: string): { container: string; on: string } {
  return ACCENT_TONES[accent] || { container: "#e3f1fb", on: "#16507b" };
}
