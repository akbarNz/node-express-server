const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbUri = process.env.MONGOLAB_URI;


module.exports =  {
    add: (req, res) => {
        mongoose.connect(dbUri, { useNewUrlParser : true }, (err) => {
            let result = {};
            let status = 201;
            if(!err) {
                
                const { name, password } = req.body;
                const user = new User({ name, password });
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(user.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        user.password = hash;
                        /* console.log(hash); */
                        user.save((err) => {
                            if(!err) {
                                result.result = user;
                            } else {
                                status = 500;
                                console.log("someting went wrong")
                            }
                            res.send(result);
                            res.status(status)
                        })
                    });
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        })
    },
    getUser: (req, res) => {
      mongoose.connect(dbUri, {useNewUrlParser: true}, (err) => {
        let result = {};
        let status = 200;
        if(!err) {
          const payload = req.decoded;
          /* console.log(payload) */
          if (payload && payload.user) {
            /* console.log(payload.user); */
            User.findOne({_id: req.params.id}, (err, user) => {
              if (!err) {
                result.status = status;
                result.result = user;
                result.error = err;
              } else {
                status = 500;
                result.status = status;
                result.error = err;
              }
              res.status(status).send(result);
            })
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
          }
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      })
    },
    getUsers: (req, res) => {
      mongoose.connect(dbUri, {useNewUrlParser: true}, (err) => {
        let result = {};
        let status = 200;
        if(!err) {
          const payload = req.decoded;
          /* console.log(payload) */
          if (payload && payload.user === "admin") {
            /* console.log(payload.user); */
            User.findOne({_id: req.params.id}, (err) => {
            if (!err) {
              User.find({}, (err, users) => {
                if (!err) {
                  result.status = status;
                  result.result = users;
                  result.error = err;
                } else {
                  status = 500;
                  result.status = status;
                  result.error = err;
                }
                res.status(status).send(result);
              })
            } else {
              status = 401;
              result.status = status;
              result.error = `Authentication error`;
              res.status(status).send(result);  
            } 
            })
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
          }
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      })
    },

    login: (req, res) => {
        const { name, password } = req.body;
    
        mongoose.connect(dbUri, { useNewUrlParser: true }, (err) => {
          let result = {};
          let status = 200;
          if(!err) {
            User.findOne({name}, (err, user) => {
              if (!err && user) {
                // We could compare passwords in our model instead of below
                bcrypt.compare(password, user.password).then(match => {
                  if (match) {
                   // Create a token
                    const token = jwt.sign({ user: user.name }, process.env.JWT_SECRET, { expiresIn: '2d'});
    
                     //console.log('TOKEN', token);
                    result.token = token;
                    result.status = status;
                    result.result = user;
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                  }
                  res.status(status).send(result);
                }).catch(err => {
                  status = 500;
                  result.status = status;
                  result.error = err;
                  res.status(status).send(result);
                });
              } else {
                status = 404;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
              }
            });
          } else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        });
    },
/*     updatePassword: (req, res) => {
      mongoose.connect(dbUri, {useNewUrlParser:true}, (err) => {
        let result = {};
        let status = 200;
        const {name, password} = req.body;
        const userToBeModify = {name, password};
        const saltRounds = 10;
        User.findOne({name}, (err, user) => {
          if(!err && user) {
            const id = user._id;
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(userToBeModify.password, salt, function(err, hash) {
                userToBeModify.password = hash;
                User.findByIdAndUpdate({_id: id}, {password: hash}, (err, user) => {
                  if (!err) {
                    result.status = status;
                    result.result = user;
                  } else {
                    console.log("can't find user")  
                  }
                  res.status(status).send(result);
                })
              })
            })
          } else {
            console.log("erreur user pas trouvé");
          }
        })
      })
    }, */
    updateUser: (req, res) => {
      mongoose.connect(dbUri, {useNewUrlParser:true}, (err) => {
        let result = {};
        let status = 200;
        const {name, password} = req.body;
        const userToBeModify = {name, password};
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(userToBeModify.password, salt, (err, hash) => {
            userToBeModify.password = hash;

            User.findOneAndUpdate({name}, {password: hash}, (err, user) => {
              if (!err) {
                result.result = user;
                result.status = status;
              } else {
                console.log("can't find user") 
              }
              res.status(status).send(result);
            })
          })
        })
      })
    },
    deleteUser: (req, res) => {
      mongoose.connect(dbUri, {useNewUrlParser: true}, (err) => {
        let result = {};
        let status = 200;
        const {name, password} = req.body;
        User.findOneAndDelete({name}, (err) => {
          if (!err) {
            
          } else {
            console.log("probleme ne peut pas delete")
          }
          res.status(status).send({message: "user deleted"})
        })
      })
    }
}
