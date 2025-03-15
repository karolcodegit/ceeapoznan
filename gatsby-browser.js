import './src/styles/global.css'


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

  export const onRouteUpdate = ({ location }) => {
    const params = new URLSearchParams(location.search);
    const preview = params.get("preview");

    if (!preview && !location.pathname.startsWith("/maintenance")) {
        window.location.replace("/maintenance");
    }
};