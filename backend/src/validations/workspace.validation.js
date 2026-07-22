const validateCreateWorkspace = (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  if (typeof name !== "string") {
    return res.status(400).json({
      success: false,
      message: "Enter valid name",
    });
  }

  req.body.name = name.trim();

  if (req.body.name === "") {
    return res.status(400).json({
      success: false,
      message: "Name cannot be empty",
    });
  }

  if (req.body.name.length > 255) {
    return res.status(400).json({
      success: false,
      message: "Name cannot be this long",
    });
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Enter a valid description",
      });
    }

    req.body.description = description.trim();
  }

  next();
};

module.exports = {
  validateCreateWorkspace,
};
