import * as chai from "chai";
import "mocha";

import { Command, Commandline, Option } from "../index";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Commandline interpreter";

export const MockArguments = (...args: string[]) => {
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
    it("should able to access global option callback", function() {
      const builder = new Commandline("test", "this is a description");

      builder.option(
        Option.build("version", false, ({ self, apis }) => {
          self.name.should.not.be.undefined;
          return apis.end;
        }),
      );

      return builder.run(MockArguments("--version"));
    });

    it("should able to access global option callback when command exist before", function() {
      const builder = new Commandline("test", "this is a description");

      builder.option(
        Option.build("version", false, ({ self, apis }) => {
          self.name.should.not.be.undefined;
          return apis.end;
        }),
      );

      builder.command(Command.build("command", false, () => {}));

      return builder.run(MockArguments("command", "--version"));
    });
  });
});
