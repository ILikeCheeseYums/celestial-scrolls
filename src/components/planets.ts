export type Planet = {
  id: string;
  name: string;
  color: string;
  emissive: string;
  radius: number;
  ring?: boolean;
  side: 1 | -1;
};

/** Ordered stops the camera flies past, one per content section. */
export const PLANETS: Planet[] = [
  { id: "sun", name: "Shwetank", color: "#ffb648", emissive: "#ff7a18", radius: 4.2, side: 1 },
  { id: "about", name: "About", color: "#5fa8ff", emissive: "#1b3f7a", radius: 2.1, side: -1 },
  { id: "math", name: "Math for ML", color: "#c96a4b", emissive: "#4a2117", radius: 1.6, side: 1 },
  { id: "ml", name: "Machine Learning", color: "#7ee0c0", emissive: "#12483a", radius: 2.4, ring: true, side: -1 },
  { id: "data", name: "Data Handling", color: "#b79bff", emissive: "#2e2160", radius: 1.9, side: 1 },
  { id: "cs", name: "Core CS", color: "#f2d17c", emissive: "#4d3a11", radius: 1.7, side: -1 },
  { id: "skills", name: "Skills & Tools", color: "#6fd0ff", emissive: "#123c52", radius: 2.6, ring: true, side: 1 },
  { id: "contact", name: "Contact", color: "#ff8fa3", emissive: "#5a1428", radius: 2.0, side: -1 },
];

export const SPACING = 26;
export const LATERAL = 5.5;

export function planetPosition(i: number): [number, number, number] {
  const p = PLANETS[i];
  if (i === 0) return [0, 0, 0];
  return [p.side * LATERAL, i % 3 === 0 ? 1.8 : -1.4, -i * SPACING];
}
