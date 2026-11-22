import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// A disclosure built from a <button> and a region, replacing HeroUI's Accordion (#285).
// HeroUI pulled in the whole React Aria stack — 1.48 MB gzipped — and the site used it for
// this and one menu. The props below are the ones the call sites already pass, so their
// styling is unchanged.

// Slot classes HeroUI applied by default. A caller's class for a slot is appended, so it
// wins where the two set the same property. "gap" is deliberately not among these: the
// homepage sets gap-4 and the factsheets use their own stylesheet, and leaving a default
// here would put two conflicting gap utilities on one element.
const slotDefaults = {
  trigger:
    "flex py-4 w-full h-full outline-solid outline-transparent items-center",
  startContent: "shrink-0",
  titleWrapper: "flex-1 flex flex-col text-start",
  content: "py-2",
};

type Slot =
  | "base"
  | "heading"
  | "trigger"
  | "startContent"
  | "titleWrapper"
  | "title"
  | "subtitle"
  | "indicator"
  | "content";

type AccordionSectionProps = Readonly<{
  title: ReactNode;
  startContent?: ReactNode;
  classNames?: Partial<Record<Slot, string>>;
  indicator?: (state: { isOpen: boolean }) => ReactNode;
  "aria-label"?: string;
  children: ReactNode;
}>;

const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// Set by Accordion so that opening one section closes its siblings, as HeroUI did. A
// section rendered on its own has no group and simply toggles itself.
type GroupState = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};
const AccordionContext = createContext<GroupState | null>(null);

export function Accordion({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
  // Accepted and ignored: this never drew separators of its own. The call sites draw their
  // own divider through the `base` slot.
  hideSeparator?: boolean;
}>) {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(() => ({ openId, setOpenId }), [openId]);
  return (
    <AccordionContext.Provider value={value}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

// HeroUI's default indicator: a left chevron that callers rotate when open.
const ChevronIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path
      d="M15.5 19l-7-7 7-7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export default function AccordionSection({
  title,
  startContent,
  classNames = {},
  indicator,
  "aria-label": ariaLabel,
  children,
}: AccordionSectionProps) {
  const id = useId();
  const group = useContext(AccordionContext);
  const [standaloneOpen, setStandaloneOpen] = useState(false);
  const isExpanded = group ? group.openId === id : standaloneOpen;

  const toggle = useCallback(() => {
    if (group) {
      group.setOpenId(isExpanded ? null : id);
    } else {
      setStandaloneOpen((open) => !open);
    }
  }, [group, isExpanded, id]);

  return (
    <div className={classNames.base}>
      {/* HeroUI rendered the trigger inside an h2; the call sites' heading classes expect it */}
      <h2 className={cn("m-0", classNames.heading)}>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={isExpanded}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          onClick={toggle}
          className={cn(slotDefaults.trigger, classNames.trigger)}
        >
          {startContent ? (
            <div
              className={cn(slotDefaults.startContent, classNames.startContent)}
            >
              {startContent}
            </div>
          ) : null}
          <div
            className={cn(slotDefaults.titleWrapper, classNames.titleWrapper)}
          >
            <span className={classNames.title}>{title}</span>
          </div>
          {/* data-open matches HeroUI, so data-[open=true]: styles still apply */}
          <span
            className={classNames.indicator}
            data-open={isExpanded ? "true" : undefined}
          >
            {indicator ? indicator({ isOpen: isExpanded }) : <ChevronIcon />}
          </span>
        </button>
      </h2>
      {/* Kept in the DOM when closed so the FAQ text stays readable to search engines.
          A labelled <section> is the native region (Sonar S6819 flags role="region").
          style.css gives every section 80px of padding and overflow: hidden (and
          #factsheets sections their own padding); it isn't in a CSS layer, so only an
          inline style keeps this panel laid out as it was. */}
      <section
        id={`${id}-panel`}
        aria-labelledby={`${id}-trigger`}
        hidden={!isExpanded}
        style={{ padding: 0, margin: 0, overflow: "visible" }}
      >
        <div className={cn(slotDefaults.content, classNames.content)}>
          {children}
        </div>
      </section>
    </div>
  );
}
