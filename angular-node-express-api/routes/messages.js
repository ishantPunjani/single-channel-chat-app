const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var AYLIENTextAPI = require('aylien_textapi');

var indico = require('indico.io');
indico.apiKey = '8a7e84008b0d2a048e8525f5c9bc52d5';


const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    }
})

const Messages = mongoose.model('Messages', messageSchema);

router.post('/', async (req, res) => {
    message = new Messages({
        username: req.body.username,
        message: req.body.message
    })
    const savedMsg = await message.save();

    emotionObj = await indico.emotion(message.message)
    console.log(emotionObj);
    emoti = getMax(emotionObj)
    console.log(emoti);
    res.send({ emotion: emoti });
})
function getMax(obj) {
    var newarr = [];
    for (var i in obj) {
        newarr.push(obj[i])
    }
    max = Math.max(...newarr);
    for (var i in obj) {
        if (obj[i] == max) {
            Emotion = i
            break;
        }
    }
    return Emotion;
}


router.get('/', async (req, res) => {

    messagesList = await Messages.find();
    res.send(messagesList);
})
module.exports = router;
