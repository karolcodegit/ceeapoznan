import { useLocation } from "@reach/router";
import { menuLinks, otherLinks, przydatneLinki } from "../components/Menu";


const useLastBreadcrumb = (pathname) => {
  
  const location = useLocation();
  const currentPath = location.pathname;
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks];

  // Sprawdź, czy jesteśmy na stronie rejestracji
  const isRegistrationPage = currentPath.endsWith('/rejestracja/');

  if (isRegistrationPage) {
    // Jeśli tak, zwróć odpowiedni tytuł
    return 'Zapis na kurs';
  } else {
    // W przeciwnym razie, filtruj linki jak wcześniej
    const links = allLinks.filter(link => currentPath.includes(link.to));

    // Zwróć ostatni link jako tytuł
    return links.length > 0 ? links[links.length - 1].title : '';
  }
};
export default useLastBreadcrumb;