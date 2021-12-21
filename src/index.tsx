import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

Sentry.init({
  dsn: "https://87ea8fdc275e4685b6aa5a927f7400f7@o366978.ingest.sentry.io/6117006",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: .1,
  enabled: process.env.NODE_ENV !== 'development'
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
