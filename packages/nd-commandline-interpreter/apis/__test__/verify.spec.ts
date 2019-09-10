import * as chai from "chai";
import "mocha";
chai.should();

import Verify from "../Verify";
// const addContext = require("mochawesome/addContext");

const rootName = "Commandline interpreter";

describe(rootName, function() {
  describe("APIs", function() {
    it("should verify is exist method", function() {
      Verify.IsExist(undefined).should.be.false;
      Verify.IsExist("undefined").should.be.false;

      Verify.IsExist("NULL").should.be.false;
      Verify.IsExist(null).should.be.false;
      Verify.IsExist("null").should.be.false;
      Verify.IsExist({}).should.be.false;

      Verify.IsExist("valid").should.be.true;
      Verify.IsExist(true).should.be.true;
      Verify.IsExist(102).should.be.true;
      Verify.IsExist({ value: "string" }).should.be.true;
    });

    it("should verify string", function() {
      Verify.IsString("12").should.be.true;
      Verify.IsString("true").should.be.true;
      Verify.IsString(new String("Hello world")).should.be.true;
      Verify.IsString("{value: true}").should.be.true;

      Verify.IsString(true).should.be.false;
      Verify.IsString({}).should.be.false;
      Verify.IsString({ value: "string" }).should.be.false;
      Verify.IsString(1234).should.be.false;
      Verify.IsString(1234.5678).should.be.false;
    });

    it("should verify number string", function() {
      Verify.IsNumber("12").should.be.true;
      Verify.IsNumber("1").should.be.true;
      Verify.IsNumber("0").should.be.true;
      Verify.IsNumber("94").should.be.true;
    });

    it("should verify number to be number", function() {
      Verify.IsNumber(44).should.be.true;
      Verify.IsNumber(2929292).should.be.true;
      Verify.IsNumber(1).should.be.true;
    });

    it("should verify decimal number", function() {
      Verify.IsDecimal(123.111).should.be.true;
      Verify.IsDecimal(44.412).should.be.true;

      Verify.IsDecimal(44).should.be.false;
      Verify.IsDecimal("44").should.be.false;
      Verify.IsDecimal(true).should.be.false;

      Verify.IsDecimal(true).should.be.false;
    });

    it("should verify invalid object as decimal number", function() {
      Verify.IsDecimal({}).should.be.false;
      Verify.IsDecimal(undefined).should.be.false;
      Verify.IsDecimal(null).should.be.false;
    });

    it("should verify decimal string", function() {
      Verify.IsDecimal("44.123").should.be.true;
      Verify.IsDecimal("1444.000").should.be.true;
    });

    it("should verify object is not a number", function() {
      Verify.IsNumber({}).should.be.false;

      Verify.IsNumber("one").should.be.false;
      Verify.IsNumber("abc").should.be.false;

      Verify.IsNumber(true).should.be.false;
      Verify.IsNumber(false).should.be.false;
    });

    it("should verify boolean string", function() {
      Verify.IsBoolean("true").should.be.true;
      Verify.IsBoolean("false").should.be.true;
    });

    it("should verify boolean type as boolean", function() {
      Verify.IsBoolean(true).should.be.true;
      Verify.IsBoolean(false).should.be.true;
    });

    it("should verify object is not a boolean", function() {
      Verify.IsBoolean({}).should.be.false;
      Verify.IsBoolean({ bool: true }).should.be.false;

      Verify.IsBoolean("abc").should.be.false;

      Verify.IsBoolean("2").should.be.false;
      Verify.IsBoolean("1").should.be.false;
      Verify.IsBoolean("0").should.be.false;
    });

    it("should verify novel id", function() {
      Verify.IsId("4930332").should.be.true;
      Verify.IsId("123312").should.be.true;
      Verify.IsId("493440332").should.be.true;
      Verify.IsId("2").should.be.true;
      Verify.IsId("512344").should.be.true;
      Verify.IsId("77888654").should.be.true;
    });

    it("should verify invalid novel id", function() {
      Verify.IsId("true").should.be.false;
      Verify.IsId("https://google.com").should.be.false;
      Verify.IsId("unknown").should.be.false;
      Verify.IsId("2asdf123").should.be.false;
      Verify.IsId("512344a").should.be.false;
      Verify.IsId("asdf0000").should.be.false;
    });

    it("should verify url string", function() {
      Verify.IsUrl("https://asdf.com").should.be.true;
      Verify.IsUrl("https://dek-d.com").should.be.true;
      Verify.IsUrl("http://asdf.com").should.be.true;
      Verify.IsUrl("http://dek-d.com").should.be.true;

      Verify.IsUrl("/Users/guest/abc.log").should.be.false;
      Verify.IsUrl("file://Users/guest/abc.log").should.be.false;
      Verify.IsUrl("aws://path/to/file.txt").should.be.false;
      Verify.IsUrl("somestring").should.be.false;

      Verify.IsUrl(true).should.be.false;
      Verify.IsUrl(1022).should.be.false;
      Verify.IsUrl({}).should.be.false;
      Verify.IsUrl(undefined).should.be.false;
      Verify.IsUrl(null).should.be.false;
      Verify.IsUrl({ url: "https://google.com" }).should.be.false;
    });
  });
});
