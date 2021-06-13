module.exports = (req, res, next) => {
  const user = req.user;
  if(user.role === "ADMIN"){
    next();
  }else {
    const error = new Error('No Privilege');
    error.statusCode = 404;
    throw error;
  }
};
