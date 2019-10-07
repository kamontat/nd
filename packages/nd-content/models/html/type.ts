export class EntityType {
  public static P = new EntityType("p");
  public static Paragraph = new EntityType("p");

  public static S = new EntityType("span");
  public static Span = new EntityType("span");

  public static H1 = new EntityType("h1");
  public static Header1 = new EntityType("h1");

  public static H2 = new EntityType("h2");
  public static Header2 = new EntityType("h2");

  public static H3 = new EntityType("h3");
  public static Header3 = new EntityType("h3");

  public static H4 = new EntityType("h4");
  public static Header4 = new EntityType("h4");

  public static H5 = new EntityType("h5");
  public static Header5 = new EntityType("h5");

  public static H6 = new EntityType("h6");
  public static Header6 = new EntityType("h6");

  public static values = [
    EntityType.P,
    EntityType.S,
    EntityType.H1,
    EntityType.H2,
    EntityType.H3,
    EntityType.H4,
    EntityType.H5,
    EntityType.H6,
  ];

  public static Convert(s: string) {
    return EntityType.values.find(e => e.name === s);
  }

  public get name() {
    return this._name;
  }

  private constructor(private _name: string) {}

  toString() {
    return this._name;
  }

  toHtml(text: string, attr?: { [key: string]: string }) {
    let attributes = "";
    if (attr) attributes += Object.keys(attr).reduce((p, c) => `${p} ${c}="${attr[c]}"`, attributes);
    return `<${this._name}${attributes}>${text}</${this._name}>`;
  }
}
