const loggerMidleware = (req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  console.log(req.body);
  next();
};

export default loggerMidleware;
