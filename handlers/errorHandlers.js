exports.catchErrors = (fn) => {
  return function (req, res, next) {
    const resp = fn(req, res, next);
    if (resp instanceof Promise) {
      return resp.catch(next);
    }
    return resp;
  };
};

exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Api url doesn't exist ",
  });
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    ),
  };

  res.status(500).json({
    success: false,
    message: "Oops ! Error in Server",
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Oops ! Error in Server",
  });
};
