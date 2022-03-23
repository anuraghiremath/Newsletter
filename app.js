const express = require("express");
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/e5fed5d03e";
  const option = {
    method: "POST",
    auth: "PARALLAX:c713ad79f74700eeb7c482997ac40816-us14"
  }

  const request = https.request(url, option, function(response){

      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
      }   else {
            console.log("====== ERROR ======");
            //console.log(JSON.parse(err.response.error.text).detail); not required to use it as of now, but if u do, define the err first.
            res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/")
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
//mailchimp apikey
//c713ad79f74700eeb7c482997ac40816-us14

//list id
//e5fed5d03e
