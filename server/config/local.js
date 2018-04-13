module.exports = {
  user: (req, res, next) => {
    res.locals.user = req.user ? req.user.get({ plain: true }) : null;
    next();
  },
  setTitle: title => (req, res, next) => {
    res.locals.title = title;
    next();
  },
  setCurrentPage: currentPage => (req,res,next) => {
    res.locals.currentPage = currentPage;
    next();
  }
};
