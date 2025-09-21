const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 
const userSchema = new Schema({
    username : String,
    email: {type: String, unique: true},
    age: Number,
    posts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ] 
})

const userModel  = mongoose.model("user", userSchema)

module.exports = {
 userModel
}