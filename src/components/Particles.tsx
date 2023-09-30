/* eslint-disable arrow-parens */
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
} from "@nextui-org/react";

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
    color?: string | undefined;
    num?: number | undefined;
  }) => {
    setEffectType(selection);
  };

  return (
    <div>
      {/* Particle component */}
      <ParticlesBg {...effect} bg={true} />
      <div id="animationButton">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Animations</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            items={items}
            onAction={(key) => {
              const effectProps = particleEffects.find((e) => e.type === key);
              if (effectProps) changeEffect(effectProps);
            }}
          >
            {(item) => (
              <DropdownItem
                key={(item as { key: string; label: string }).key}
                className={(item as { key: string; label: string }).key}
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
