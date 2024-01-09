const { App } = require('@slack/bolt');
const { CronJob } = require('cron');
require('dotenv').config();


const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.BOT_SIGNING_TOKEN,
});

async function sendMessage(channelId, message) {
  try {
    await app.client.chat.postMessage({
      token: process.env.BOT_TOKEN,
      channel: channelId,
      text: message,
    });
  } catch (error) {
    console.error(error);
  }
}

const job = new CronJob('00 51 12 * * *', () => {
    channelId = process.env.CHANNEL_ID
    const message = 'Checking to see if I can run every day at 12:51 PM IST';
    sendMessage(channelId, message);
}, null, true, 'Asia/Kolkata');

job.start();

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Slack bot is running!');
})();
