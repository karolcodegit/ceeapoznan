import React from 'react';
import { Provider } from 'react-redux';
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