const notFound = (req, res) => {
  res.status(404).render("errors/404", { url: req.originalUrl });
};

module.exports = notFound;
