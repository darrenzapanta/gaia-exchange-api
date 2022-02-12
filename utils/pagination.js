function validatePagination(req, defaultPage = 0, defaultLimit = 50) {
  const limit = parseInt(
    req.query.limit && req.query.limit > 0 ? req.query.limit : defaultLimit
  );
  const page = parseInt(
    req.query.page && req.query.page > 0 ? req.query.page : defaultPage
  );

  const skip = limit * page;

  return {
    limit,
    page,
    skip,
  };
}

module.exports = validatePagination;
