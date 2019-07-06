import { Configuration } from "../Configuration";
import { ConfigSchema } from "../interface";

export default class MockConfiguration extends Configuration {
  protected _object: ConfigSchema = {
    "mode": "test",
    "version": "v1",
    "auth.name": "",
    "auth.token": "",
    "auth.salt": "",
    "output.color": false,
    "output.file": false,
    "output.level": "0", // mute everything
    "novel.location": "/tmp/",
    "novel.export": false, // not implement yet
  };

  public constructor() {
    super();
  }
}
