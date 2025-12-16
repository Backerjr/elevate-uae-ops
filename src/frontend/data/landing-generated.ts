export interface VehicleData {
  id: string;
  name: string;
  type: string;
  power: string;
  price: number;
  image: string;
  specs: string[];
}

export const VEHICLES: VehicleData[] = [
  {
    id: "v1",
    name: "Dune Raider 1000",
    type: "Single Seater",
    power: "1000cc Turbo",
    price: 850,
    image: "/assets/placeholders/buggy-generic.svg",
    specs: ["0-60 in 4.5s", "Solo Command", "Fox Suspension"],
  },
  {
    id: "v2",
    name: "Sand Fury X",
    type: "Two Seater",
    power: "1200cc Beast",
    price: 1200,
    image: "/assets/placeholders/buggy-generic.svg",
    specs: ["Shared Thrill", "Bluetooth Audio", "Roll Cage L5"],
  },
  {
    id: "v3",
    name: "Desert Titan Max",
    type: "Four Seater",
    power: "1500cc Family",
    price: 1800,
    image: "/assets/placeholders/buggy-generic.svg",
    specs: ["Group Power", "Family Safe (6+)", "Extended Range"],
  },
];
