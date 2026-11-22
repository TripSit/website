import React, { useEffect, useState } from "react";
import { TypeProp } from "particles-bg";
import Proton from "proton-engine";
import dynamic from "next/dynamic";
import MenuButton from "./MenuButton";
import { usePrefersReducedMotion } from "../utils/usePrefersReducedMotion";

const ParticlesBg = dynamic(() => import("particles-bg"), {
  ssr: false,
});

export const items = [
  {
    key: "lines",
    label: "Tiny Tracers",
  },
  {
    key: "thick",
    label: "Thick Tracers",
  },
  {
    key: "cobweb",
    label: "Connections",
  },
  {
    key: "tadpole",
    label: "Tadpoles",
  },
  {
    key: "circle",
    label: "Circles",
  },
  {
    key: "color",
    label: "Colorful",
  },
  {
    key: "ball",
    label: "Balls",
  },
  {
    key: "polygon",
    label: "Polygons",
  },
  {
    key: "square",
    label: "Squares",
  },
  {
    key: "fountain",
    label: "Fountain",
  },
] as {
  key: string;
  label: string;
}[];

export const particleEffects = [
  { type: "lines" }, // Small trailers
  { type: "thick" }, // Large trails
  { type: "cobweb", color: "#FFFFFF" }, // Must set color to white
  { type: "tadpole" },
  { type: "circle" },
  { type: "color" },
  { type: "ball" },
  { type: "polygon" },
  { type: "square" },
  { type: "fountain" },
] as {
  type: TypeProp;
  color?: string;
  num?: number;
}[];

// particles-bg's engine (Proton) moves everything on by a fixed 1/60 s each animation frame.
// These effects are hectic at that pace (#7), so they run at half speed: the same effect in
// slow motion, since movement, how often particles appear and how long they last all scale.
const FRAME_STEP = 0.0167;
const SLOWED = new Set<TypeProp>([
  "color",
  "ball",
  "polygon",
  "square",
  "fountain",
]);

export function frameStep(type: TypeProp): number {
  return SLOWED.has(type) ? FRAME_STEP / 2 : FRAME_STEP;
}

export default function Particles() {
  // Initial effect is 'thick'
  const [effect, setEffect] = useState({
    type: "cobweb",
    color: "#FFFFFF",
  } as {
    type: TypeProp;
    color?: string;
    num?: number;
  });

  // Handle the button click
  const changeEffect = (selection: {
    type: TypeProp;
    color?: string;
    num?: number;
  }) => {
    setEffect(selection);
  };

  const reducedMotion = usePrefersReducedMotion();

  // The step is read on every frame, so the current effect changes speed straight away.
  useEffect(() => {
    Proton.DEFAULT_INTERVAL = frameStep(effect.type);
    return () => {
      Proton.DEFAULT_INTERVAL = FRAME_STEP;
    };
  }, [effect.type]);

  // No moving background, and so no picker for it, for someone who asked for reduced motion.
  if (reducedMotion) {
    return null;
  }

  return (
    <div>
      {/* Particle component */}
      <ParticlesBg {...effect} bg={true} />
      {/* Floating background-animation picker, tucked under the hero */}
      <div
        id="animationButton"
        className="relative z-10 mx-auto -mt-16 flex max-w-6xl justify-end px-5 pb-4"
      >
        <MenuButton
          label="Animations"
          aria-label="Background animation"
          items={items}
          onAction={(key) => {
            const effectProps = particleEffects.find((e) => e.type === key);
            if (effectProps) changeEffect(effectProps);
          }}
          className="appearance-none [font:inherit] inline-flex cursor-pointer items-center gap-2 rounded-full border-[1px] border-solid border-line bg-surface/70 px-4 py-2 text-sm text-mute backdrop-blur transition hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          menuClassName="absolute right-0 top-full z-20 mt-2 flex w-44 flex-col rounded-2xl border-[1px] border-solid border-line bg-surface p-1 shadow-2xl shadow-night/60"
          itemClassName="appearance-none [background:none] [border:none] [font:inherit] w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-ink transition hover:bg-violet/15 hover:text-cyan focus-visible:bg-violet/15 focus-visible:text-cyan focus-visible:outline-none"
        />
      </div>
    </div>
  );
}
