import React, { useEffect, useRef, useState } from "react"
import Title from "../components/Title/Title"
import Button from "../components/Button/Button"

const ParcelLockerMap = ({ setForm }) => {
  const geowidgetContainerRef = useRef(null);
  const [isGeoWidgetVisible, setIsGeoWidgetVisible] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false); // Dodajemy stan do ukrywania/wyświetlania przycisku

  useEffect(() => {
    if (isGeoWidgetVisible && geowidgetContainerRef.current) {
      const geowidget = document.createElement("inpost-geowidget");
      geowidget.setAttribute("token", process.env.GATSBY_INPOST_API);
      geowidget.setAttribute("language", "pl");
      geowidget.setAttribute("config", "parcelCollect");
      geowidget.setAttribute("id", "geowidget");

      geowidgetContainerRef.current.innerHTML = ""; // Usuwanie poprzednich instancji
      geowidgetContainerRef.current.appendChild(geowidget);

      // Nasłuchiwanie inicjalizacji widgetu
      geowidget.addEventListener("inpost.geowidget.init", (event) => {
        const api = event.detail.api;

        api.addPointSelectedCallback((selectedPoint) => {
          const { name, address_details } = selectedPoint;

          // Aktualizacja formularza
          setForm((prevForm) => ({
            ...prevForm,
            parcelLocker: {
              name,
              address: address_details,
            },
          }));

          // Zamknięcie mapy
          setIsGeoWidgetVisible(false);
          setIsButtonVisible(true); // Ustawienie widoczności przycisku
        });
      });
    } else if (!isGeoWidgetVisible && geowidgetContainerRef.current) {
      // Usuwanie widgetu po ukryciu
      geowidgetContainerRef.current.innerHTML = "";
    }

    //console.log("geowidgetContainerRef:", geowidgetContainerRef.current);
  }, [isGeoWidgetVisible, setForm]);

  return (
    <div className="w-full">
      <Title tag="h4" padding className="text-center">
        Mapa Paczkomatów
      </Title>
      {isGeoWidgetVisible ? (
        <div
          ref={geowidgetContainerRef}
          className="responsive-geowidget w-full h-[800px] max-h-[800px] overflow-hidden"
        ></div>
      ) : null} {/* Mapa będzie ukryta, ale tylko przycisk będzie widoczny */}
      
      {isButtonVisible && (
        <div className="text-center mt-4">
          <Button type="button" onClick={() => setIsGeoWidgetVisible(true)} className="btn btn-primary">
            Wybierz inny paczkomat
          </Button>
        </div>
      )}
    </div>
  );
};


export default ParcelLockerMap;