const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} tidak ditemukan`
  });
};

module.exports = notFound;