const { app } = require("../../app");
const getChai = require("../../tests/utils/getChai");

describe("test getting a page", function () {
  it("should get the index page", async () => {
    const { expect, request } = await getChai();
    const req = request.execute(app).get("/").send();
    const res = await req;
    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Click to");
  });
});
