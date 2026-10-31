import React from "react";

const MaintenancePage = ({ message }) => (
  <main style={{ minHeight: "70vh", display: "flex", flexDirection: "column",
                 alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
    <h1 style={{ fontSize: "1.6rem", marginBottom: ".75rem" }}>Przerwa techniczna</h1>
    <p style={{ color: "#666", maxWidth: "32rem" }}>
      {message || "Trwają prace techniczne. Wracamy już wkrótce — sprawdź za chwilę."}
    </p>
    <p style={{ marginTop: "1.5rem", fontSize: ".9rem" }}>
      Pytania? <a href="mailto:kursy@ceea.org.pl">kursy@ceea.org.pl</a>
    </p>
  </main>
);

export default MaintenancePage;