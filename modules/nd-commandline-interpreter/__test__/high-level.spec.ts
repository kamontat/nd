import * as chai from "chai";
import "mocha";

import { Commandline, Option } from "../index";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Commandline interpreter";

const mockArguments = (...args: string[]) => {
  return ["/tmp/node", "nd.min.js", ...args];
};

describe(rootName, function() {
  describe("Commandline object", function() {
    it("should create new commandline builder", function() {
      const name = "test";
      const desc = "this is a test command";

      const builder = new Commandline(name, desc);

      builder.name.should.be.a("string");
      builder.name.should.be.equal(name);

      builder.description.should.be.a("string");
      builder.description.should.be.equal(desc);
    });
  });

  describe("Commandline Global Option", function() {
    const builder = new Commandline("test", "this is a description");
    builder.option(
      Option.build("version", false, ({ self }) => {
        self.name.should.not.be.undefined;
      }),
    );

    it("should able to access global option callback", function() {
      builder.run(mockArguments("--version"));
    });

    it("should able to access global option callback when command exist before", function() {
      builder.run(mockArguments("command", "--version"));
    });
  });
});
