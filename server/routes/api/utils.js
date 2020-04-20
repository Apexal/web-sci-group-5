module.exports.requireAuth = function (req, res, next) {
  if (req.isUnauthenticated()) return res.status(401).json({ error: 'Not authenticated.' });
  next();
}

module.exports.requireAdmin = function (req, res, next) {
  if (req.isUnauthenticated() || !req.user.admin) return res.status(403).json({ error: 'Not authorized.' });
  next();
}