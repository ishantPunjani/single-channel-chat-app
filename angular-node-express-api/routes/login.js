const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fullName:{
        type:String,
        trim:true,
        required:true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 25
    },
    email: {
        type: String,
        required: true
    },
    loggedIn: {
        type: Boolean,
        default: false
    }
})

const Accounts = mongoose.model('Accounts', userSchema);

router.post('/', async (req, res) => {
    console.log('data posted');
    const userInstance = await Accounts.find({
        username: req.body.username,
        password: req.body.password
    });
    if (userInstance.length == 0) {
        res.status(404).send('invalid user credentials...');
        return;
    }
    else {
        userInstance[0].loggedIn = true;
        await userInstance[0].save();
        res.send(userInstance);
        // console.log('user logged..',userInstance);
    }

})

router.post('/logout', async (req, res) => {

    const userInstance = await Accounts.find({ username: req.body.username });
    if (userInstance) {
        userInstance[0].loggedIn = false;
        await userInstance[0].save();
    }
    else
        console.log('user not found');
    res.send('user is removed from active list');
    console.log('user left..', userInstance);
})

router.get('/active', async (req, res) => {

    console.log('active ');
    const userInstance = await Accounts.find({ loggedIn: true });
    if (userInstance) {
        res.send(userInstance);
    }
    else
        console.log(' no user is active');
})



router.post('/create', async (req, res) => {
    console.log('req for creation',req.body);
    const alreadyUser = await Accounts.find({ username: req.body.username });
    console.log('alresy user',alreadyUser);
    if(alreadyUser.length!=0){
        res.status(400);
        res.send({msg:'this username is taken!!'});
        return;
    }
    const account = new Accounts({
        username: req.body.username,
        fullName:req.body.fullName,
        password: req.body.password,
        email:req.body.Email
    })
    const userInstance = await account.save();
    res.send({msg:'user account is created'});
    console.log('user created..', userInstance);
})

module.exports = router;
