import { Configuration } from "../Configuration";
import { ConfigKey, ConfigSchema } from "../interface";

export default class MockConfiguration extends Configuration {
  protected _object: ConfigSchema = {
    "mode": "test",
    "version": "v1",
    "output.color": false,
    "output.file": false,
    "output.level": "2",
    "novel.location": "/tmp/",
    "novel.export": false, // not implement yet
  };

  public constructor() {
    super();
  }
}
