import * as chai from "chai";
import "mocha";
import mock from "mock-fs";

import { Configuration } from "../Configuration";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Configuration";

describe(rootName, function() {
  describe("Models", function() {
    this.beforeAll(() => {
      const str = `output=false
# Comment message
output.level=1
## Comment again
output.asdf=mock

mocking.abc=true # inline comment :)`;
      mock({
        "/example/mock/config": {
          "config.ndc": str,
        },
      });
    });

    it("should create config models", function(done) {
      const config1 = Configuration.CONST();
      const config2 = Configuration.CONST();

      config1.should.be.equal(config2);
      done();
    });

    it("should about to load configuration file", function(done) {
      const config = Configuration.CONST();
      config.on("output", function(bool) {
        bool.should.be.a("string");
        bool.should.be.equal("false");
      });

      config.on("output.asdf", function(bool) {
        bool.should.be.a("string");
        bool.should.be.equal("mock");

        done();
      });

      config.load("/example/mock/config");
    });

    this.afterAll(() => {
      mock.restore();
    });
  });
});
