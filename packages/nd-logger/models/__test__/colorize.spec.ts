import * as chai from "chai";
import "mocha";

// const addContext = require("mochawesome/addContext");

import Colorize from "../colorize";
chai.should();

describe("Helper", function() {
  describe("Colorize", function() {
    it("should return chalk instance", function() {
      const output = Colorize.format`some {red string}`;
      output.should.not.equal("some {red string}"); // should have some transform
    });
  });
});
