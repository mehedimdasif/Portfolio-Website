const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
const collection = "about";

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'ab.html'));
});

app.get('/getAbout',(req,res) => {
    db.getDB().collection(collection).find({}).toArray((err,documents) => {
        if(err)
          console.log(err);
        else{
            console.log(documents);
            res.json(documents);
        }  
    });
});

app.put('/:id',(req,res) => {

    const aboutID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(aboutID)},{$set :{about : userInput.about}},{returnOrginal : false},(err,result) =>{
        if(err)
            console.log(err);
        else
            res.json(result);    
    });

});

app.post('/',(req,res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput,(err,result) =>{
        if(err)
           console.log(err);
        else
           res.json({result : result, document : result.ops[0]});   
    });
});

app.delete('/:id',(req,res)=>{

    const aboutID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(aboutID)},(err,result) => {
        if(err)
           console.log(err);
        else
           res.json(result);   
    });

});

db.connect((err) => {
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    else{
        app.listen(3000,() => {
            console.log('connected, app listening on port 3000');
        });
    }
})