import { Database, DatabaseService } from "nd-database";
import ExceptionService, { ERR_SCT } from "nd-error";
import LoggerService, { LOGGER_SECURITY } from "nd-logger";

import { Security } from "..";
import { USER_PATH_ACTIVATED, USER_PATH_ROOT } from "../constants";

export default class Server {
  constructor(private security: Security) {}

  public async isActivated(): Promise<Error | undefined> {
    if (!this.security.response) return ExceptionService.build(ERR_SCT, "you didn't query authentication first.");

    try {
      LoggerService.log(LOGGER_SECURITY, "connecting to database server...");

      const db = DatabaseService.Get<Database>("database");
      const _value = await db.read(`${USER_PATH_ROOT}/${this.security.response.fbname}`);

      if (!_value.exists) {
        return ExceptionService.build(
          ERR_SCT,
          "your user data is not exist; contact our admin to manually add to the server",
        );
      }

      LoggerService.log(LOGGER_SECURITY, "  - data is exist, start verifying...");
      const value = _value.data();
      if (!value || (value[USER_PATH_ACTIVATED] !== true && value[USER_PATH_ACTIVATED] !== "true")) {
        return ExceptionService.build(
          ERR_SCT,
          "your user is not activated; if you didn't hack our command please contact us.",
        );
      }

      return undefined;
    } catch (e) {
      return e;
    }
  }
}
