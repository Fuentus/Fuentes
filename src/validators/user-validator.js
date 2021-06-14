const adminRoutes = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(401).json({ message: "Not enough Privileges." });
  }
};

module.exports = {
  adminRoutes: adminRoutes,
};
