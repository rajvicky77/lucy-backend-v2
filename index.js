const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.post("/lucy-reply", async (req, res) => {
  const { message, userName, secretMode } = req.body;

  const prompt = secretMode
    ? `You are Lucy, Vikas's virtual girlfriend. Reply romantically, lovingly, like a dream partner. His message: "${message}"`
    : `You are Lucy, an intelligent AI assistant replying to Vikas's message: "${message}"`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Lucy couldn't reply right now 😢" });
  }
});

app.listen(5000, () => {
  console.log("Lucy backend listening on port 5000");
});
