import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify with sandbox settings
Amplify.configure({
  ...outputs,
  API: {
    GraphQL: {
      endpoint: 'http://localhost:4000/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'userPool',
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
