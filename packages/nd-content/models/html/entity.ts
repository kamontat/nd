import { EntityType } from "./type";
import Class from "../css/class";
import { Styles } from "../css/style";

export default class Entity {
  private tag: EntityType;
  private content: string;

  private css?: { classes?: Class[]; inline?: Styles };

  constructor(opts: { tag: EntityType; content: string; css?: { classes?: Class[]; inline?: Styles } }) {
    this.tag = opts.tag;
    this.content = opts.content;

    this.css = opts.css;
  }

  toString() {
    return this.content;
  }

  toHtml() {
    let attr: { [key: string]: string } | undefined;
    if (this.css) {
      attr = {};
      if (this.css.classes) attr["class"] = this.css.classes.map(c => c.toString()).join(" ");
      if (this.css.inline) attr["style"] = this.css.inline.toString();
    }

    return this.tag.toHtml(this.content, attr);
  }
}
