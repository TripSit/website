import React, { useState } from "react";
import { TypeProp } from "particles-bg";
import dynamic from "next/dynamic";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  // DropdownSection,
  Button,
  DropdownItem,
} from "@heroui/react";

const ParticlesBg = dynamic(() => import("particles-bg"), {
  ssr: false,
});

const items = [
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

const particleEffects = [
  { type: "lines" }, // Small trailers
  { type: "thick" }, // Large trails
  { type: "cobweb", color: "#FFFFFF" }, // Must set color to white
  { type: "tadpole" },
  { type: "circle" },
  { type: "color" }, // Needs to be slowed down before we can use
  { type: "ball" }, // Slow down
  { type: "polygon" }, // Slow down
  { type: "square" }, // Slow down
  { type: "fountain" }, // Slow down
] as {
  type: TypeProp;
  color?: string;
  num?: number;
}[];

// function getRandomEffect() {
//   const randomIndex = Math.floor(Math.random() * particleEffects.length);
//   return particleEffects[randomIndex];
// }

// const startEffect = getRandomEffect();

export default function Particles() {
  // Initial effect is 'thick'
  const [effect, setEffectType] = useState({
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
    setEffectType(selection);
  };

  return (
    <div>
      {/* Particle component */}
      <ParticlesBg {...effect} bg={true} />
      {/* Floating background-animation picker, tucked under the hero */}
      <div
        id="animationButton"
        className="relative z-10 mx-auto -mt-16 flex max-w-6xl justify-end px-5 pb-4"
      >
        <Dropdown
          classNames={{
            content:
              "min-w-44 rounded-xl border border-line bg-surface p-1 shadow-2xl shadow-night/60",
          }}
        >
          <DropdownTrigger>
            <Button
              disableRipple
              className="appearance-none [font:inherit] inline-flex cursor-pointer items-center gap-2 rounded-full border-[1px] border-solid border-line bg-surface/70 px-4 py-2 text-sm text-mute backdrop-blur transition hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              Animations
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Background animation"
            items={items}
            classNames={{ list: "outline-none" }}
            onAction={(key) => {
              const effectProps = particleEffects.find((e) => e.type === key);
              if (effectProps) changeEffect(effectProps);
            }}
          >
            {(item) => (
              <DropdownItem
                key={(item as { key: string; label: string }).key}
                classNames={{
                  base: "cursor-pointer rounded-lg px-3 py-2 text-sm text-ink outline-none transition data-[hover=true]:bg-violet/15 data-[hover=true]:text-cyan",
                }}
              >
                {(item as { key: string; label: string }).label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
