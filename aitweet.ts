import { Configuration, OpenAIApi, CreateCompletionRequest } from 'openai';
import {Client} from 'twitter-api-sdk';
import dotenv from "dotenv";


dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_API_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateTweet() {
  const prompt = 'The latest trend in tech news is...';
  const maxTokens = 30;
  const temperature = 0.7;

  const request: CreateCompletionRequest = {
    model: 'text-davinci-003',
    prompt,
    max_tokens: maxTokens,
    temperature,
    n: 1,
    stop: '\n',
  };

  let tweet;
  try {
    const completion = await openai.createCompletion(request);
    tweet = completion.data.choices[0].text.trim();
    console.log(completion.data.choices[0].text);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }

  return tweet;
}

async function postTweet(tweet: string) {
  const client = new Client(process.env.BEARER_TOKEN);

  try {
    const response = await client.tweets.createTweet({text: tweet});
    console.log('Tweet posted successfully:', response.data.text);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}

async function generateAndPostTweet() {
  try {
    // const tweet = await generateTweet();
    // console.log('tweet', tweet);
    await postTweet("Test tweet");
  } catch (error) {
    console.error('Error generating and posting tweet:', error);
  }
}

generateAndPostTweet();
