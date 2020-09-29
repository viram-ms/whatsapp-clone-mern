// import express from 'express';
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const Pusher = require('pusher');
const mongoose = require('mongoose');
var {messageContent} = require('./dbmessages.js');
const port = process.env.PORT || 9000
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// mongoose.set('useCreateIndex', true);
app.set("json spaces", 2);
var cors = require('cors')
app.use(cors());
app.options('*', cors());


// app.use((req,res,next) => {
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// });


const connection_url = "mongodb://admin:28819093@cluster0-shard-00-00.qv7ns.mongodb.net:27017,cluster0-shard-00-01.qv7ns.mongodb.net:27017,cluster0-shard-00-02.qv7ns.mongodb.net:27017/database?ssl=true&replicaSet=atlas-gawint-shard-0&authSource=admin&retryWrites=true&w=majority"

const pusher = new Pusher({
    appId: '1081509',
    key: '62250ca021cbc289a844',
    secret: '45f0eedce901287936ad',
    cluster: 'eu',
    encrypted: true
  });

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection

db.once('open',() => {
    console.log('DB is connected')

    const msgConnection = db.collection("messagecontents");
    const changeStream = msgConnection.watch();

    changeStream.on('change',(change) => {
        console.log(change);
        if(change.operationType === 'insert'){
            const messageDetails =  change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                received: messageDetails.received,
                timestamp: messageDetails.timestamp
            }
        );
    } else {
        console.log('Error triggering pusher');
    }
    });
});

app.get('/',(req,res) => res.status(200).send('hello world'));

app.get('/message/sync', (req,res) => {
    messageContent.find((err,data) => {
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

app.post('/message/new',(req,res) => {
    const dbMessage = req.body;
    messageContent.create(dbMessage, (err,data) => {
        if(err){
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(data);
            res.status(201).send(`new message created: ${data}`);
        }
    })
})

app.listen(port,()=>console.log(`Listening on localhost:${port}`))


