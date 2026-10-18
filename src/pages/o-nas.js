import React from "react";
import { motion } from "framer-motion";
import { OfficialLetterKrzysztofKusza } from "../components/OfficialLetter/OfficialLetterKrzysztofKusza";
import { OfficialLetterAnnaKluzik } from "../components/OfficialLetter/OfficialLetterAnnaKluzik";
import Paragraph from "../components/Paragraph/Paragraph";
import Seo from "../components/seo";

// --- Animacje (bez zmian) ---

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const separatorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

// --- Treść statyczna (dawniej DatoCMS About_Company) ---

// ZDJĘCIA: wrzuć pliki do katalogu /static/images/ (lub podmień ścieżki).
// Na razie placeholdery – sekcja ze zdjęciem nie renderuje się, dopóki
// ścieżka jest pusta (""), więc strona działa nawet przed podmianą grafik.
const PARAGRAPHS = [
  {
    description: `Koncepcja nauczania ustawicznego w medycynie (CME) ma swoje początki w latach 70-tych XX wieku. Europejska Akademia Anestezjologii rozumiejąc wagę tego procesu w kształtowaniu wysokiej jakości w przebiegu udzielania świadczeń zdrowotnych w anestezjologii powołała do życia strukturę organizacyjną, która w Europie przygotowała program kursów doskonalących i przypominających w ramach Europejskiej Fundacji ds. Szkolenia w Anestezjologii. Początkowo kursy FEEA zarezerwowane były dla małego grona państw Europy Zachodniej, a właściwie krajów starego Beneluksu. Liderem inicjatywy edukacji w oparciu o kursy tematyczne w anestezjologii był profesor Johan Spierdijk z Leiden (Lejda) w Holandii, który doprowadził w 1986 roku do zarejestrowania pierwszej w Europie Fundacji ds. Szkolenia w Anestezjologii (Foundation for Education in Anaesthesiology – FEEA), która otrzymała od Wspólnoty Europejskiej (EC) wysokiej wartości grant na rozwijanie inicjatywy CME w pozostałych krajach E C. Idea FEEA błyskawicznie została zaakceptowana przez Francję, Niemcy, Hiszpanię, Włochy, Grecję i Portugalię.`,
    image: "/images/onas1.jpeg", // ← np. "/images/o-nas-1.jpg"
    alt: "Historia FEEA",
  },
  {
    description: `Szkolenie ustawiczne było oczekiwane także poza krajami CE, a od 1995 roku poza UE, co skutkowało powołaniem pierwszego ośrodka FEEA w Europie Środkowo-Wschodniej w Poznaniu w 1995 r. Otwarcia Centrum FEEA w Poznaniu dokonał prof. Johan Spirdijk wraz z prof. Witoldem Jurczykiem. Miejscem obrad i szkolenia był ośrodek wypoczynkowy nad jeziorem Kierskim w Kiekrzu pod Poznaniem. W kilka lat później pierwszy Dyrektor Centrum Regionalnego FEEA w Poznaniu prof. Witold Jurczyk przekazał uprawnienia do otwarcia kolejnego regionalnego ośrodka FEEA w Polsce Katedrze Anestezjologii UJ w Krakowie, a konkretnie Panu Profesorowi Januszowi Andresowi. Wówczas także kursy FEAA rozlały się na wszystkie kontynenty i stały się dla anestezjologów powszechnie dostępne. W roku 2005, kiedy to ukonstytuowało się Europejskie Towarzystwo Anestezjologów (ESA) nazwę FEEA przekształcono w CEEA (Committee for European Education in Anaesthesiology), który rozwinął listę dydaktyczną proponowanych kursów z pięciu do sześciu.`,
    image: "/images/onas2.jpeg", // ← np. "/images/o-nas-2.jpg"
    alt: "Otwarcie Centrum FEEA w Poznaniu",
  },
  {
    description: `CEEA jest także związane z inicjatywą recertyfikowania dyplomów specjalisty w dziedzinie anestezjologii i intensywnej terapii w oparciu o ukończenie cyklu sześciu kursów. W związku z tym, że recertyfikacja dyplomów specjalisty wydaje się być nieunikniona, czy to w formie egzaminów, jak to ma miejsce w niektórych krajach UE, czy też poprzez kursy CEEA poprzez test samoewaluacji po każdym odbytym kursie, wydaje się, że zasadnym jest aktywne uczestniczenie w tej inicjatywie edukacyjnej. Zachęcam zatem do kontynuowania szkolenia w Regionalnym Centrum CEEA w Poznaniu, gdyż udział naszych kursach i certyfikowanie tego udziału poprzez odpowiednie dokumenty UE i ESAIC może skutecznie pozwolić na uzyskanie przedłużenia ważności dyplomu specjalisty w dziedzinie anestezjologii i intensywnej terapii. Krzysztof Kusza.`,
    image: "/images/onas3.jpg", // ← np. "/images/o-nas-3.jpg"
    alt: "Kursy CEEA",
    fullWidth: true, // paragraf 3: zdjęcie na całą szerokość, tekst pod spodem
  },
];

// --- Komponent ---

const AboutUs = () => {
  return (
    <motion.div
      className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* List Krzysztofa Kuszy */}
      <motion.div variants={fadeInUp}>
        <OfficialLetterKrzysztofKusza />
      </motion.div>

      {/* Separator */}
      <motion.div
        className="my-20 border-t border-gray-200 dark:border-gray-800 origin-center"
        variants={separatorVariants}
      />

      {/* List Anny Kluzik */}
      <motion.div variants={fadeInUp}>
        <OfficialLetterAnnaKluzik />
      </motion.div>

      {/* Separator */}
      <motion.div
        className="my-20 border-t border-gray-200 dark:border-gray-800 origin-center"
        variants={separatorVariants}
      />

      {/* Paragrafy (statyczne) */}
      <motion.div variants={staggerContainer}>
        {PARAGRAPHS.map((para, index) => {
          const isFullWidth = !!para.fullWidth;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              className={`mb-16
                ${isFullWidth
                  ? "flex flex-col gap-6 items-center"
                  : "grid gap-6 lg:gap-10 items-center md:grid-cols-2"
                }
              `}
              variants={fadeInUp}
              viewport={{ once: true, margin: "-80px" }}
              initial="hidden"
              whileInView="visible"
            >
              {/* Obrazek (pomija się, dopóki nie podmienisz ścieżki) */}
              {para.image && (
                <motion.div
                  className={`
                    ${isFullWidth
                      ? "w-full order-1"
                      : isEven
                        ? "md:order-2 flex justify-center"
                        : "md:order-1 flex justify-center"
                    }
                  `}
                  variants={isEven ? slideInRight : slideInLeft}
                  viewport={{ once: true, margin: "-60px" }}
                  initial="hidden"
                  whileInView="visible"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={para.image}
                      alt={para.alt || "Zdjęcie"}
                      loading={index < 2 ? "eager" : "lazy"}
                      className={`
                        rounded-xl shadow-lg
                        ${isFullWidth
                          ? "w-full max-h-[500px] object-cover"
                          : "w-full max-w-md object-cover"
                        }
                      `}
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Tekst */}
              <motion.div
                className={`
                  ${isFullWidth
                    ? "order-2 w-full"
                    : isEven
                      ? "md:order-1"
                      : "md:order-2"
                  }
                `}
                variants={isEven ? slideInLeft : slideInRight}
                viewport={{ once: true, margin: "-60px" }}
                initial="hidden"
                whileInView="visible"
              >
                <Paragraph
                  firstLetter
                  className="text-base leading-7 text-gray-700 dark:text-gray-300"
                >
                  {para.description}
                </Paragraph>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

// GraphQL usunięte całkowicie – strona w 100% statyczna.
export const Head = () => <Seo title="O nas" />
export default AboutUs
