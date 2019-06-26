import * as chai from "chai";
import "mocha";
import mock from "mock-fs";

import { Configuration } from "../Configuration";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Configuration";

describe(rootName, function() {
  describe("Models", function() {
    it("should create config models", function(done) {
      const config1 = Configuration.CONST();
      const config2 = Configuration.CONST();

      config1.should.be.equal(config2);
      done();
    });

    it("should about to load configuration file", function(done) {
      mock({
        "/example/mock/config": {
          "config.ndc": "output=false",
        },
      });
      const config = Configuration.CONST();
      config.on("output", function(bool) {
        bool.should.not.be.undefined;
        bool.should.be.a("string");

        done();
        mock.restore();
      });

      config.load("/example/mock/config");
    });
  });
});
