import assert from "assert";
import * as chai from "chai";
import "mocha";
import { Commandline, Option } from "@nd/commandline-interpreter";
import { CommandlineEvent } from "@nd/commandline-interpreter";
import { MockArguments } from "@nd/commandline-interpreter/__test__/high-level.spec";
import MockConfiguration from "@nd/config/models/__test__/MockConfiguration";
import LoggerService from "@nd/logger";

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

  describe("Demo global options", function() {
    it("should execute `nd --version`", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option) {
        opt.name.should.be.equal("version");
      });
      customEvent.on("end", function() {
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("--version"));
    });

    it("should execute `nd --help`", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option) {
        opt.name.should.be.equal("help");
      });
      customEvent.on("end", function() {
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("--help"));
    });

    it("should execute `nd command --help`", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option) {
        opt.name.should.be.equal("help");
      });
      customEvent.on("end", function() {
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("command", "--help"));
    });

    it("should execute `nd command --help`", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option) {
        opt.name.should.be.equal("help");
      });
      customEvent.on("end", function() {
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("command", "--help"));
    });

    it("should execute `nd --level 2 --help`", function(done) {
      if (!cli) throw CLI_ERR;

      const customEvent = new CommandlineEvent();
      customEvent.on("globalOption", function(opt: Option, str: string) {
        if (opt.name === "level") {
          str.should.be.equal("2");
          return;
        }
        if (opt.name === "help") {
          return;
        }

        return assert.fail("unknown global option has been executed");
      });
      customEvent.on("end", function() {
        done();
      });

      cli.event = customEvent;
      cli.run(MockArguments("--level", "2", "--help"));
    });
  });
});
