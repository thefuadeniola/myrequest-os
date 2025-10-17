export const login = (req, res) => {
  // Save the page the user was on, or default to home
  const returnTo = req.query.returnTo || '/';
  req.session.returnTo = returnTo;
  res.oidc.login({ returnTo });
}