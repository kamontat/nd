import * as chai from "chai";
import "mocha";

// const addContext = require("mochawesome/addContext");

import { NdSecurity } from "../index";
chai.should();

describe("Security", function() {
  describe("encryption", function() {
    it("should encrypt string", function() {
      const security = new NdSecurity("v1", "test-decrypt");

      const auth = security.encrypt({
        username: "tester",
        issuer: "admin",
        issue: "1ms",
        expire: "100y",
      });

      auth.token.should.be.a("string");
      auth.salt.should.be.a("string");
      auth.name.should.be.a("string");

      // addContext(this, "simple string context");
    });

    it("should decrypt token", function() {
      const token =
        "65794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a3163325679626d46745a534936496e526c6333526c63694973496d6c68644349364d5455324d544d324e7a59344d697769626d4a6d496a6f784e5459784d7a59334e6a67794c434a6c654841694f6a51334d5463784d6a63324f444973496d6c7a63794936496d466b62576c7549697769616e5270496a6f69626d5174646a456966512e4f6437586a45594f5750457369694a477a52467538314e68484452726b6f30336653633457303048343441";
      const salt = "243261243034244661446a796a3059646c57304a4d666c41705375344f";
      const name = "test-decrypt";
      const username = "tester";

      const security = new NdSecurity("v1", name);

      const auth = security.decrypt(token, salt);

      auth.username.should.be.a("string");
      auth.username.should.be.equal(username);
    });

    it("should exception when cannot decrypt", function() {
      const token = "token";
      const salt = "salt";
      const name = "wrong-person";

      const security = new NdSecurity("v1", name);

      (function() {
        security.decrypt(token, salt);
      }.should.Throw(Error));
    });
  });
});
