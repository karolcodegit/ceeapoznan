import React from "react"
import { Link } from "gatsby"
import { motion } from "framer-motion"
import { OfficialLetterKrzysztofKusza } from "../components/OfficialLetter/OfficialLetterKrzysztofKusza"
import { OfficialLetterAnnaKluzik } from "../components/OfficialLetter/OfficialLetterAnnaKluzik"
import Seo from "../components/seo"

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
}

/**
 * Fakty o fundacji i ośrodku — źródła:
 * - KRS 0000347155 / BizRaport (siedziba, cel, data rejestracji)
 * - cea.org.pl / listy dyrektorów (treść listów w komponentach)
 * - ESAIC CEEA (ok. 50 ośrodków, cykl 6 kursów; dyrektor Poznań: Anna Kluzik)
 * - Historia FEEA→CEEA z treści własnej strony O nas
 */
const FOUNDATION_FACTS = [
  {
    label: "Pełna nazwa",
    value:
      "Europejska Fundacja ds. Szkolenia w Anestezjologii (działająca także jako CEEA)",
  },
  {
    label: "KRS",
    value: "0000347155",
  },
  {
    label: "NIP / REGON",
    value: "7773146100 / 301341024",
  },
  {
    label: "Siedziba",
    value: "ul. Sokolnicka 56, 62-021 Paczkowo",
  },
  {
    label: "Rejestracja w KRS",
    value: "26 stycznia 2010 r.",
  },
  {
    label: "Forma prawna",
    value: "Fundacja",
  },
]

const TIMELINE = [
  {
    year: "1986",
    title: "FEEA w Europie",
    text: "Prof. Johan Spierdijk z Leiden doprowadził do zarejestrowania Foundation for Education in Anaesthesiology (FEEA) — inicjatywy CME w anestezjologii, początkowo w krajach Europy Zachodniej.",
  },
  {
    year: "1995",
    title: "Ośrodek w Poznaniu",
    text: "Powstaje pierwszy ośrodek FEEA w Europie Środkowo-Wschodniej — w Poznaniu. Otwarcia dokonali prof. Johan Spierdijk oraz prof. Witold Jurczyk. Zajęcia odbywały się m.in. w ośrodku nad Jeziorem Kierskim w Kiekrzu.",
  },
  {
    year: "2005",
    title: "FEEA → CEEA",
    text: "Wraz z ukonstytuowaniem się Europejskiego Towarzystwa Anestezjologów (ESA) nazwę FEEA przekształcono w CEEA (Committee for European Education in Anaesthesiology). Program dydaktyczny rozwinięto z pięciu do sześciu kursów.",
  },
  {
    year: "dziś",
    title: "CEEA / ESAIC",
    text: "CEEA działa jako komitet ESAIC (European Society of Anaesthesiology and Intensive Care) i zrzesza około 50 regionalnych ośrodków CME. Dyrektorem Regionalnego Centrum CEEA w Poznaniu jest dr n. med. Anna Kluzik (od stycznia 2026, za zgodą Board CEEA/ESAIC).",
  },
]

const GOALS = [
  "Wdrażanie ustawicznego kształcenia podyplomowego (CME — Continuing Medical Education).",
  "Integracja polskiego i zagranicznego środowiska lekarzy anestezjologów oraz pielęgniarek anestezjologicznych.",
  "Popularyzowanie aktualnego dorobku w anestezjologii, intensywnej terapii oraz medycynie ratunkowej.",
  "Edukacja, rozwój wiedzy i doświadczenia środowiska anestezjologicznego.",
  "Wspomaganie inicjatyw podnoszących standardy w anestezjologii i intensywnej terapii.",
]

const HISTORY = [
  {
    title: "Idea kształcenia ustawicznego",
    image: "/images/onas1.jpeg",
    alt: "Historia europejskiej inicjatywy FEEA",
    body: `Koncepcja nauczania ustawicznego w medycynie (CME) ma swoje początki w latach 70. XX wieku. Europejska Akademia Anestezjologii, rozumiejąc wagę tego procesu dla jakości świadczeń, przygotowała program kursów doskonalących w ramach Europejskiej Fundacji ds. Szkolenia w Anestezjologii. Początkowo kursy FEEA skierowane były do krajów Europy Zachodniej (m.in. Beneluksu). Liderem inicjatywy był profesor Johan Spierdijk z Leiden. Idea szybko została przyjęta m.in. we Francji, Niemczech, Hiszpanii, we Włoszech, w Grecji i Portugalii.`,
  },
  {
    title: "Poznań — pierwszy ośrodek w regionie",
    image: "/images/onas2.jpeg",
    alt: "Otwarcie Centrum FEEA w Poznaniu",
    body: `W 1995 r. powołano pierwszy ośrodek FEEA w Europie Środkowo-Wschodniej — w Poznaniu. Otwarcia dokonali prof. Johan Spierdijk oraz prof. Witold Jurczyk. Później pierwszy dyrektor Centrum Regionalnego FEEA w Poznaniu, prof. Witold Jurczyk, przekazał uprawnienia do otwarcia kolejnego ośrodka w Polsce Katedrze Anestezjologii UJ w Krakowie (prof. Janusz Andres). W 2005 r., wraz z ESA, nazwę FEEA przekształcono w CEEA i rozszerzono cykl kursów do sześciu.`,
  },
  {
    title: "Znaczenie cyklu kursów",
    image: "/images/onas3.jpg",
    alt: "Kursy CEEA w Poznaniu",
    body: `CEEA wiąże się także z ideą potwierdzania kompetencji specjalisty w anestezjologii i intensywnej terapii poprzez ukończenie cyklu sześciu kursów oraz testy samoewaluacji. Udział w kursach Regionalnego Centrum CEEA w Poznaniu oraz dokumenty potwierdzające udział w formacie CEEA/ESAIC mogą wspierać proces utrzymania aktualności wiedzy specjalistycznej. Kursy — zgodnie ze statutem CEEA/ESAIC — nie są działalnością komercyjną: opłaty uczestników służą pokryciu kosztów organizacji (m.in. przestrzeni wykładowej, wykładowców, biura i księgowości fundacji).`,
  },
]

const AboutUs2 = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100">
      {/* Intro full-bleed: breadcrumbs + h1 „O nas” w gradiencie */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a] via-[#0c6478] to-[#023e8a]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#E8A317]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#00C896]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl text-white"
          >
            <motion.nav
              variants={fadeInUp}
              aria-label="Okruszki nawigacyjne"
              className="mb-6"
            >
              <ol className="flex flex-wrap items-center gap-2 text-sm text-white/75">
                <li>
                  <Link
                    to="/"
                    className="rounded-sm transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317]"
                  >
                    Strona główna
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">
                  /
                </li>
                <li className="font-semibold text-white" aria-current="page">
                  O nas
                </li>
              </ol>
            </motion.nav>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              O nas
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-3 text-lg sm:text-xl font-semibold text-[#E8A317]"
            >
              Regionalne Centrum CEEA w Poznaniu
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="mt-5 text-base sm:text-lg leading-relaxed text-white/90"
            >
              Ośrodek Poznański CEEA od 1995 roku organizuje kursy dla lekarzy
              specjalistów oraz rezydentów anestezjologii i intensywnej terapii —
              w europejskim formacie kształcenia ustawicznego powiązanym z ESAIC.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/kursy/"
                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50"
              >
                Zobacz kursy
              </Link>
              <a
                href="https://esaic.org/professional-growth/ceea/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                CEEA na stronie ESAIC
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fundacja — fakty */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
              Fundacja
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Działalność ośrodka prowadzona jest w ramach Europejskiej Fundacji
              ds. Szkolenia w Anestezjologii. Poniższe dane pochodzą z publicznego
              wpisu KRS (0000347155).
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Cel statutowy fundacji obejmuje ochronę zdrowia, w szczególności
              rozwój CME, integrację środowiska anestezjologicznego oraz
              popularyzację aktualnej wiedzy w anestezjologii, intensywnej terapii
              i medycynie ratunkowej.
            </p>
          </div>
          <dl className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
            {FOUNDATION_FACTS.map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#0C6478] dark:text-sky-400">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-snug">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F7F4EF] p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-[#002C7C] dark:text-sky-300">
            Cele fundacji (ze statutu / KRS)
          </h3>
          <ul className="mt-4 space-y-2.5">
            {GOALS.map(goal => (
              <li
                key={goal}
                className="flex gap-3 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8A317]"
                  aria-hidden="true"
                />
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-100 dark:bg-slate-900/80 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300">
            Historia ośrodka
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Wybrane fakty z historii europejskiej inicjatywy FEEA/CEEA oraz
            ośrodka poznańskiego — na podstawie materiałów własnych CEEA Poznań
            oraz informacji ESAIC.
          </p>
          <ol className="mt-10 space-y-6">
            {TIMELINE.map((item, i) => (
              <li key={item.year} className="relative flex gap-4 sm:gap-6">
                <div className="flex w-16 sm:w-20 shrink-0 flex-col items-center">
                  <span className="rounded-full bg-[#002C7C] px-2.5 py-1 text-xs font-bold text-white dark:bg-sky-600">
                    {item.year}
                  </span>
                  {i < TIMELINE.length - 1 && (
                    <span
                      className="mt-2 w-px flex-1 bg-slate-300 dark:bg-slate-600"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Listy dyrektorów */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#002C7C] dark:text-sky-300 mb-8">
          Głos dyrektorów
        </h2>
        <div className="space-y-10">
          <OfficialLetterKrzysztofKusza />
          <OfficialLetterAnnaKluzik />
        </div>
      </section>

      {/* Historia rozszerzona + zdjęcia */}
      <section className="bg-[#F7F4EF] dark:bg-slate-900 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          {HISTORY.map((block, index) => {
            const reverse = index % 2 === 1
            return (
              <article
                key={block.title}
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  reverse ? "" : ""
                }`}
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <img
                    src={block.image}
                    alt={block.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="w-full rounded-2xl object-cover shadow-lg max-h-[360px]"
                  />
                </div>
                <div className={reverse ? "lg:order-1" : ""}>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#002C7C] dark:text-sky-300">
                    {block.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {block.body}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#002C7C] to-[#0C6478] px-6 py-10 sm:px-10 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Dołącz do kursów CEEA</h2>
            <p className="mt-2 text-white/85 max-w-xl">
              Aktualna oferta szkoleń Regionalnego Centrum CEEA w Poznaniu jest
              dostępna w sekcji Kursy.
            </p>
          </div>
          <Link
            to="/kursy/"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#002C7C] transition hover:bg-sky-50"
          >
            Przejdź do kursów
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Źródła faktów: wpis KRS 0000347155 (BizRaport);{" "}
          <a
            className="underline underline-offset-2"
            href="https://esaic.org/professional-growth/ceea/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ESAIC — CEEA
          </a>
          ; materiały własne ceea.org.pl (historia FEEA/CEEA, listy dyrektorów).
        </p>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="O nas — wariant 2" />
export default AboutUs2
