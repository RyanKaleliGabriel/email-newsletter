require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const { dirname } = require('path');




const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstName = req.body.Fname;
    const lastName  = req.body.Lname;
    const email = req.body.Email;
    
    const data = {
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data)

    const url = "https://us17.api.mailchimp.com/3.0/lists/"+process.env.LISTID;

    const options = {
        method:"POST",
        auth: "ryang:"+process.env.APIKEY
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })
    // request.write(jsonData);
    request.end()

})

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000")
});