#!/usr/bin/env node

import { OpenAI } from "langchain/llms/openai";
import { config } from 'dotenv';
import { ChatOpenAI } from "langchain/chat_models/openai";

config();

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY, 
  temperature: 0.9,
});

const chatModel = new ChatOpenAI();

const text = "What would be a good company name for a company that makes colorful socks?";
console.log(text);

const llmResult = await llm.predict(text);
console.log(llmResult);

const chatModelResult = await chatModel.predict(text);
console.log(chatModelResult);
