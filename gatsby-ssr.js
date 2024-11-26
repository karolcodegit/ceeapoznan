import React from "react";

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
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
};