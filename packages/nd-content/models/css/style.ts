export interface Style {
  readonly name: string;
  readonly value: string;
}

export class StyleUtils {
  public static toString(s: Style) {
    return `${s.name}: ${s.value};`;
  }
}

export class Styles {
  public static create(styles: Style[]) {
    return new Styles(styles);
  }

  constructor(private ss: Style[]) {}

  toString() {
    return this.ss.map(s => StyleUtils.toString(s)).join(" ");
  }
}
