const axios = require("axios");

function sendRequest(id, name, time) {
  if (!!id && !!name){
    const URL = "http://dcpresence.fresauce.repl.co";
    let tm = null;
    tm = Math.floor(time / 60000);
    if (tm < 5){
      tm = tm;
    }
    else {
      tm = 0;
    }
    axios
    .post(URL + "/addtime", {
      "discordID": id,
      "username": name,
      "mins": tm,
    })
    .then(() => {
      console.log("Successful " + tm);
    })
    .catch((err) => {
      console.log("Failed :" + err);
    });
  }
  else{
    console.log("Empty id and name")
  }
}

module.exports = { sendRequest }
