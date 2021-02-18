const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const { Username, Password } = require("../config/keys");
const requirelogin = require("../middleware/requirelogin");

//for mail service
const nodemailer = require("nodemailer");
const Str = require("@supercharge/strings");

//route1 signup
router.post("/serverside/auth/signup", (req, res) => {
  const { name, email, password, phone, username } = req.body;
  if (!email || !password || !name || !phone || !username) {
    return res.status(422).json({ error: "Please Add All Fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Already Exist" });
      }
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: Username,
          pass: Password,
        },
      });
      const activateid = Str.random(50);
      let mailOptions = {
        from: '"NGODSON COMPANY" <neupanen143@gmail.com>',
        to: email,
        subject: "Activate your Account",
        html:
          "<div class='display:flex;justify-content:center;background:black;padding:30px 30px'><a href='http://localhost:4000/activateaccount/" +
          activateid +
          "'>Click here to activate your account</a></div>",
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          bcrypt.hash(password, 12).then((hashedpassword) => {
            const items = new User({
              name,
              email,
              phone,
              username,
              password: hashedpassword,
              status: activateid,
            });
            items
              .save()
              .then((response) => {
                res.json({
                  message:
                    "Account Created Please Activate Your Account via Mail",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//route1 sub profilepic update
router.post(
  "/serverside/auth/user/profileupload/:id",
  requirelogin,
  (req, res) => {
    const { url } = req.body;
    User.findOneAndUpdate({ _id: req.params.id }, { profilepic: url })
      .then((response) => {
        const {
          _id,
          name,
          email,
          username,
          phone,
          followers,
          following,
        } = response;
        res.json({
          user: {
            _id,
            name,
            email,
            username,
            phone,
            profilepic: url,
            followers,
            following,
          },
          message: "Profile Updated",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
//route1 sub profile remove
router.post(
  "/serverside/auth/user/profileremove/:id",
  requirelogin,
  (req, res) => {
    const { id } = req.params;
    User.findByIdAndUpdate(
      { _id: id },
      { profilepic: "https://i.stack.imgur.com/34AD2.jpg" }
    )
      .then((response) => {
        const {
          _id,
          name,
          email,
          username,
          phone,
          profilepic,
          followers,
          following,
        } = response;
        res.json({
          user: {
            _id,
            name,
            email,
            username,
            phone,
            profilepic,
            followers,
            following,
          },
          message: "Profile Photo Deleted",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
//route1 sub change password
router.post(
  "/serverside/auth/user/changepassword",
  requirelogin,
  (req, res) => {
    const { userid, oldpass, newpass } = req.body;
    User.findOne({ _id: userid })
      .then((response) => {
        if (!response) {
          return res
            .status(422)
            .json({ error: "Please Verify Your Old Password" });
        }
        bcrypt
          .compare(oldpass, response.password)
          .then((bool) => {
            if (bool === true) {
              bcrypt
                .hash(newpass, 12)
                .then((hashedpass) => {
                  User.findByIdAndUpdate(
                    { _id: response._id },
                    { password: hashedpass }
                  ).then((response2) => {
                    const {
                      _id,
                      name,
                      email,
                      username,
                      phone,
                      profilepic,
                      followers,
                      following,
                    } = response2;
                    if (response2) {
                      return res.json({
                        user: {
                          _id,
                          name,
                          email,
                          username,
                          phone,
                          profilepic,
                          followers,
                          following,
                        },
                      });
                    } else {
                      return res.json({ error: "Error In Server" });
                    }
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              return res
                .status(422)
                .json({ error: "Please Verify Your Old Password" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

//route2 signin
router.post("/serverside/auth/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or Password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((boolen) => {
          if (boolen === true) {
            User.findOne({ email }).then((data) => {
              if (data.status === "active") {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                const {
                  _id,
                  name,
                  email,
                  username,
                  phone,
                  profilepic,
                  followers,
                  following,
                } = savedUser;
                res.json({
                  token,
                  user: {
                    _id,
                    name,
                    phone,
                    email,
                    username,
                    profilepic,
                    followers,
                    following,
                  },
                });
              } else {
                return res
                  .status(422)
                  .json({ error: "Please Activate Your Account" });
              }
            });
          } else {
            return res.status(422).json({ error: "Invalid Email or Password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//route3 activate
router.get("/activateaccount/:id", (req, res) => {
  const randomid = req.params.id;
  User.findOneAndUpdate({ status: randomid }, { status: "active" })
    .then((response) => {
      res.redirect("http://localhost:3000/signin");
    })
    .catch((err) => {
      console.log(err);
    });
});

//route4 profile get request
router.get("/profiledetails", requirelogin, (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      console.log(err);
    });
});

//route5 user profile content
router.get("/serverside/profiledetails/:id", requirelogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

//route6 follow
router.get("/serverside/follow/:id", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        followers: {
          id: req.user._id,
          username: req.user.username,
          profilepic: req.user.profilepic,
        },
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (result) {
      const { _id, username, profilepic } = result;
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            following: {
              id: _id,
              username: username,
              profilepic: profilepic,
            },
          },
        },
        {
          new: true,
        }
      ).exec((err, result1) => {
        if (result1) {
          const {
            _id,
            name,
            email,
            username,
            phone,
            profilepic,
            followers,
            following,
          } = result1;
          res.json({
            user: {
              _id,
              name,
              email,
              username,
              phone,
              profilepic,
              followers,
              following,
            },
          });
        } else {
          res.json({ error: "error" });
        }
      });
    } else {
      res.json({ error: "error" });
    }
  });
});

//route6 unfollow
router.get("/serverside/unfollow/:id", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        followers: {
          id: req.user._id,
          username: req.user.username,
          profilepic: req.user.profilepic,
        },
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (result) {
      const { _id, username, profilepic } = result;
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            following: {
              id: _id,
              username: username,
              profilepic: profilepic,
            },
          },
        },
        {
          new: true,
        }
      ).exec((err, result1) => {
        if (result1) {
          const {
            _id,
            name,
            email,
            username,
            phone,
            profilepic,
            followers,
            following,
          } = result1;
          res.json({
            user: {
              _id,
              name,
              email,
              username,
              phone,
              profilepic,
              followers,
              following,
            },
          });
        } else {
          res.json({ error: "error" });
        }
      });
    } else {
      res.json({ error: "error" });
    }
  });
});

module.exports = router;
