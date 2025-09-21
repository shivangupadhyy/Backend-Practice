const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.connect("mongodb+srv://shivang14071993:4FfCt1jEXdf1M7OH@cluster0.rajcklb.mongodb.net/lolopolo");

const postSchema = new Schema({
    postData : String,
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    data : {
        type: Date,
        default : Date.now
    }
})

const postModel = mongoose.model("post", postSchema)

module.exports = {
    postModel
}