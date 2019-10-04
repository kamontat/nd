import { Chapter } from "@nd/novel";

import ILoaderResponse from "./LoaderResponse";
import { HtmlEntity } from "@nd/content";

export interface IFunctionObject {
  dateENString(): (text: string, render: (s: string) => string) => string;
  dateTHString(): (text: string, render: (s: string) => string) => string;
}

export interface ITemplateObject {
  template: ILoaderResponse;
}

export interface IConfigObject {
  auth: {
    expireat: number;
    issueat: number;
    name: string;
    username: string;
  };
  author?: string;
  chapter?: {
    cid: number;
    downloadat: number;
    link: string;
    name: string;
    next?: {
      cid: number;
      link: string;
      status: string;
    };
    nid: number;
    prev?: {
      cid: number;
      link: string;
      status: string;
    };
    status: string;
    updateat: number;
  };
  command?: {
    name: string;
    updateat: number; // timestamp
    version: string;
  };
  contents: HtmlEntity[];
  description?: string;
  novel: {
    abstract: string;
    author: string;
    chapters: Array<Chapter>;
    description: string;
    downloadat: number;
    id: number;
    link: string;
    size: number;
    tags: string[];
    title: string;
    updateat: number;
  };
  security?: {
    version: string;
  };
  title?: string;
  year?: number;
}

export default interface IObject extends IConfigObject, ITemplateObject, IFunctionObject {}
