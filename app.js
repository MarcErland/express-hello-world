const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // Assuming your index.html is in the "public" directory

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const languageMap = {
  "sv-SE": "Swedish",
  "en-US": "English",
  // Add more language codes and their corresponding names as needed
};

app.use(cors({
  origin: "https://photivo.se/DEV/context/index.html" // Replace YOUR_CLIENT_PORT with the port number of your client application
}));

app.post("/translate", async (req, res) => {
  try {
    const { originalLanguage, desiredLanguage, word } = req.body;
    
    // Map language codes to language names
    originalLanguage = languageMap[originalLanguage] || originalLanguage;
    desiredLanguage = languageMap[desiredLanguage] || desiredLanguage;
    
    const prompt = `The word \n\n${word}\n\n is in ${originalLanguage}. Put it in a 4-8 word sentence for context, then translate that sentence into ${desiredLanguage}. Show the sentence in both languages, with ${originalLanguage} first. Separate them with a comma. `;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const translatedText = response.data.choices[0].text;
    console.log(translatedText);

    res.json({ translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});





//Continue HERE: https://platform.openai.com/examples/default-translate