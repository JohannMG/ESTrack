/*add to routes to test user is authenticated
  if they are not, they will be redirected to the front page
  TODO: Add a flash message that says "You need to be logged in to use that URL"
*/


module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/app/login');
};