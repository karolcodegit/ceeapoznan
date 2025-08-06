export const changeDate = (dateInput) => {
    if (!dateInput || dateInput.length < 10) {
      return null; // Jeśli data jest pusta, zwróć null
    }
  
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput; // Obsługa zarówno stringów, jak i obiektów Date
  
    if (isNaN(date.getTime())) {
      throw new Error("Niepoprawny format daty!"); // Rzuć błąd, jeśli data jest niepoprawna
    }
  
    // Konwersja do formatu DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Miesiące są indeksowane od 0
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };