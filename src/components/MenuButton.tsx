import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

// A button that opens a short list of choices, replacing HeroUI's Dropdown (#285). The
// site used it in one place, and it brought the React Aria stack with it.
//
// Keyboard: Enter/Space/Down opens and focuses the first item, Up opens on the last,
// Up/Down move, Home/End jump, Escape closes and returns focus to the button, Tab closes.

export type MenuItem = Readonly<{ key: string; label: string }>;

type MenuButtonProps = Readonly<{
  label: string;
  items: readonly MenuItem[];
  onAction: (key: string) => void;
  "aria-label": string;
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
}>;

export default function MenuButton({
  label,
  items,
  onAction,
  "aria-label": ariaLabel,
  className,
  menuClassName,
  itemClassName,
}: MenuButtonProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) {
      buttonRef.current?.focus();
    }
  }, []);

  // Clicking anywhere else closes it, as a menu is expected to.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const focusItem = useCallback((index: number) => {
    itemRefs.current[index]?.focus();
  }, []);

  const openAt = useCallback(
    (index: number) => {
      setOpen(true);
      // The items only exist once open, so focus after this render has painted them.
      requestAnimationFrame(() => focusItem(index));
    },
    [focusItem],
  );

  const onButtonKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openAt(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAt(items.length - 1);
    }
  };

  const onItemKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem((index + 1) % items.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem((index - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        onKeyDown={onButtonKeyDown}
        className={className}
      >
        {label}
      </button>
      {open ? (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-label={ariaLabel}
          className={menuClassName}
        >
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              onClick={() => {
                onAction(item.key);
                close(true);
              }}
              onKeyDown={(event) => onItemKeyDown(event, index)}
              className={itemClassName}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
