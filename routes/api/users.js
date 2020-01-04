const express = require('express');
const router = express.Router();

//@route GET app/users
//@desc Test
//access public

router.get('/', (req, res) => {
    res.send('user route')
})

module.exports = router;