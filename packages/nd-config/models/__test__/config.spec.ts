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

# Multiple config in oneline
hello=true,world=false

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

    it("should load configuration file", function(done) {
      let executeRate = 0;
      const config = Configuration.CONST();
      config.on("output", function(bool) {
        bool.should.be.a("string");
        bool.should.be.equal("false");

        executeRate++;
      });

      config.on("output.asdf", function(bool) {
        bool.should.be.a("string");
        bool.should.be.equal("mock");

        executeRate++;
      });

      config.on("hello", function(bool) {
        bool.should.be.a("string");
        bool.should.be.equal("true");

        executeRate++;
      });

      config.on("world", function(bool) {
        bool.should.be.a("string");
        bool.should.be.equal("false");

        executeRate++;
      });

      config.load("/example/mock/config").then(() => {
        if (executeRate !== 4) done(new Error("did not call callback as expected"));

        done();
      });
    });

    this.afterAll(() => {
      mock.restore();
    });
  });
});
