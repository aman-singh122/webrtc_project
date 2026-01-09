require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials missing in environment variables");
}

const client = twilio(accountSid, authToken);

async function getTurnCredentials() {
  const token = await client.tokens.create({ ttl: 3600 });
  return token.iceServers;
}

module.exports = getTurnCredentials;
