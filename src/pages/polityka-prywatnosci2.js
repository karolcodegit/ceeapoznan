import React from "react"
import { Link } from "gatsby"

import PageHeroV2 from "../components/PageHeroV2/PageHeroV2"
import Seo from "../components/seo"

const SECTIONS = [
  {
    title: "Wprowadzenie",
    paragraphs: [
      "Dla Właściciela niniejszej strony internetowej ochrona danych osobowych Użytkowników jest sprawą najwyższej wagi. Dokłada on ogrom starań, aby Użytkownicy czuli się bezpiecznie, powierzając swoje dane osobowe w trakcie korzystania ze strony internetowej.",
      "Użytkownik to osoba fizyczna, osoba prawna albo jednostka organizacyjna nieposiadająca osobowości prawnej, której ustawa przyznaje zdolność prawną, korzystająca z usług elektronicznych dostępnych w ramach strony internetowej.",
      "Niniejsza polityka prywatności wyjaśnia zasady i zakres przetwarzania danych osobowych Użytkownika, przysługujące mu prawa, jak też obowiązki administratora tych danych, a także informuje o używaniu plików cookies.",
      "Administrator stosuje najnowocześniejsze środki techniczne i rozwiązania organizacyjne, zapewniające wysoki poziom ochrony przetwarzanych danych osobowych oraz zabezpieczenia przed dostępem osób nieupoważnionych.",
    ],
  },
  {
    title: "I. Administrator danych osobowych",
    paragraphs: [
      "Administratorem danych osobowych jest CEEA — Ośrodek Poznański, ul. Sokolnicka 56, wpisany do rejestru przedsiębiorców prowadzonego przez Sąd Paczkowo w Poznaniu, Wydział I Gospodarczy, pod numerem KRS: 0000347155, NIP: 777-314-61-00 (zwany dalej: „Właściciel”).",
    ],
  },
  {
    title: "II. Cel przetwarzania danych osobowych",
    paragraphs: [
      "Administrator przetwarza dane osobowe Użytkownika w celu wysłania odpowiedzi poprzez formularz kontaktowy znajdujący się na podstronie „Kontakt”.",
      "Oznacza to, że dane te są potrzebne w szczególności do kontaktu poprzez formularz zawarty w zakładce „Kontakt”.",
      "Użytkownik może również wyrazić zgodę na otrzymywanie informacji o nowościach i promocjach, co spowoduje, że administrator będzie również przetwarzać dane osobowe w celu przesyłania Użytkownikowi informacji handlowych.",
      "Dane osobowe są również przetwarzane w ramach wypełnienia prawnych obowiązków ciążących na administratorze danych oraz realizacji zadań w interesie publicznym, m.in. do wykonywania zadań związanych z bezpieczeństwem i obronnością lub przechowywaniem dokumentacji podatkowej.",
      "Dane osobowe mogą być również przetwarzane w celach marketingu bezpośredniego produktów, zabezpieczenia i dochodzenia roszczeń lub ochrony przed roszczeniami Użytkownika lub osoby trzeciej, jak również marketingu usług i produktów podmiotów trzecich lub marketingu własnego niebędącego marketingiem bezpośrednim.",
    ],
  },
  {
    title: "III. Rodzaj danych",
    paragraphs: [
      "Administrator przetwarza dane osobowe, których podanie jest niezbędne do realizacji celów wskazanych w niniejszej polityce.",
      "Dane podawane przez Użytkownika obejmują m.in. imię.",
    ],
  },
  {
    title: "IV. Podstawa prawna przetwarzania danych osobowych",
    paragraphs: [
      "Dane osobowe są przetwarzane zgodnie z przepisami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).",
      "Administrator przetwarza dane osobowe wyłącznie po uprzednim uzyskaniu zgody Użytkownika.",
      "Wyrażenie zgody na przetwarzanie danych osobowych jest całkowicie dobrowolne.",
    ],
  },
  {
    title: "V. Prawa przysługujące Użytkownikowi",
    paragraphs: [
      "Użytkownik może w każdej chwili zażądać od administratora informacji o zakresie przetwarzania danych osobowych.",
      "Użytkownik może w każdej chwili zażądać poprawienia bądź sprostowania swoich danych osobowych.",
      "Użytkownik może w każdej chwili wycofać swoją zgodę na przetwarzanie jego danych osobowych, bez podawania przyczyny.",
      "Użytkownik może w każdej chwili żądać, bez podawania przyczyny, aby administrator usunął Jego dane.",
      "Użytkownik może w każdej chwili wyrazić sprzeciw przeciwko przetwarzaniu danych osobowych.",
      "Użytkownik może zażądać ograniczenia przetwarzania danych osobowych.",
      "Użytkownik może zażądać, aby administrator przekazał innemu podmiotowi przetwarzane dane osobowe Użytkownika.",
      "Administrator informuje Użytkownika o podjętych działaniach przed upływem miesiąca od otrzymania jednego z żądań wymienionych powyżej.",
    ],
  },
  {
    title: "VI. Powierzenie przetwarzania danych innym podmiotom",
    paragraphs: [
      "Administrator może powierzać przetwarzanie danych osobowych podmiotom współpracującym z administratorem w zakresie niezbędnym do realizacji transakcji.",
      "Poza celami wskazanymi w niniejszej Polityce Prywatności dane osobowe Użytkowników nie będą w żaden sposób udostępniane osobom trzecim w celu przesyłania materiałów marketingowych tych osób trzecich.",
      "Dane osobowe Użytkowników strony internetowej nie są przekazywane poza obszar Unii Europejskiej.",
      "Niniejsza Polityka Prywatności jest zgodna z przepisami wynikającymi z art. 13 ust. 1 i ust. 2 rozporządzenia RODO.",
    ],
  },
]

const PolitykaPrywatnosci2 = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      <PageHeroV2
        title="Polityka prywatności"
        subtitle="Ochrona danych osobowych"
        description="Zasady przetwarzania danych na stronie ceea.org.pl — zgodnie z RODO."
        crumbs={[
          { label: "Strona główna", to: "/home2/" },
          { label: "Polityka prywatności" },
        ]}
        actions={
          <Link
            to="/kontakt2/"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
          >
            Kontakt w sprawie danych
          </Link>
        }
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="space-y-10">
          {SECTIONS.map(section => (
            <section key={section.title}>
              <h2 className="text-xl sm:text-2xl font-bold text-[#002C7C] dark:text-sky-300">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.paragraphs.map(text => (
                  <p
                    key={text.slice(0, 48)}
                    className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="Polityka prywatności — wariant 2" />
export default PolitykaPrywatnosci2
