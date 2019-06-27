import * as chai from "chai";
import "mocha";
import { Commandline, Option } from "nd-commandline-interpreter";
import { CommandlineEvent } from "nd-commandline-interpreter";
import { MockArguments } from "nd-commandline-interpreter/__test__/high-level.spec";
import MockConfiguration from "nd-config/models/__test__/MockConfiguration";
import LoggerService from "nd-logger";

import { BuildCommandline } from "../nd";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "ND root command";

describe(rootName, function() {
  const CLI_ERR = new Error("commandline didn't initial on time");
  let cli: Commandline | undefined;
  this.beforeAll(async () => {
    cli = await BuildCommandline(new Commandline("nd", "for test purpose only"), new MockConfiguration());
    LoggerService.disable();

    (global as any).__COMPILE_DATE__ = +new Date();
  });

  describe("demo nd command in programming", function() {
    it("should get version option", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option) {
        opt.name.should.be.equal("version");
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("--version"));
    });

    it("should get version option", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option) {
        opt.name.should.be.equal("help");
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("--help"));
    });
  });
});
