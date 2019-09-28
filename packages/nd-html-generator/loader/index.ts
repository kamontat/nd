import { render } from "mustache";
import LoggerService, { LOGGER_HTML_GENERATOR } from "nd-logger";

import LoaderResponse from "../constants/LoaderResponse";
import { IConfigObject, IFunctionObject } from "../constants/Object";
import TemplateType from "../constants/TemplateType";

export default (name: TemplateType, obj: IConfigObject & IFunctionObject): LoaderResponse => {
  const pjson = require(`../templates/${name}/package.json`);

  LoggerService.log(LOGGER_HTML_GENERATOR, "load package.json on template folder: %O", pjson);

  const cssVersion = parseInt(pjson.cssVersion, 10);

  const novel = require(`../templates/${name}/novel.html`);
  const chapter = require(`../templates/${name}/chapter.html`);

  return {
    body: {
      novel: render(novel, obj),
      chapter: render(chapter, obj),
    },
    css: {
      name,
      version: isNaN(cssVersion) ? 1 : cssVersion,
      novel: require(`../templates/${name}/novel.sass`),
      chapter: require(`../templates/${name}/chapter.sass`),
      root: "",
    },
    name: pjson.name,
    version: pjson.version,
  };
};
