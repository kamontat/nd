import assert from "assert";
import * as chai from "chai";
import "mocha";
import LoggerMock from "nd-logger/models/__test__/LoggerMock";

import { ERR_CLI, ERR_GNL, ERR_LOG, WRN_NLV } from "../constants";
import Exception from "../model";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Exception";

describe(rootName, function() {
  describe("Models", function() {
    it("should able to create new exception", function() {
      const exp = new Exception(ERR_GNL);
      exp.should.not.be.undefined;
    });

    it("should able to receive exception code", function() {
      const exp = new Exception(ERR_GNL);
      exp.name.should.be.equal("GNL");
    });

    it("should custom message via .description()", function() {
      const message = "hello world";
      const exp = new Exception(ERR_GNL);
      exp.description(message).message.should.be.equal(message);
    });

    it("should auto update error stack", function() {
      const exp = new Exception(ERR_GNL);
      if (exp.stack) exp.stack.should.be.a("string");
      else assert.fail("exception stack must exit");
    });

    it("should print to console", function() {
      const message = "hello world";
      const exp = new Exception(ERR_GNL);

      exp.description(message).print(
        new LoggerMock((event, args: any[]) => {
          if (event === "debug") {
            event.should.not.be.undefined;
            args.should.not.be.empty;
          }
        }),
      );
    });

    it("should print to consol in warning", function() {
      const message = "hello world";
      const exp = new Exception(WRN_NLV);

      exp.description(message).print(
        new LoggerMock((event, args: any[]) => {
          if (event === "debug") {
            event.should.not.be.undefined;
            args.should.not.be.empty;
          }
        }),
      );
    });
  });

  describe("Exception builder", function() {
    it("should create build new exception by static build", function() {
      const exp = Exception.build(ERR_GNL);

      exp.name.should.not.be.undefined;
      exp.message.should.be.equal(ERR_GNL.name);
    });

    it("should able to cast Error to new exception", function() {
      const errMessage = "custom error message";
      const err = new Error(errMessage);
      const exp = Exception.cast(err);

      exp.message.should.be.equal(errMessage);
      exp.name.should.be.equal(ERR_GNL.code); // default base exception
    });

    it("should able to cast own exception to exception", function() {
      const exp1 = Exception.build(ERR_LOG);
      const exp2 = Exception.cast(exp1);

      exp1.should.be.equal(exp2);
    });

    it("should able to cast Error to new exception (with custom code)", function() {
      const errMessage = "custom error message";
      const err = new Error(errMessage);
      const exp = Exception.cast(err, { base: ERR_CLI });

      exp.name.should.be.equal(ERR_CLI.code); // default base exception
    });
  });
});
