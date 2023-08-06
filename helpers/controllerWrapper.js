const controllerWrapper = controller => {
  const functionWrap = async (res, req, next) => {
    try {
      await controller(res, req, next);
    } catch (error) {
      next(error);
    }
  };

  return functionWrap;
};

module.exports = controllerWrapper;
