import React from "react"

export const OfficialLetter = () => (
    <section>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6 sm:p-10">
        
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          List Dyrektora CEEA Poznań
        </h2>
  
        <p className="italic mb-6 text-gray-700 dark:text-gray-300">
          Szanowni Państwo,
        </p>
  
        <div className="space-y-5 text-base leading-7 text-gray-700 dark:text-gray-300">
          <p>
            Po 30 latach realizacji zadań edukacyjnych w ramach europejskiego
            przedsięwzięcia jakim było prowadzenie kursów w dziedzinie
            anestezjologii i intensywnej terapii w formacie przyjętym przez ESA,
            następnie ESAIC jako szkolenie ustawiczne FEEA/CEEA, przechodząc na
            emeryturę pozwoliłem sobie przekazać obowiązki Dyrektora Regionalnego
            Centrum CEEA Poznań, Polska Pani{" "}
            <span className="font-semibold">dr n. med. Annie Kluzik</span>.
          </p>
  
          <p>
            Kandydatura Pani Doktor została zaakceptowana do pełnienia tego
            stanowiska przez Board CEEA/ESAIC i od stycznia 2026 roku jej imię i
            nazwisko widnieje już{" "}
            <a
              href="https://esaic.org/professional-growth/ceea/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              w spisie szefów ośrodków
            </a>
            .
          </p>
  
          <p>
            Mam pewność, że nowy Dyrektor CEEA Poznań nadal będzie rozwijał
            szkolenie ustawiczne w naszej dyscyplinie w Polsce, w oparciu o
            doświadczenie zdobyte na tej niwie w ostatnich latach. Koleżanka jest
            adiunktem w Klinice Anestezjologii Intensywnej Terapii i Leczenia Bólu
            Uniwersytetu Medycznego im. Karola Marcinkowskiego w Poznaniu. Posiada
            niezbędną wiedzę, zaangażowanie i optymizm, który niezbędny jest do
            fachowej organizacji szkolenia, doboru wykładowców, redakcji
            podręcznika oraz wszystkich czynności związanych z akomodacją podczas
            Państwa pobytu w Poznaniu.
          </p>
  
          <p>
            Dziękuję Pani Doktor Kluzik, że zechciała podjąć się trudnego zadania,
            które niesie za sobą wysiłek organizacyjny i naukowy, i jeśli jest
            zwieńczony sukcesem, czyli Państwa pozytywną opinią o przebiegu
            szkolenia, daje także satysfakcję. Kursy zgodnie ze statutem
            CEEA/ESAIC nie są działalnością komercyjną, zatem koszty jakie Państwo
            ponoszą w związku z uczestnictwem służą li tylko zbilansowaniu
            przestrzeni wykładowej w hotelu, kosztów własnych wykładowców,
            utrzymania biura oraz księgowości fundacji CEEA. Działalność
            organizatorów nie ma wymiaru zarobkowego i dlatego wdzięczny jestem za
            przejęcie ode mnie funkcji Dyrektora CEEA w świecie nastawionym na
            działalność komercyjną, często pozbawioną zasad.
          </p>
  
          <p>
            Dziękuję, że zechcieli Państwo towarzyszyć mi przez lata prowadzenia
            tego przedsięwzięcia.
          </p>
        </div>
  
        {/* Podpis */}
        <div className="mt-10 text-right">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Krzysztof Kusza
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dyrektor Regionalny CEEA Poznań
          </p>
        </div>
  
        {/* Separator */}
        <hr className="my-10 border-gray-200 dark:border-gray-800" />
  
        {/* Sekcja informacyjna */}
        <div className="space-y-4 text-base leading-7 text-gray-700 dark:text-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            O CEEA Poznań
          </h3>
  
          <p>
            Ośrodek Poznański CEEA już od 30 lat organizuje kursy dla lekarzy
            specjalistów oraz lekarzy rezydentów anestezjologii i intensywnej
            terapii. Dzięki udziałowi w naszych cyklach kursów mają Państwo
            możliwość udziału w wykładach prowadzonych przez ekspertów w
            dziedzinie anestezjologii i intensywnej terapii, aktualizacji wiedzy
            medycznej w oparciu o Evidence Based Medicine oraz dyskusji w gronie
            praktyków, w której przenosimy wiedzę teoretyczną na realia codziennej
            pracy, niejednokrotnie obfitującej w wyzwania organizacyjne.
          </p>
        </div>
      </div>
    </section>
  );
