import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

try {
  const html = renderToString(<App />);
  console.log("RENDER SUCCESS, length:", html.length);
} catch (err) {
  console.error("RENDER ERROR:", err.message, err.stack);
}
