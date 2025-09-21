const express = require('express');
const app = express();
const { userModel } = require('./model/user');
const { postModel } = require('./model/post')

app.get('/', (req, res)=>{
    res.send('Hello World!');
})

app.get('/create', async(req, res)=>{
    let user = await userModel.create({
        username : "Shivang",
        age : 25,
        email : "Shivang14071993@gamil.com"
    })

    res.send(user)
})
app.get('/post/create', async(req, res)=>{
    let post = await postModel.create({
        postData: "First post testing",
        user: "68cf9409ad3793edf3204f10",
    })

    let user = await userModel.findOne({_id: "68cf9409ad3793edf3204f10"});
    user.posts.push(post._id);
    await user.save();


    res.send({post, user})
})

app.listen(3000)