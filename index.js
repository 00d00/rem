const express = require("express");
const bodyParser = require("body-parser");
const { PayPay, PayPayLoginStatus } = require("paypay.js");

const app = express();
const port = 3000; // 任意のポート

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // 静的ファイルのディレクトリを指定

const paypay = new PayPay();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

let loginResult

app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    loginResult = await paypay.login(phoneNumber, password);

    if (loginResult.status === PayPayLoginStatus.DONE) {
      res.json({
        status: "success",
        message: "Logged in!",
        accessToken: loginResult.accessToken,
      });
    } else if (loginResult.status === PayPayLoginStatus.OTP_REQUIRED) {
      res.redirect("/"); // OTP入力用のページにリダイレクト
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.post("/login/otp", async (req, res) => {
  try {
    const otpResult = await paypay.loginOtp(loginResult.otpReferenceId, req.body.otpCode);

    res.json({
      status: "success",
      message: "Logged in with OTP!",
      token: otpResult.accessToken
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
