var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const passport = require("passport");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//@route POST/api/users/register
//@desc API to Register Users/Employees
router.post('/register', passport.authenticate('jwt', { session: false }), (req, res) => {

  if (req.user.role === "admin") {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          errors.email = 'Email already exists';
          return res.json({ statusCode: 400, success: false, message: 'Email already exists', data: null });

        }
        else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: "12345", //Default 12345 for every employee later we can allow his to reset
            role: req.body.role,
            reportingManager: req.body.reportingManager,
            company: req.body.company_id
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  const successUser = {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    id: user._id
                  }
                  res.json({ statusCode: 200, success: true, message: "Regisetred successfully", data: successUser })
                })
                .catch(err => console.log(err));
            })
          })
        }
      });


  }
  else {
    res.json({
      success: false,
      statusCode: 500,
      message: "You are not authorized user",
      data: null
    });
  }

});

//@route POST/api/users/login
//@desc Login Users/Returning JWT Token
//@access Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  //Find User by Email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // errors.email = 'User not found'
        return res.json({ statusCode: 400, success: false, message: "You have entered wrong email !", data: null });
      }
      //Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //User Matched
            const payload = { id: user.id, name: user.name, email: user.email, role: user.role }; //Create JWT Payload
            console.log(payload);

            //Sign Token
            jwt.sign(payload, keys.secretOrKeys, { expiresIn: 604800 }, (err, token) => {
              res.json({
                success: true,
                statusCode: 200,
                token: "Bearer " + token,
                message: "Login Successfull",
                data: payload
              });
            });

          } else {
            return res.json({ statusCode: 400, success: false, message: "You have entered wrong password !", data: null });
          }
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
});



router.get('/getAllEmployees', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role === "admin") {
    User.find().populate("company", ["companyName", "location", "_id"]).then(data => {
      res.json({
        success: true,
        statusCode: 200,
        message: "All Employees found",
        data: data
      });
    }).catch(err => {
      res.json({
        success: false,
        statusCode: 500,
        message: "No data foud",
        data: err
      });
    })


  }
  else {
    res.json({
      success: false,
      statusCode: 500,
      message: "You are not authorized user",
      data: null
    });
  }

})

router.put('/editEmployeeInfo', passport.authenticate('jwt', { session: false }), (req, res) => {
  const employeeId = req.body.employeeId;
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;
  const reportingManager = req.body.reportingManager;
  const company = req.body.company_id;

  if (req.user.role === "admin") {
    User.findByIdAndUpdate(
      employeeId,
      {
        $set: {
          name: name,
          email: email,
          role: role,
          reportingManager: reportingManager,
          company: company
        }
      },
      { new: true }
    ).then(updated => {
      res.json({
        success: true,
        statusCode: 200,
        message: "Employee information updated successfully",
        data: updated
      });
    }).catch(err => {
      res.json({
        success: false,
        statusCode: 500,
        message: "Error while updating",
        data: err
      });
    })
  }
  else {
    res.json({
      success: false,
      statusCode: 500,
      message: "You are not authorized user",
      data: null
    });
  }
})



router.get('/searchEmployees', passport.authenticate('jwt', { session: false }), (req, res) => {
  const inputText = req.query.inputText
  console.log(typeof (inputText))

  if (req.user.role === "admin") {
    User.find({
      $or: [
        { "name": { $regex: ".*" + inputText + ".*", '$options': 'i' } },
        { "mobile": { $regex: ".*" + inputText + ".*", '$options': 'i' } },
        { "_id": { $regex: ".*" + inputText + ".*", '$options': 'i' } },
        { "email": { $regex: ".*" + inputText + ".*", '$options': 'i' } }
      ]
    }).then(employees => {
      res.json({
        success: true,
        statusCode: 200,
        message: "Employees found",
        data: employees
      });
    })
      .catch(err => {
        res.json({
          success: false,
          statusCode: 500,
          message: "No data found",
          data: err
        });
      })
  }
  else {
    res.json({
      success: false,
      statusCode: 500,
      message: "You are not authorized user",
      data: null
    });
  }
})

module.exports = router;
