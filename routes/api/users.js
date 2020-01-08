const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const nodemailer = require("nodemailer");

const User = require("../../models/user");
dotenv.config();
const secret = config.get("jwtSecret");
//transporter
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "jmahinyila@gmail.com", // generated ethereal user
    pass: "uiocfzcnzhouhrca" // generated ethereal password
  }
});

// @route    POST api/users
// @desc     User email confirmation
// @access   Public
router.get("/confirmation/:token", async (req, res) => {
  try {
    const user = jwt.verify(req.params.token, secret);
    // const {
    //   user: { id }
    // } = jwt.verify(req.params.token, secret);
    // await User.update({ confirmed: true }, { where: { id } });
      
    const confirmedUser = await User.findOneAndUpdate(
      user,
      {
            $set: { confirmed: true }
        }, { useFindAndModify: false }
    );
    res.send(confirmedUser);
  } catch (errors) {
    console.log(`Email Confrimation Error ${errors}`);
    res.send("Email confirmation Error");
  }
});
// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("firstname", "First Name is required")
      .not()
      .isEmpty(),
    check("secondname", "Second Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, secondname, confirmed, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        firstname,
        secondname,
        email,
        confirmed,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, secret, { expiresIn: 2592000 }, (err, token) => {
        transporter.sendMail(
          {
            to: user.email,
            subject: "Kodemunit.com Email Confimation",
            html: `Thank you for Registering with Kodemunit.com <br>
                        Please click this link to confirm your email address: <a href="http://kodemunit.herokuapp.com/api/users/confirmation/${token}">Link</a>`
          },
          error => {
            if (error) {
              console.log(error);
              res.end("error");
            } else {
              console.log("check your email");
              res.end("check your email");
            }
          }
        );
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
