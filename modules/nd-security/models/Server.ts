import { Database, DatabaseService } from "nd-database";
import ExceptionService, { ERR_SCT } from "nd-error";

import { Security } from "..";
import { USER_PATH_ACTIVATED, USER_PATH_ROOT } from "../constants";

export default class Server {
  constructor(private security: Security) {}

  public async isActivated(): Promise<Error | undefined> {
    if (!this.security.response) return ExceptionService.build(ERR_SCT, "you didn't query authentication first.");

    try {
      const db = DatabaseService.Get<Database>();
      const _value = await db.read(`${USER_PATH_ROOT}/${this.security.response.fbname}${USER_PATH_ACTIVATED}`);
      const value = _value.val();
      if (value !== true && value !== "true") {
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
