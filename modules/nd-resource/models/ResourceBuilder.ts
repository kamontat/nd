import { Novel } from "nd-novel";

import { Resource } from "./Resource";

export class ResourceBuilder {
  constructor(private novel: Novel) {}

  public build() {
    return new Resource(JSON.stringify(this.novel.toJSON()));
  }
}
