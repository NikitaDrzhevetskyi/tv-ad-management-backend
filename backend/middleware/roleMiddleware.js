const authorizeRoles = (...alowedRoles) => {
  return (req, res, next) => {
    if (!alowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = authorizeRoles;
