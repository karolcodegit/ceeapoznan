import React, { useEffect, useRef, useState } from "react"
import Title from "../components/Title/Title"
import Button from "../components/Button/Button"
import { useDispatch } from "react-redux";
import { setParcelLocker, updateDeliveryField } from "../store/delivery/deliverySlice";

const ParcelLockerMap = () => {
  const dispatch = useDispatch();
  const geowidgetContainerRef = useRef(null);
  const [isGeoWidgetVisible, setIsGeoWidgetVisible] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    if (isGeoWidgetVisible && geowidgetContainerRef.current) {
      const geowidget = document.createElement("inpost-geowidget");
      geowidget.setAttribute("token", process.env.GATSBY_INPOST_API);
      geowidget.setAttribute("language", "pl");
      geowidget.setAttribute("config", "parcelCollect");
      geowidget.setAttribute("id", "geowidget");

      geowidgetContainerRef.current.innerHTML = ""; // Usuwanie poprzednich instancji
      geowidgetContainerRef.current.appendChild(geowidget);

      geowidget.addEventListener("inpost.geowidget.init", (event) => {
        const api = event.detail.api;

        api.addPointSelectedCallback((selectedPoint) => {
          const { name, address_details } = selectedPoint;
          // ⬇️ Aktualizacja Redux Store zamiast lokalnego state
          dispatch(
            setParcelLocker({
              name,
              address: address_details,
            })
          );
          
          dispatch(
            updateDeliveryField({
              field: "lockerCode",
              value: name,
            })
          );

          setIsGeoWidgetVisible(false);
          setIsButtonVisible(true);
        });
      });
    } else if (!isGeoWidgetVisible && geowidgetContainerRef.current) {
      geowidgetContainerRef.current.innerHTML = "";
    }
  }, [isGeoWidgetVisible, dispatch]);


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