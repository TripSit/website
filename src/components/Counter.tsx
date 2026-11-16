import { useRef, CSSProperties, RefObject } from "react";
import { useCountUp } from "react-countup";

// https://www.npmjs.com/package/react-countup

function easingFn(t: number, b: number, c: number, d: number) {
  return c * ((t / d - 1) ** 5 + 1) + b;
}

type CounterProps = {
  styles?: CSSProperties;
  data: {
    startNum: number;
    endNum: number;
    duration: number;
    delay: number;
  };
};

const Counter = (props: CounterProps) => {
  const {
    styles,
    data: { startNum = 0, endNum, duration = 5, delay = 1 },
  } = props;
  const countUpRef = useRef<HTMLDivElement>(null);

  // enableScrollSpy starts the count when the number scrolls into view. (An earlier version
  // also listened for an "aos:in" event, but AOS 2 never sends one, and the listener was
  // added again on every render.)
  useCountUp({
    // react-countup typings predate React 19's RefObject<T | null>
    ref: countUpRef as RefObject<HTMLElement>,
    start: startNum,
    end: endNum,
    separator: ",",
    smartEasingThreshold: 2000,
    smartEasingAmount: 30,
    enableScrollSpy: true,
    easingFn,
    delay,
    duration,
  });

  return (
    <div style={styles}>
      <div ref={countUpRef}>0</div>
    </div>
  );
};

export default Counter;
