// Frontend ke 4 default templates database me daalta hai (dobara chalane se duplicate nahi bante):
//
//   npm run seed-templates
//
import "dotenv/config";
import mongoose from "mongoose";
import Template from "../models/Template.js";

const templates = [
  { slug: "modern-3", name: "Modern 3 Bedroom", size: "30 x 60 ft", style: "Pakistani Modern", rooms: ["Living Room", "Kitchen", "Dining Room", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom"] },
  { slug: "family-25", name: "25 x 50 Family House", size: "25 x 50 ft", style: "Warm Modern", rooms: ["Living Room", "Open Kitchen", "Master Bedroom", "Bedroom 2", "Bathrooms"] },
  { slug: "luxury-40", name: "40 x 60 Luxury Villa", size: "40 x 60 ft", style: "Luxury", rooms: ["Drawing Room", "Family Room", "Kitchen", "Dining", "4 Bedrooms", "Garage", "Garden"] },
  { slug: "minimal-single", name: "Minimal Single Story", size: "30 x 45 ft", style: "Minimal Modern", rooms: ["Living Room", "Kitchen", "2 Bedrooms", "2 Bathrooms", "Courtyard"] },
];

// Frontend Templates.jsx wala templatePlan() jaisa hi plan
function templatePlan(template) {
  const [width, length] = template.size.replace(" ft", "").split(" x ").map(Number);
  return {
    project: { name: template.name, plotWidth: width, plotLength: length, floors: 1, units: "feet" },
    rooms: [
      { id: "living-1", type: "living", name: "Living Room", x: 45, y: 45, width: 220, height: 140, rotation: 0 },
      { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 280, y: 45, width: 160, height: 110, rotation: 0 },
      { id: "master-1", type: "bedroom", name: "Master Bedroom", x: 45, y: 205, width: 200, height: 125, rotation: 0 },
      { id: "bedroom-2", type: "bedroom", name: "Bedroom 2", x: 265, y: 205, width: 165, height: 115, rotation: 0 },
      { id: "bath-1", type: "bathroom", name: "Bathroom", x: 450, y: 205, width: 80, height: 75, rotation: 0 },
      { id: "garden-1", type: "garden", name: "Front Garden", x: 45, y: 350, width: 485, height: 65, rotation: 0 },
    ],
    doors: [{ id: "main-door", name: "Main Entrance", x: 130, y: 38, width: 52, height: 10, rotation: 0 }],
    windows: [{ id: "living-window", name: "Living Window", x: 110, y: 38, width: 55, height: 8, rotation: 0 }],
    walls: [], furniture: [], dimensions: [], source: "template",
    site: { boundaryWall: { enabled: true, height: 2.2 }, gate: { style: "modern", width: 4 }, garden: true, driveway: true, parkingSpaces: 2 },
    exterior: { style: template.style.toLowerCase(), facadeMaterial: "white-plaster", facadeColor: "#f4f1e8" },
    materials: { wall: "white-paint", floor: "light-wood", door: "dark-wood", windowFrame: "black" },
    lighting: { mode: "day", intensity: 1.8, warmth: 0.45 },
    roof: { type: "parapet", material: "concrete", color: "#d9d5ca", height: 0.45 },
  };
}

await mongoose.connect(process.env.MONGODB_URI);

for (const [index, template] of templates.entries()) {
  await Template.updateOne(
    { slug: template.slug },
    { $set: { ...template, floorPlanData: templatePlan(template), sortOrder: index, isPublished: true } },
    { upsert: true }
  );
  console.log(`Seeded: ${template.name}`);
}

await mongoose.disconnect();
