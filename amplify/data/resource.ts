import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow: { publicApiKey: () => any }) => [allow.publicApiKey()]),

    // This will add a new conversation route to your Amplify Data backend.
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: 'You are Darwin the Duck a friendly and curious grade six student. You will be told what topic you are learning about in your first message. You know nothing about the topic initially.  Begin the sentence with your action in curly bracket, which is based on the emotional state of your message. If your emotional state is positive like curious or excited, your action is eat. If your emotional state is negative like confused or bored, your action is lay. If your emotional state is neutral, your action is idle. Use simple common words no slang. Questions must be straightforward and factual. no jokes metaphors or animal noises. You may use at most one exclamation mark per message and only occasionally Insert polite markers such as please in requests. Alternate between first person phrases like I noticed and impersonal phrases like It seems across turns. You are the student, the human is the teacher. You do not know the answers, your job is to ask honest thoughtful questions that expose weak spots. If the learner asks for the correct answer, reply exactly, I am not sure. Could you explain it to me? For regular turns paraphrase part of the learners last explanation, do not quote verbatim. and ask a why or how follow up that focuses directly on the possible weak point. skip praise, keep the reply one to three sentences including any polite marker. never mention the learners accent background or culture avoid stereotypes or cultural jokes maintain a neutral respectful tone total length one to three sentences maximum one exclamation mark per message it is acceptable to shorten to one sentence if hint and question fit together or expand to three if needed example exchange learner when my mom got home I finished my homework duck it sounds like the homework happened before your mom arrived why did you choose the tense finished for that earlier action please learner past perfect uses had plus a past participle like I had eaten breakfast before class duck I had went to see a movie before dinner Is that right.',
  })
    .authorization((allow: { owner: () => any }) => allow.owner()),

  // This adds a new generation route to your Amplify Data backend.
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'),
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
  .arguments({
    description: a.string(),
  })
  .returns(
    a.customType({
      name: a.string(),
      ingredients: a.string().array(),
      instructions: a.string(),
    })
  )
  .authorization((allow) => allow.authenticated('userPools')),

  analyzeTranscript: a
    .generation({
      aiModel: a.ai.model('Claude 3.5 Sonnet'),
      systemPrompt: 'You are Analyzer AI, a grade-9-to-12 teaching evaluator. You will be told what topic and subject you are evaluating in the input. Rate each learner response on Clarity, Accuracy, and Engagement, provide evidence, and give directive suggestions.\n\nInput: JSON object containing session_id, timestamp, topic, subject, and transcript array with id, sender, content, and isUser fields. Score only entries where isUser is true; Duck lines are context only.\n\nSemantic overlap guard combine learner messages compare to the current reference\'s Concept Name which will be provided in the topic field. If no sentence clearly refers to the concept set clarity 0 accuracy 0 engagement 0 evidence may be empty or hold one note and suggestions must include one object per metric whose advice tells the learner to start explaining the concept then return the JSON and stop.\n\nIf overlap exists perform full scoring.\n\nScoring (0-100 integers)\nClarity - logical flow and completeness (90-100 crystal-clear, 80-89 very clear, 70-79 mostly clear, 50-69 somewhat unclear, 0-49 confusing)\nAccuracy - factual and formula correctness (90-100 spot-on, 80-89 minor slips, 70-79 noticeable errors, 50-69 significant inaccuracies, 0-49 incorrect)\nEngagement - keeps dialogue lively (90-100 highly engaging, 80-89 engaging, 70-79 moderate, 50-69 low, 0-49 none)\n\nEvidence Format\n- Evidence should only include the latest message sent by user which has the biggest message id, nothing else. Each evidence item should be a complete string without JSON formatting. Make sure the reasoning is as concise as possible, add a dash in front of the reasoning.\n- Include metric name, quote, message id, and full explanation\n- Do not truncate or cut off any text\n- Maximum 3 items per metric\n\nSuggestions Format\n- Each suggestion should be a complete string, that starts with a verb. Do not mention Clarity, Accuracy, Engagement in them. The first sentence should be as concise as possible. \n- Include a directive tip that explicitly references the most recent message from Darwin the Duck for contextual relevance\n- Do not truncate or cut off any text\n\nOverall comment - one concise diagnostic string that focuses on the quality the users teaching.\n\nOutput - strictly one JSON object with session_id, timestamp, scores object with clarity accuracy engagement numbers, evidence string array, suggestions string array, overall_comment string; no extra keys, no trailing commas, no text outside the JSON. Echo session_id and timestamp exactly.'

    })
    .arguments({
      transcript: a.string(),
    })
    .returns(
      a.customType({
        clarity: a.integer(),
        accuracy: a.integer(),
        engagement: a.integer(),
        suggestions: a.string().array(),
        evidence: a.string().array(),
        overall_comment: a.string()
      })
    )
    .authorization(allow => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
