import * as chai from "chai";
import "mocha";

const addContext = require("mochawesome/addContext");

import { NdSecurity } from "../index";
chai.should();

describe("Security", function() {
  describe("encryption", function() {
    it("should encrypt string", function() {
      const security = new NdSecurity("v1", "testuser");

      const auth = security.encrypt({
        username: "nickname",
        issuer: "admin",
        issue: "1ms",
        expire: "1h",
      });

      auth.token.should.be.a("string");
      auth.salt.should.be.a("string");
      auth.name.should.be.a("string");

      addContext(this, "simple string context");
    });
  });
});
