import { Accordion, cn } from "@heroui/react";
import type { ReactNode } from "react";

// HeroUI 3 builds accordions from parts (Item > Heading > Trigger, Panel > Body).
// This keeps HeroUI 2's single-item API (title, startContent, classNames per
// slot, indicator) so existing call sites and their styling stay unchanged.

// HeroUI 2's default slot classes. HeroUI 2 merged them with the caller's
// classNames (tailwind-merge rules); `cn` does the same, so caller classes win.
// Wrap items in <Accordion className="w-full px-2">, HeroUI 2's root default.
const slotDefaults = {
  trigger:
    "flex py-4 w-full h-full gap-3 outline-solid outline-transparent items-center",
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

// HeroUI 2's default indicator: a left chevron that callers rotate when open.
const ChevronIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
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
  return (
    <Accordion.Item className={classNames.base}>
      {({ isExpanded }) => (
        <>
          <Accordion.Heading level={2} className={classNames.heading}>
            <Accordion.Trigger
              aria-label={ariaLabel}
              className={cn(slotDefaults.trigger, classNames.trigger)}
            >
              {startContent ? (
                <div
                  className={cn(
                    slotDefaults.startContent,
                    classNames.startContent,
                  )}
                >
                  {startContent}
                </div>
              ) : null}
              <div
                className={cn(
                  slotDefaults.titleWrapper,
                  classNames.titleWrapper,
                )}
              >
                <span className={classNames.title}>{title}</span>
              </div>
              {/* data-open matches HeroUI 2, so data-[open=true]: styles still apply */}
              <span
                className={classNames.indicator}
                data-open={isExpanded ? "true" : undefined}
              >
                {indicator ? (
                  indicator({ isOpen: isExpanded })
                ) : (
                  <ChevronIcon />
                )}
              </span>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body
              className={cn(slotDefaults.content, classNames.content)}
            >
              {children}
            </Accordion.Body>
          </Accordion.Panel>
        </>
      )}
    </Accordion.Item>
  );
}
