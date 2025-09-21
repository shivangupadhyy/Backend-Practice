const express = require("express");
const app = express();
const { userModel } = require("./models/user");
const {postModel} = require('./models/post')
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const SECRET = 'ilove100xdevs'


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, name, age, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "You already registered" });
    }

    const hashedPasword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      name,
      age,
      email,
      password: hashedPasword,
    });

    let token = jwt.sign({
        userid: newUser._id,
    }, SECRET)

    res.cookie("token", token);
    res.status(201).json({ message: "User registered successfully!", id: newUser._id, email: newUser.email, token });

    console.log("✅ New user created:", newUser.email, { token: token });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.get('/login', (req, res)=>{
    res.render('/login')
})
app.listen(3000);
