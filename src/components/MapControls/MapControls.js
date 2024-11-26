import React, { useEffect, useRef } from 'react';

const MapControls = () => {
    const searchWrapperRef = useRef(null); // Referencja dla przeniesionego elementu
  
    useEffect(() => {
        const geowidgetRoot = document.querySelector("geowidget-root");
        if (geowidgetRoot && geowidgetRoot.shadowRoot) {
          const shadowDom = geowidgetRoot.shadowRoot;
          const searchBox = shadowDom.querySelector("geowidget-container > div > div.mobile-above-map > geowidget-search-box > div > div > div");
      
          if (searchBox) {
            // Usuwamy element z shadow DOM
            searchBox.style.display = 'none';
      
            // Skopiuj element do kontenera w MapControls
            const mapControlsContainer = document.querySelector('.map-controls-search');
            if (mapControlsContainer) {
              mapControlsContainer.appendChild(searchBox.cloneNode(true)); // Wklejamy element do MapControls
            }
          }
        }
      }, []);
    return (
      <div className="map-controls bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
        <div ref={searchWrapperRef} className="map-controls-search">
          {/* Tu wklejamy element wyszukiwania paczkomatów */}
        </div>
  
        {/* Wybór lokalizacji */}
        <div className="flex items-center mb-4">
          <div className="text-sm text-gray-700 dark:text-gray-200 mr-2">Użyj mojej lokalizacji</div>
          <button className="text-cyan-500 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-200">
            <i className="fas fa-location-arrow"></i> {/* Ikona lokalizacji */}
          </button>
        </div>
  
        {/* Wyszukiwanie paczkomatów */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Wyszukaj paczkomat"
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-yellow-600 transition">
            Szukaj
          </button>
        </div>
      </div>
    );
  };

export default MapControls;