const { App } = require('@slack/bolt');
const { CronJob } = require('cron');
const axios = require('axios');
require('dotenv').config();

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.BOT_SIGNING_TOKEN,
});

async function sendMessage(channelId, message) {
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.BOT_TOKEN,
      channel: channelId,
      text: message,
    });

    if (!result.ok) {
      console.error(`Failed to send message: ${result.error}`);
    }
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}


async function getLeaveInfo() {
  try {
    const response = await axios.get(
      'https://api.bamboohr.com/api/gateway.php/branch/v1/time_off/whos_out',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.BAMBOOHR_API_KEY}:x`
          ).toString('base64')}`,
          Accept: 'application/json',
        },
      }
    );

    const leaveData = response.data;

    const usersOnLeave = leaveData
      .map((entry) => entry.name);

    const message =
      usersOnLeave.length > 0
        ? `Users on leave:\n${usersOnLeave.join('\n')}`
        : 'No users are currently on leave.';

        console.log(message)

    const channelId = process.env.CHANNEL_ID;
    sendMessage(channelId, message);
  } catch (error) {
    console.error('Error fetching BambooHR data:', error.message);
  }
}

// const job = new CronJob('* 00 10 * * *', () => {
//   getLeaveInfo();
// }, null, true, 'Asia/Kolkata');

// job.start();


getLeaveInfo();

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Slack bot is running!');
})();
