import { render } from "mustache";
import LoggerService, { LOGGER_HTML_GENERATOR } from "@nd/logger";
import { Package as SecurityPackage } from "@nd/security";

import { DateENString, DateTHString } from "../api/date";
import ILoaderResponse from "../constants/LoaderResponse";
import IObject, { IConfigObject, IFunctionObject } from "../constants/Object";
import TemplateType from "../constants/TemplateType";
import loader from "../loader";

declare let __NAME__: string;
const APPNAME = process.env.NODE_ENV === "test" ? "" : __NAME__;

declare let __VERSION__: string;
const APPVER = process.env.NODE_ENV === "test" ? "" : __VERSION__;

declare let __DESCRIPTION__: string;
const APPDESC = process.env.NODE_ENV === "test" ? "" : __DESCRIPTION__;

declare let __AUTHOR__: string;
const APPAUTHOR = process.env.NODE_ENV === "test" ? "" : __AUTHOR__;

declare let __COMPILE_DATE__: string;
const COMPILE_DATE = process.env.NODE_ENV === "test" ? "" : __COMPILE_DATE__;

export default class {
  private _func: IFunctionObject;
  private _obj: IConfigObject;

  constructor(obj: IConfigObject) {
    this._func = { dateENString: DateENString, dateTHString: DateTHString };
    this._obj = this.makeDefault(obj);
  }

  public load(type: TemplateType) {
    LoggerService.log(LOGGER_HTML_GENERATOR, `start generate ${type} html pages`);

    const mustache: string = require("../templates/index.mustache");

    LoggerService.log(LOGGER_HTML_GENERATOR, `loaded root index of mustache file`);

    const css: string = require("../templates/index.sass");

    LoggerService.log(LOGGER_HTML_GENERATOR, `loaded root css file`);

    const loadResponse: ILoaderResponse = loader(type, Object.assign(this._obj, this._func));
    loadResponse.css.root = css; // replace exist mock root

    const variable: IObject = {
      ...this._obj,
      ...this._func,
      template: { ...loadResponse },
    };

    LoggerService.log(LOGGER_HTML_GENERATOR, `this is a config variable pass to mustache file: %O`, variable);

    return render(mustache, variable) as string;
  }

  public reset(obj: IConfigObject) {
    this._obj = this.makeDefault(obj);
    return this;
  }

  private makeDefault(obj: IConfigObject) {
    // default command
    if (!obj.command)
      obj.command = {
        name: APPNAME,
        version: APPVER,
        updateat: parseInt(COMPILE_DATE, 10),
      };

    // default security
    if (!obj.security)
      obj.security = {
        version: SecurityPackage.version,
      };

    // downloaded year
    if (!obj.year) obj.year = new Date().getFullYear();

    // command information
    if (!obj.title) obj.title = `${APPNAME}-command`;
    if (!obj.description) obj.description = APPDESC;
    if (!obj.author) obj.author = APPAUTHOR;

    return obj;
  }
}
