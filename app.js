const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('youtube-dl-exec')
const fs = require('fs')

require('dotenv').config()

const token = process.env.TELEGRAM_TOKEN;
const BOT = new TelegramBot(token, {polling: true});

BOT.on("message", (msg)=>{
    let url = msg.text.match("^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$")[0];
    let chatId = msg.chat.id;

    BOT.sendMessage(chatId, 'Processing...');

    ytdl(url, {
        'extract-audio': true,
        //'get-filename': true,
        'audio-format': 'mp3',
        'o': `.temp\\%(title)s-${chatId}.%(ext)s`
    })
    .then((output)=>{

       ytdl(url, {
           'get-filename':true,
           'o':  `.temp\\%(title)s-${chatId}.%(ext)s`
       }).then(output=>{
        let filename = output
        
        filename = filename.substring(0, filename.length-4)+".mp3"

        let audio = fs.createReadStream(filename);

        BOT.sendAudio(chatId, audio, options={
            'caption' : 'Done.'
        })

        fs.unlinkSync(filename)
       })


    }).catch(err =>{
        BOT.sendMessage(chatId, "Something went wrong, try again later.");
        console.log(err);
    });


})