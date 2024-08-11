import { config } from "dotenv";
import { AzureOpenAI } from "openai";

config({ path: "../.env" });

const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const client = new AzureOpenAI({
  deployment,
  apiVersion,
  apiKey,
  endpoint,
});

const main = async () => {
  const events = await client.chat.completions.create({
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "あなたはプログラミングの先生で、ユーザーはあなたの生徒です。質問に対してユーモアを混ぜて回答してください。",
      },
      { role: "user", content: "JavaとJavaScriptの違いを教えてください。" },
    ],
    max_tokens: 128,
    model: "",
  });

  let msg = "";
  for await (const event of events) {
    for (const choice of event.choices) {
      const delta = choice.delta?.content;
      if (delta !== undefined) {
        msg += delta;
      }
    }
  }

  console.log(msg);
};

main();
