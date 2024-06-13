import React, { useEffect, useState } from "react"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"

const GoogleMaps = ({ companyData }) => {
  //styles for map
  const mapStyles = {
    height: "70vh",
    width: "100%",
  }

  const [center, setCenter] = useState(null)
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY,
  })

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder()

      geocoder.geocode(
        {
          address: `${companyData.street} ${companyData.numberHome} , ${companyData.city}`,
        },
        (results, status) => {
          if (status === "OK") {
            setCenter({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            })
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            )
          }
        }
      )
    }
  }, [isLoaded, companyData.city, companyData.numberHome, companyData.street])

  if (loadError) return "Error loading maps"
  if (!isLoaded) return "Loading Maps"

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={17}
      center={center}
      companyData={companyData}
    >
      {center && <Marker position={center} />}
    </GoogleMap>
  )
}

export default GoogleMaps
