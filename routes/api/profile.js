const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/profile");
const User = require("../../models/user");
const {check,validationResult} = require('express-validator/check')


//@route     GET api/profile/me
//@desc      get user profile details
//access     private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["firstname", "avatar"]);

    if (!profile) {
      res.status(400).send({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      // check('skills', 'Skills is required')
      //   .not()
      //   .isEmpty(),
      // check('courses', 'Course is required')
      //   .not()
      //   .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      location,
      skills,
      courses,
      twitter,
      linkedin,
      githubusername
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    if (courses) {
      profileFields.courses = courses.split(',').map(course => course.trim());
    }

    // Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
   
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);



module.exports = router;
