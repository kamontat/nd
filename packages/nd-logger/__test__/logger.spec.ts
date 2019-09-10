import assert from "assert";
import * as chai from "chai";
import "mocha";
import rewire from "rewire";

import LoggerService from "../index";
import LoggerMock from "../models/__test__/LoggerMock";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Logger";

describe(rootName, function() {
  describe("Services", function() {
    it("should about to get logger instance", function() {
      LoggerService.should.not.be.undefined;
    });

    it("should enable logger", function() {
      LoggerService.enable("nd:*"); // enable all log

      const logger = new LoggerMock(() => {});
      logger.enabled.should.be.true;

      LoggerService.enable("nd:hello-world"); // enable all log
      logger.enabled.should.be.false;
    });

    it("should able to disable all logger", function() {
      LoggerService.enable("*");

      const logger = new LoggerMock(() => {});
      logger.enabled.should.be.true;

      LoggerService.disable();

      logger.enabled.should.be.false;
    });

    it("should able to log to log service", function() {
      const MESSAGE = "log message";

      const mock = new LoggerMock((event, format) => {
        if (event === "debug") format.should.be.equal(format);
      });

      LoggerService.log(mock, MESSAGE);
    });

    it("should able to log to warn service", function() {
      const MESSAGE = "log message";

      const mock = new LoggerMock((event, format) => {
        if (event === "stderr") assert.fail("warning message will log to stdlog");
        if (event === "extend") format.should.be.equal("warn"); // must extend warn for warn message
        if (event === "debug") format.should.be.equal(format);
      });

      LoggerService.warn(mock, MESSAGE);
    });

    it("should able to log to error service", function() {
      const MESSAGE = "log message";

      const mock = new LoggerMock((event, format) => {
        if (event === "stdlog") assert.fail("error message shouldn't change to stdlog");
        if (event === "extend") format.should.be.equal("error"); // must extend error for error message
        if (event === "debug") format.should.be.equal(format);
      });

      LoggerService.error(mock, MESSAGE);
    });
  });

  describe("Console log", function() {
    it("Shouldn't called console.log when disable logger", function() {
      const service = rewire("../index");
      service.__set__({
        console: {
          log() {
            assert.fail("Logger have already disabled");
          },
        },
      });

      service.disable();
      service.console.log("Hello world");
    });

    it("Shouldn't called console.log when disable logger", function() {
      const service = rewire("../index");
      service.__set__({
        console: {
          log(str: string) {
            str.should.not.be.undefined;
          },
        },
      });

      service.enable("nd:*");
      service.console.log("Hello world");
    });
  });
});
