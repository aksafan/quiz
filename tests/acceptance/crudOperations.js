const Question = require("../../models/Question");
const {
  factory,
  seedDb,
  testUserPassword,
} = require("../../db/seeds/seederTest");
const getChai = require("../../tests/utils/getChai");

before(async () => {
  const { expect, request } = await getChai();
  this.test_user = await seedDb();
  let req = request.execute(app).get("/auth/logon").send();
  let res = await req;
  const textNoLineEnd = res.text.replaceAll("\n", "");
  this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];
  let cookies = res.headers["set-cookie"];
  this.csrfCookie = cookies.find((element) => element.startsWith("csrfToken"));
  const dataToPost = {
    email: this.test_user.email,
    password: testUserPassword,
    _csrf: this.csrfToken,
  };
  req = request
    .execute(app)
    .post("/auth/logon")
    .set("Cookie", this.csrfCookie)
    .set("content-type", "application/x-www-form-urlencoded")
    .redirects(0)
    .send(dataToPost);
  res = await req;
  cookies = res.headers["set-cookie"];
  this.sessionCookie = cookies.find((element) =>
    element.startsWith("connect.sid"),
  );
  expect(this.csrfToken).to.not.be.undefined;
  expect(this.sessionCookie).to.not.be.undefined;
  expect(this.csrfCookie).to.not.be.undefined;

  const pageParts = res.text.split("<tr>");
  expect(pageParts).to.equal(21);

  factory.build("question");

  const jobs = await Question.find({ createdBy: this.test_user._id });
  expect(jobs.length).to.equal(21);
});
