const mongoose = require("mongoose");

const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://shivang14071993:4FfCt1jEXdf1M7OH@cluster0.rajcklb.mongodb.net/Mini-project')

const userSchema  = new Schema({
    username : String,
    name : String,
    age: Number,
    email: {type: String, unique: true},
    password: String,
    posts : [
        {type: mongoose.Schema.Types.ObjectId,
         ref: 'post'
        }
    ]
})

const userModel = mongoose.model("user", userSchema);

module.exports = {
    userModel
}