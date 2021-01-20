const { App } = require("@slack/bolt");

const askBilly = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const fireUp = () => {
  askBilly.start(process.env.PORT || 3000);
}

(async () => {
  await fireUp();
  console.log("Ask Billy is up and running");
})();

const postQuestion = (say, payload) => {
  const milliseconds = (Math.random() * (3 - 1) + 1) * 1000;
  //     force them to phrase it as a question?

  say(`:raised_hand: I have a question:`);
  //     delay so that the typing indicator doesn't give people away
  setTimeout(() => {
    say(`${payload.text} :thinking_face:`);
  }, milliseconds);
};

askBilly.command("/anon-billy", async ({ ack, payload, say }) => {
  await ack();
  try {
    postQuestion(say, payload);
    console.log(payload);
  } catch (error) {
    console.log(error);
  }
});

askBilly.command("/ask-billy", async ({ ack, payload, say }) => {
  await ack();
  try {
    postQuestion(say, payload);
    console.log(payload);
  } catch (error) {
    console.log(error);
  }
});

//  fun with blocks and polling

async function callCommand(ack, payload, say) {
  // acknowledge command
  await fireUp();
  await ack();
  try {
    postQuestion(say, payload);
    console.log(payload);
  } catch (error) {
    console.log(error);
  }
}

askBilly.command("/poll-", async ({ ack, payload, context }) => {
  await askBilly.start(process.env.PORT || 3000);
  await ack();
  try {
    const result = await askBilly.client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      type: "modal",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Where should we order lunch from?* Poll by ${payload.user}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              ":sushi: *Ace Wasabi Rock-n-Roll Sushi Bar*\nThe best landlocked sushi restaurant."
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Vote"
            },
            value: "click_me_123"
          }
        },
        {
          type: "divider"
        }
      ],
      text: `${payload.text}:`
    });
    console.log("result");
  } catch (error) {
    console.log(error);
  }
});

