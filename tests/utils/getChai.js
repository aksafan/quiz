let chaiObject = null;

const getChai = async () => {
  if (!chaiObject) {
    const { expect, use } = await import("chai");
    const chaiHttp = await import("chai-http");
    const chai = use(chaiHttp.default);
    chaiObject = { expect: expect, request: chai.request };
  }

  return chaiObject;
};

module.exports = getChai;
