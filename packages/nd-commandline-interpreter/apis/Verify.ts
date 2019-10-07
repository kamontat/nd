import { IConfiguration } from "@nd/config";
import ExceptionService, { ERR_SCT } from "@nd/error";
import { Security } from "@nd/security";

export default {
  async CheckAuthenication(config: IConfiguration): Promise<{ err?: Error; secure: Security }> {
    const secure = new Security("v1", config.get("auth.name") as string);
    if (secure.isVerified(config.get("auth.token") as string, config.get("auth.salt") as string)) {
      if (secure.response) {
        const err = await secure.server.isActivated();
        if (err) return { err, secure };
      }

      return { err: undefined, secure };
    } else {
      return {
        err: ExceptionService.build(ERR_SCT, "security is invalid; please check your token salt and name again"),
        secure,
      };
    }
  },
};
