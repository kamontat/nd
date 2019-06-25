import * as chai from "chai";
import "mocha";
chai.should();

// const addContext = require("mochawesome/addContext");

import { Package } from "../Package";

const rootName = "Package";

describe(rootName, function() {
  it("should able to get package.json", function() {
    Package.name.should.not.be.empty;

    Package.version.should.not.be.empty;

    Package.dependencies.should.not.be.empty;
  });
});
