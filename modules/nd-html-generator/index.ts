import Mustache, { render } from "mustache";
import { TimeUtils } from "nd-helper";
import LoggerService, { LOGGER_HTML_GENERATOR } from "nd-logger";
import { Chapter } from "nd-novel";
import { Package as SecurityPackage } from "nd-security";

import { Package as CorePackage } from "../../src/build/Package";

import { templateLoader, TemplateType } from "./loader";
import Package from "./package.json";

declare var __COMPILE_DATE__: string;

interface IJson {
  [key: string]: any;
}

export interface ITemplateObject {
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
  contents: string[]; // might change to object array
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
    tags: string;
    title: string;
    updateat: number;
  };
  security?: {
    version: string;
  };
  title?: string;
  year?: number;
  dateToString?(): any;
  dateToTHString?(): any;
}

const __dateToString = (lang: "en" | "th") => {
  return (text: string, render: (s: string) => string) => {
    const date = TimeUtils.GetDate(parseInt(render(text), 10));
    return render(TimeUtils.FormatDate(date, { format: "short", lang }));
  };
};

const dateToString = () => __dateToString("en");
const dateToTHString = () => __dateToString("th");

export const HtmlGenerator = (type: TemplateType, obj: ITemplateObject) => {
  obj.dateToString = dateToString;
  obj.dateToTHString = dateToTHString;

  const final: IJson = { ...obj };

  // default command
  if (!final.command)
    final.command = {
      name: CorePackage.name,
      version: CorePackage.version,
      updateat: parseInt(__COMPILE_DATE__, 10),
    };

  if (!final.security)
    final.security = {
      version: SecurityPackage.version,
    };

  if (!final.year) final.year = new Date().getFullYear();

  if (!final.title) final.title = `${CorePackage.name}-command`;
  if (!final.description) final.description = CorePackage.description;
  if (!final.author) final.author = CorePackage.author;

  LoggerService.log(LOGGER_HTML_GENERATOR, "html configuration %O", final);

  // load template html
  const template = templateLoader(type, obj);
  final.template = template;

  const mustache = require("./templates/index.mustache");
  final.template.css.root = require("./templates/index.sass");

  return render(mustache, final) as string;
};

export { Package };
