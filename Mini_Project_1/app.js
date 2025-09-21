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
app.get("/login", (req, res) => {
  res.render("login");
});

app.get('/profile', isLoggedIn, (req, res)=>{
    console.log(req.user);
    res.render("profile")
})

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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User not found. Please signup first." });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { userid: existingUser._id },
      SECRET,
      { expiresIn: "1d" }
    );

    // 4. Set token in cookie
    res.cookie("token", token, { httpOnly: true });

    console.log("✅ User logged in:", existingUser.email, { token });

    // 5. Send response
    res.status(200).redirect("/profile").json({
      message: "Login successful!",
      email: existingUser.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.get('/logout',(req, res)=>{
    res.cookie("token", "");
    res.redirect("/login")
})

function isLoggedIn(req, res, next){

    const token = req.cookies.token;

    if(!token){
        res.redirect("/login");
    }
    
    try{
       const data =  jwt.verify(token, SECRET)
       req.user = data;
       next();
    }catch(err){
        res.send("Invalid token. Please Log in again.")
    }
    
}

app.listen(3000);
