const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../auth');
const jwt = require('jsonwebtoken'); 

const { errorHandler } = auth;

//[SECTION] User registration
module.exports.registerUser = (req, res) => {
	if (!req.body.username || !req.body.email || !req.body.password) {
	  return res.status(400).send({ error: 'All fields are required' });
	}
  
	if (!req.body.email.includes("@")) {
	  return res.status(400).send({ error: 'Email Invalid' });
	}
  
	if (req.body.password.length < 8) {
	  return res.status(400).send({ error: 'Password must be at least 8 characters long' });
	}
  
	User.findOne({ email: req.body.email }).then(existingUser => {
	  if (existingUser) {
		return res.status(409).send({ error: 'User already exists' });
	  }
  
	  const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	  });
  
	  newUser.save().then(user => {
		const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' }); // Use your actual secret
		res.status(201).send({ message: 'Registered successfully', access: token });
	  }).catch(error => {
		console.error('Save error:', error);
		res.status(500).send({ error: 'Server error' });
	  });
	}).catch(err => {
	  console.error('Find error:', err);
	  res.status(500).send({ error: 'Database error' });
	});
  };

module.exports.loginUser = (req, res) => {
    let { email, password } = req.body;

    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).send({error:'Invalid Email'});
    }

    User.findOne({ email })
    .then(user => {
        if (!user) {
            return res.status(404).send({error:'No Email Found'});
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({error: 'Email and password do not match'});
        }

        return res.status(200).send({ access: auth.createAccessToken(user) });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getUserDetails = (req, res) => {
	const userId = req.user.id;

	User.findById(userId)
		.select('_id username email') // optional: limit fields
		.then(user => {
			if (!user) {
				return res.status(404).send({ error: 'User not found' });
			}
			// ✅ send the user object directly
			return res.status(200).send(user);
		})
		.catch(error => errorHandler(error, req, res));
};




