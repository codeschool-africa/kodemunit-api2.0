const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
//@route GET app/users
//@desc Test
//access public

router.post(
  "/",
  [
    check("name", "Is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be greater than 6 characters").isLength({
      min: 6
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    res.send(req.body.name);
  }
);

module.exports = router;
