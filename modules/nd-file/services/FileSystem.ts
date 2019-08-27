import { isAbsolute as absolute, resolve } from "path";

import FileASyncManager from "../models/FileAsyncManager";
import { FileInput, ILoadOptions } from "../models/interface/defined";
import { IFileASyncManager } from "../models/interface/IFileAsyncManager";

type Path = string;
type Content = string | undefined;

interface ISystemAdder {
  alias: string;
  content: Content;
  name: string;
}

export default class {
  private list: Map<Path, ISystemAdder>; // Map<Path, Content>
  private manager: IFileASyncManager;

  constructor(private root: string) {
    this.manager = new FileASyncManager(root);
    this.list = new Map();
  }

  public add(p: ISystemAdder): this {
    if (absolute(p.name)) this.list.set(p.alias, p);
    else this.list.set(p.alias, Object.assign(p, { name: resolve(this.root, p.name) }));

    return this;
  }

  public append(input: FileInput, opts?: ILoadOptions) {
    return this.manager.name(input, opts);
  }

  public async run() {
    if (!this.manager.loaded) await this.manager.load({ create: true });
    return this.manager;
  }
}
