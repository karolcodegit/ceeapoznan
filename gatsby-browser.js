import React from 'react';
import { Provider } from 'react-redux';
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/react";
import {store}  from './src/store/index';
import './src/styles/global.css'
import 'react-toastify/dist/ReactToastify.css';



export const onClientEntry = () => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://geowidget.inpost.pl/inpost-geowidget.css';
      document.head.appendChild(link);
  
      const script = document.createElement('script');
      script.src = 'https://geowidget.inpost.pl/inpost-geowidget.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  };
  
  // Sentry.init({
  //   dsn: "https://ea0a7a50b85a8028c4a4fd11dac4f1d9@o4509803771265024.ingest.de.sentry.io/4509803783323728",
  //   integrations: [new BrowserTracing()],
  //   tracesSampleRate: 1.0, // Ustaw na 1.0, aby śledzić 100% transakcji (zmniejsz w produkcji)
  //   sendDefaultPii: true,
  //   debug: true, // Włącz debugowanie, aby zobaczyć logi w konsoli
  //   environment: "development",
  // });


export const wrapRootElement = ({ element }) => (
  <Provider store={store}>{element}</Provider>
);

//   export const onRouteUpdate = ({ location }) => {
//     const params = new URLSearchParams(location.search);
//     const preview = params.get("preview");

//     if (!preview && !location.pathname.startsWith("/maintenance")) {
//         window.location.replace("/maintenance");
//     }
// };