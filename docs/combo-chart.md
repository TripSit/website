# Combination chart

The full chart is at `/combo/chart` (English) and `/combo/chart/<language>`.
It fits the available width by default. Choose **Actual size** for readable cells
with keyboard/touch scrolling; row labels stay visible while scrolling horizontally.
Visitors can expand **Substances**, choose at least two, set the output width and
height, then choose **Generate PNG** or **Generate PDF**. The preview immediately
shows the selected substances in the established chart order. Switching language
retains the selection and dimensions. Full-chart download links remain available
separately from custom generation.

Custom downloads are generated entirely in the visitor's browser using Canvas and
a dynamically loaded PDF encoder. No selection or image is uploaded to the server,
and production does not require Chromium. PNGs have exactly the requested pixel
dimensions. PDFs contain one page sized at 96 pixels per inch, using the same image.
The chart is centered and proportionally fitted, without cropping or stretching;
unusual aspect ratios have extra background space. Dimensions must be whole
numbers from 320 through 8192, with no more than 32 million pixels in total. Small
outputs can make text difficult to read; use larger dimensions when printing.

The page, standard downloads, and custom downloads display the TripSit attribution
and a **PolyForm Noncommercial 1.0.0** notice linked to the
[official license terms](https://polyformproject.org/licenses/noncommercial/1.0.0).
PDFs also include the notice in document metadata. The notice concerns the chart;
it does not replace licenses supplied with third-party dependencies.
It shares `GROUPS`, `SUBSTANCES`, and `getCombo` with the interactive checker.
The installed `tripsit_drug_db/combos.json` is the only source of interaction ratings;
generation does not fetch a second copy from the network. DXM is normalized to
`dextromethorphan` by the shared lookup.

## Generate PNG/PDF downloads

Use the Node version in `.nvmrc`, install dependencies, and install the export browser:

```sh
npm ci
npx puppeteer browsers install chrome
npm run combo:generate
```

Linux needs Chrome's shared libraries and fonts. On a fresh Debian/Ubuntu CI runner,
use `npx puppeteer browsers install chrome --install-deps` with sufficient privileges.
An installed Chrome can be selected with `PUPPETEER_EXECUTABLE_PATH`.

The command starts and stops its own loopback Next.js development server. Stop any
existing `next dev` first, or reuse it explicitly:

```sh
npm run combo:generate -- --base-url http://localhost:3000
npm run combo:generate -- --lang de
```

`--lang` generates one supported language; the default generates all nine. The output
is checked into `public/assets/combo/{png,pdf}` with a `manifest.json`. Regenerate and
commit these files when data, translations, or chart presentation changes. Run
`npm run build` **after** generation so the static pages expose the new downloads.
Normal production builds and the website server do not launch Chrome. Puppeteer
is a development dependency; the PDF encoder is loaded in the browser only when
a visitor generates a custom download.
`.puppeteerrc.json` also skips browser downloads during ordinary dependency
installation (including Docker builds); the explicit Chrome install above is only
needed on machines that generate exports.

For a release/CI job, the order is:

```sh
npm ci
npx puppeteer browsers install chrome --install-deps
npm run combo:generate
npm test -- --runInBand
npm run build
```

The generator checks all 300 unique pairs for unknown or conflicting ratings,
waits for fonts and images, rejects clipped chart content, checks PNG dimensions,
and verifies that each PDF contains exactly one page at the measured chart size.
It stages output until all selected languages pass, then publishes the files and
manifest. Failed runs exit nonzero and close the owned browser/server. Requests
for remote resources are blocked during rendering. Charts use local/system fonts
and the existing website logo.

The manifest fingerprints the groups, ratings/notes in both directions, and all
translations. Pages suppress downloads when the fingerprint is stale or files are
missing. Existing downloads are retained when generating only one language.

## Translations and provenance

Text was ported from [TripSit/combogen at 2b3b72c8](https://github.com/TripSit/combogen/tree/2b3b72c8d179bd85a81650537ce680edf71baa08),
including Czech, German, English, Esperanto, Spanish, French, Italian, Polish, and
Russian. Files live in `src/assets/comboChart/`. Disclaimer wording is preserved;
legacy HTML formatting was removed so text is rendered safely by React. Existing
translation quality, including partial translations, is retained. Medical wording
should be reviewed by an appropriate language/content reviewer before changing it.

`translations.ts` supplies English fallback for missing substance names or risk
labels. Unknown interactions remain explicitly unknown; they are never shown as
low risk. The chart keeps the legacy chart colors, with visible symbols and
screen-reader labels so ratings do not rely on color alone. Interaction notes
remain available in the checker (and English chart tooltips).

The legacy Python/Jinja renderer, spreadsheet import helpers, remote font services,
old QR codes, and historical generated files are not dependencies of this port.
