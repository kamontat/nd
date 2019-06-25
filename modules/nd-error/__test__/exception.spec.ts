import * as chai from "chai";
import "mocha";
import LoggerMock from "nd-logger/models/__test__/LoggerMock";

import { GNL_Exception } from "../constants";
import Exception from "../model";
chai.should();

// const addContext = require("mochawesome/addContext");

const rootName = "Exception";

describe(rootName, function() {
  describe("Models", function() {
    it("should able to create new exception", function() {
      const exp = new Exception(GNL_Exception);
      exp.should.not.be.undefined;
    });

    it("should able to receive exception code", function() {
      const exp = new Exception(GNL_Exception);
      exp.name.should.be.equal("GNL");
    });

    it("should custom message via .description()", function() {
      const message = "hello world";
      const exp = new Exception(GNL_Exception);
      exp.description(message).message.should.be.equal(message);
    });

    it("should custom message via .description()", function() {
      const message = "hello world";
      const exp = new Exception(GNL_Exception);

      exp.description(message).message.should.be.equal(message);
    });

    it("should print to console", function() {
      const message = "hello world";
      const exp = new Exception(GNL_Exception);

      exp.description(message).print(
        new LoggerMock((event, args: any[]) => {
          event.should.not.be.undefined;
          args.should.not.be.empty;
        }),
      );
    });
  });
});
