import { Novel } from "nd-novel";

import { RESOURCE_FILENAME } from "../constants";

import { Resource } from "./Resource";

export abstract class ResourceBuilder {
  public static Novel = class extends ResourceBuilder {
    constructor(private novel: Novel) {
      super();
    }
    public build() {
      return new Resource(JSON.stringify(this.novel.toJSON({ content: false })), RESOURCE_FILENAME);
    }
  };

  public abstract build(): Resource;
}
