export interface IStyle {
  readonly name: string;
  readonly value: string;
}

export class StyleUtils {
  public static toString(s: IStyle) {
    return `${s.name}: ${s.value};`;
  }
}

export class Styles {
  public static create(styles: IStyle[]) {
    return new Styles(styles);
  }

  constructor(private ss: IStyle[]) {}

  toString() {
    return this.ss.map(s => StyleUtils.toString(s)).join(" ");
  }
}
