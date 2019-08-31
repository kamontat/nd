import TemplateType from "./TemplateType";

export default interface ILoaderResponse {
  body: {
    chapter: string;
    novel: string;
  };
  css: {
    chapter: string;
    name: TemplateType;
    novel: string;
    version: number;
  };
  name: string;
  version: string;
}

export interface ILoaderExtra {
  css: {
    root: string;
  };
}
