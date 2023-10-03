#!/usr/bin/env bun

import {OpenAI} from "langchain/llms/openai";
import {config} from 'dotenv';
import {HumanMessage} from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";

config();

const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
});

const chatting = async () => {
    const chatModel = new ChatOpenAI();

    const query = "What would be a good company name for a company that makes colorful socks?";
    console.log("Query", query);

    const messages = [new HumanMessage({content: query})];

    const llmResult = await llm.predictMessages(messages);
    console.log("LLM result", llmResult.content);

    const chatModelResult = await chatModel.predictMessages(messages);
    console.log("Chat Model result", chatModelResult.content);
}

const chattingWithFile = async () => {
    const loader = new TextLoader(
        "data/story-about-spike.txt"
    );
    const data = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 0,
    });

    const splitDocs = await textSplitter.splitDocuments(data);

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const response = await chain.call({
        query: "Who is the author of this story and what is the title?"
    });
    console.log(response);

    const nextResponse = await chain.call({
        query: "Can you summarize this story in a few sentences?"
    });
    console.log(nextResponse);

    const lastResponse = await chain.call({
        query: "Now tell me what would the typical audience of this story be?"
    });
    console.log(lastResponse);
}

await chattingWithFile();