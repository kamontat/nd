import Package from "./package.json";

import Entity from "./models/html/entity";
import { EntityType } from "./models/html/type";

import Class from "./models/css/class";
import { Style, StyleUtils, Styles } from "./models/css/style";

// Usage:

// const entity = new Entity({
//   tag: EntityType.P,
//   content: "hello, world",
//   css: {
//     inline: new Styles([{ name: "color", value: "black" }]),
//   },
// });

// const html = entity.toHtml()

export {
  Package,
  Entity as HtmlEntity,
  EntityType as HtmlEntityType,
  Class as CssClass,
  Style as CssStyle,
  StyleUtils as CssStyleUtils,
  Styles as CssStyles,
};
