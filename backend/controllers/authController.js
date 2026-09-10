const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let users = [];

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = users.find(
    (user) => user.email === email
  );

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
  };

  users.push(user);

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = users.find(
    (user) => user.email === email
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};


const getProfile = (req, res) => {
  res.json({
    success: true,
    message: "Protected profile API",
    user: req.user,
  });
};


module.exports = {
  register,
   login,
   getProfile,
};