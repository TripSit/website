import { useRef, useEffect, CSSProperties } from "react";
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
  const countUpRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { start, pauseResume, reset, update } = useCountUp({
    ref: countUpRef,
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

  useEffect(() => {
    const element = document.querySelector(".count-box");
    if (!element) return;
    element.addEventListener("aos:in", start);
  });

  return (
    <div style={styles}>
      <div ref={countUpRef}>0</div>
    </div>
  );
};

export default Counter;
