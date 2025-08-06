import React from "react";
import { Provider } from 'react-redux';
import { store } from './src/store';

export const wrapRootElement = ({ element }) => (
  <Provider store={store}>{element}</Provider>
);

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents, setPostBodyComponents }) => {
  setHtmlAttributes({ lang: `pl` });

  setHeadComponents([
    <link
      key="inpost-geowidget-css"
      rel="stylesheet"
      href="https://geowidget.inpost.pl/inpost-geowidget.css"
    />,
    <script
      key="inpost-geowidget-js"
      src="https://geowidget.inpost.pl/inpost-geowidget.js"
      defer
    />,
  ]);

  setPostBodyComponents([
    <script
      key="voiceflow-widget"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          (function(d, t) {
              var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
              v.onload = function() {
                window.voiceflow.chat.load({
                  verify: { projectID: '678cdd04f16cd4b7fb453161' },
                  url: 'https://general-runtime.voiceflow.com',
                  versionID: 'production'
                });
              }
              v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
              v.type = "text/javascript"; 
              s.parentNode.insertBefore(v, s);
          })(document, 'script');
        `,
      }}
    />,
  ]);
};