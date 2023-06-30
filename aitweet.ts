import { Configuration, OpenAIApi, CreateCompletionRequest } from 'openai';
import 'dotenv/config'

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

  let tweet
  try {
    const completion = await openai.createCompletion(request);
    const response = await openai.createCompletion(request);
    tweet = response.data.choices[0].text.trim();
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
  // Replace this with your own Twitter API code to post the tweet
  // For example, you can use the 'twitter' package or any other Twitter API client library
  // Consult the documentation for the specific library you choose to use

  // Example using 'twitter' package:
  const Twitter = require('twitter');

  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  client.post('statuses/update', { status: tweet }, function (error: any, tweet: any, response: any) {
    if (error) {
      console.error('Error posting tweet:', error);
    } else {
      console.log('Tweet posted successfully:', tweet.text);
    }
  });
}

async function generateAndPostTweet() {
  try {
    const tweet = await generateTweet();
    console.log('tweet', tweet)
    await postTweet(tweet);
  } catch (error) {
    console.error('Error generating and posting tweet:', error);
  }
}

generateAndPostTweet();
