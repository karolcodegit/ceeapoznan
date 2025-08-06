import fs from "fs";
import path from "path";

export const loadEmailTemplate = (templateName, data) => {
  const templatePath = path.resolve(`src/templates/emails/${templateName}.html`);
  console.log("Ścieżka do szablonu:", templatePath); // Debug: sprawdź, czy ścieżka jest poprawna

  let template;
  try {
    template = fs.readFileSync(templatePath, "utf8");
    //console.log("Załadowany szablon:", template); // Debug: sprawdź, czy szablon został poprawnie załadowany
  } catch (error) {
    console.error("Błąd podczas ładowania szablonu:", error.message); // Debug: loguj błędy ładowania
    throw error;
  }

  // Wstawianie dynamicznych danych do szablonu
  Object.keys(data).forEach((key) => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, "g"), data[key]);
    //console.log(`Zastąpiono placeholder ${placeholder} wartością: ${data[key]}`); // Debug: sprawdź, czy dane są poprawnie wstawiane
  });

  //console.log("Wygenerowany szablon HTML:", template); // Debug: sprawdź wynikowy HTML
  return template;
};