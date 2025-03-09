const { multiply } = require("../utils/multiply");
const get_chai = require("../utils/getChai");

describe("testing multiply", () => {
  it("should give 7*6 is 42", async () => {
    const { expect } = await get_chai();
    expect(multiply(7, 6)).to.equal(42);
  });
  it("should give 3*8 is 24", async () => {
    const { expect } = await get_chai();
    expect(multiply(3, 8)).to.equal(24);
  });
});
