module.exports = function (req, res, next) {
  const defaultLimit = 50;
  const defaultPage = 0;
  const limit = parseInt(
    req.query.limit && req.query.limit > 0 ? req.query.limit : defaultLimit
  );

  const page = parseInt(
    req.query.page && req.query.page > 0 ? req.query.page : defaultPage
  );

  req.query.limit = limit;
  req.query.page = page;
  req.query.skip = limit * page;

  next();
};
