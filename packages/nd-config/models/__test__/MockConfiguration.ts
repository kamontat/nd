import { Configuration } from "../Configuration";
import { ConfigSchema } from "../IConfigurationTypeDefined";

export default class MockConfiguration extends Configuration {
  protected _object: ConfigSchema = {
    mode: "test",
    version: "v1",
    "auth.name": "",
    "auth.token": "",
    "auth.salt": "",
    "output.color": false,
    "output.file": false,
    "output.level": "0", // mute everything
    "novel.location": "/tmp/",
    "command.version.detail.limit": 1,
  };

  public constructor() {
    super();
  }
}
