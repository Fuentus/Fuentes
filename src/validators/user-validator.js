const adminRoutes = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  adminRoutes: adminRoutes,
};
