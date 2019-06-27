import * as chai from "chai";
import "mocha";

import { Commandline, Option } from "../index";
import CommandlineEvent from "../models/CommandlineEvent";

import { MockArguments } from "./high-level.spec";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Commandline event";

describe(rootName, function() {
  describe("initial", function() {
    it("should custom initial event", function(done) {
      const event = new CommandlineEvent();
      event.on("globalOption", function(option: Option, _: string) {
        option.name.should.be.equal("version"); // execute --version
        done();
      });

      const cli = new Commandline("name", "desc", event);

      cli.option(
        Option.build("version", false, ({ apis }) => {
          return apis.end; // don't care about default callback
        }),
      );

      cli.run(MockArguments("--version"));
    });
  });
});
