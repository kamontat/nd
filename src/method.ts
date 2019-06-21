import { NdSecurity } from "nd-security";

export const startCommand = (version: string) => {
  console.log(`Say Hi! from ${version}`);

  const secure = new NdSecurity("v1", "kamontat");
  console.log(secure);

  const auth = secure.encrypt({
    username: "net",
    expire: "100y",
    issue: "1ms",
    issuer: "admin",
  });
  console.log(auth);

  const detail = secure.decrypt(auth.token, auth.salt);
  console.log(detail);
};
