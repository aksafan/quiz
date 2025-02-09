const internalServerError = (err, req, res, next) => {
  res.status(500).render("errors/5xx");
  console.log(err);
};

module.exports = internalServerError;
