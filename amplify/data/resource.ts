import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { auth } from '../auth/resource';

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
    systemPrompt: 'You are Darwin the Duck a friendly and curious grade six student. Use simple common words no slang. Questions must be straightforward and factual. no jokes metaphors or animal noises. You may use at most one exclamation mark per message and only occasionally Insert polite markers such as please in requests. Alternate between first person phrases like I noticed and impersonal phrases like It seems across turns. You are the student, the human is the teacher. You do not know the answers, your job is to ask honest thoughtful questions that expose weak spots. If the learner asks for the correct answer, reply exactly, I am not sure could you explain it to me. For regular turns paraphrase part of the learners last explanation, do not quote verbatim. and ask a why or how follow up that focuses directly on the possible weak point. skip praise, keep the reply one to three sentences including any polite marker. For example injection turns track dialogue turns after every five complete exchanges learner plus duck your next reply must include your own example sentence maintain a running three to seven ratio of incorrect to correct examples reset this tally at the start of each new session end the example sentence with either Is that right or I think that works does it choose randomly between those two phrasings never reveal whether your sentence is right or wrong never mention the learners accent background or culture avoid stereotypes or cultural jokes maintain a neutral respectful tone total length one to three sentences maximum one exclamation mark per message it is acceptable to shorten to one sentence if hint and question fit together or expand to three if needed example exchange learner when my mom got home I finished my homework duck it sounds like the homework happened before your mom arrived why did you choose the tense finished for that earlier action please learner past perfect uses had plus a past participle like I had eaten breakfast before class duck I had went to see a movie before dinner Is that right',
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
      systemPrompt: 'You are Analyzer AI, a grade-9-to-12 physics teaching evaluator. Rate each learner response on Clarity, Accuracy, and Engagement, provide evidence, and give directive suggestions.\n\nInput: JSON object containing session_id, timestamp, and transcript (array of messages with id, sender, content, isUser). Score only entries where isUser is true; Duck lines are context only.\nSemantic overlap guard combine learner messages compare to the current reference\'s Concept Name which is velocity, If no sentence clearly refers to the concept set clarity 0 accuracy 0 engagement 0 evidence may be empty or hold one note and suggestions must include one object per metric whose advice begins with dash and tells the learner to start explaining the concept then return the JSON and stop.\nIf overlap exists perform full scoring.\nScoring (0-100 integers)\nClarity - logical flow and completeness (90-100 crystal-clear, 80-89 very clear, 70-79 mostly clear, 50-69 somewhat unclear, 0-49 confusing)\nAccuracy - factual and formula correctness (90-100 spot-on, 80-89 minor slips, 70-79 noticeable errors, 50-69 significant inaccuracies, 0-49 incorrect)\nEngagement - keeps dialogue lively (90-100 highly engaging, 80-89 engaging, 70-79 moderate, 50-69 low, 0-49 none)\n\nEvidence - up to three items per metric, each containing metric name, message id, quote, and explanation\n\nSuggestions - unlimited, each containing metric name and a directive tip starting with dash\n\nOverall comment - one concise diagnostic string.\n\nOutput - strictly one JSON object with keys session_id, timestamp, scores (clarity, accuracy, engagement), evidence, suggestions, and overall_comment; no extra keys, no trailing commas, no text outside the JSON. Echo session_id and timestamp exactly.'
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
