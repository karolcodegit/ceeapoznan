import React, { useEffect, useState } from "react";
import MaintenancePage from "./MaintenancePage";

export default function MaintenanceGate({ children }) {
  const [m, setM] = useState({ checked: false, on: false, message: "" });

  useEffect(() => {
    fetch("https://panel.ceea.org.pl/api/flags")
      .then((r) => r.json())
      .then(({ maintenance, message }) =>
        setM({ checked: true, on: !!maintenance, message: message || "" })
      )
      .catch(() => setM({ checked: true, on: false, message: "" }));
  }, []);

  if (m.on) return <MaintenancePage message={m.message} />;
  return children;
}