import cotton from "../assets/images/cotton.webp";
import denim from "../assets/images/denim.webp";
import silk from "../assets/images/silk.webp";
import linen from "../assets/images/linen.webp";
import polyester from "../assets/images/polyester.webp";
import customFabric from "../assets/images/custom fabric.webp";

const categories = [
  {
    id: "cotton",
    name: "Cotton",
    nameKey: "categories.cotton.name",
    description:
      "Breathable, versatile cotton constructions for everyday and premium apparel.",
    descriptionKey: "categories.cotton.description",
    image: cotton,
    subcategories: [
      "Poplin",
      "Jersey",
      "Twill",
      "Printed",
      "Dyed",
      "Yarn Dyed",
      "Handloom",
      "Powerloom",
      "Shirting",
      "Canvas",
    ],
  },
  {
    id: "denim",
    name: "Denim",
    nameKey: "categories.denim.name",
    description:
      "Structured and stretch denim for jeans, jackets, workwear and lifestyle products.",
    descriptionKey: "categories.denim.description",
    image: denim,
    subcategories: [
      "Stretch Denim",
      "Washed Denim",
      "Raw Denim",
      "Rigid Denim",
      "Selvedge Denim",
      "Lightweight Denim",
      "Heavyweight Denim",
      "Black Denim",
      "Printed Denim",
      "Denim Twill",
    ],
  },
  {
    id: "silk",
    name: "Silk",
    nameKey: "categories.silk.name",
    description:
      "Premium silk constructions for luxury apparel, bridalwear and accessories.",
    descriptionKey: "categories.silk.description",
    image: silk,
    subcategories: [
      "Mulberry Silk",
      "Satin Silk",
      "Raw Silk",
      "Dupion Silk",
      "Organza",
      "Chiffon",
      "Georgette",
      "Crepe",
      "Jacquard",
      "Printed Silk",
    ],
  },
  {
    id: "linen",
    name: "Linen",
    nameKey: "categories.linen.name",
    description:
      "Natural and blended linen fabrics for breathable fashion and home textiles.",
    descriptionKey: "categories.linen.description",
    image: linen,
    subcategories: [
      "European Linen",
      "Pure Linen",
      "Linen Blend",
      "Flax Linen",
      "Organic Linen",
      "Chambray",
      "Twill",
      "Canvas",
      "Jacquard",
      "Printed Linen",
    ],
  },
  {
    id: "polyester",
    name: "Polyester",
    nameKey: "categories.polyester.name",
    description:
      "Reliable performance fabrics for fashion, uniforms and technical applications.",
    descriptionKey: "categories.polyester.description",
    image: polyester,
    subcategories: [
      "Performance",
      "Satin",
      "Crepe",
      "Chiffon",
      "Georgette",
      "Taffeta",
      "Organza",
      "Twill",
      "Mesh",
      "Printed",
    ],
  },
  {
    id: "custom-fabric",
    name: "Custom Fabric",
    nameKey: "categories.customFabric.name",
    description:
      "Made-to-spec textile development for private-label and bulk buyers.",
    descriptionKey: "categories.customFabric.description",
    image: customFabric,
    subcategories: [
      "Designer",
      "Printed",
      "Private Label",
      "Custom Weave",
      "Custom Dye",
      "Custom Finish",
    ],
  },
];

export default categories;

