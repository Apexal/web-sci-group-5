module.exports.requireAuth = function (req, res, next) {
  if (req.isUnauthenticated()) return res.status(401).json({ error: 'Not authenticated.' });
  next();
}