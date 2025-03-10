import OpenAI from "openai";
import { StreamingTextResponse } from "openai";
import { OpenAIStream } from "openai";

//Create an OpenAI API client (thats edgge freindly)
const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY,
});

//set runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
   try {
   const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    //Ash openai for a streaming chat completion given the prompt
    const response = await openai.completions.create({
        model: "chatgpt-4o-latest",
        max_tokens: 400,
        stream: true,
      prompt,
    });

    //convert the response into a freindly text-stream
    const stream = OpenAIStream(response);
    //respond with the stream
    return new StreamingTextResponse(stream)
   } catch (error) {
    if(error instanceof OpenAI.APIError) {
        const {name, status, headers, message} = error
        return NextResponse.json({
            name, status, headers, message
        }, {status})
    } else {
        console.log("An unexpected error occured", error)
        throw error
    }
   }
}