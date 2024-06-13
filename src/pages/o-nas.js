import React from "react"
import Paragraph from "../components/Paragraph/Paragraph"
import Picture1 from "../assets/images/onas1.jpeg"
import Picture2 from "../assets/images/onas2.jpeg"
import Picture3 from "../assets/images/onas3.jpg"
import Seo from "../components/seo"

const AboutUs = () => {
  return (
    <>

      <Paragraph firstLetter>
        <img
          className="sm:float-right max-sm:hidden w-72 h-auto px-5 p-5 "
          src={Picture1}
          alt=""
        />
        Koncepcja nauczania ustawicznego w medycynie (CME) ma swoje początki w
        latach 70-tych XX wieku. Europejska Akademia Anestezjologii rozumiejąc
        wagę tego procesu w kształtowaniu wysokiej jakości w przebiegu
        udzielania świadczeń zdrowotnych w anestezjologii powołała do życia
        strukturę organizacyjną, która w Europie przygotowała program kursów
        doskonalących i przypominających w ramach Europejskiej Fundacji ds.
        Szkolenia w Anestezjologii. Początkowo kursy FEEA zarezerwowane były dla
        małego grona państw Europy Zachodniej, a właściwie krajów starego
        Beneluksu. Liderem inicjatywy edukacji w oparciu o kursy tematyczne w
        anestezjologii był profesor Johan Spierdijk z Leiden (Lejda) w Holandii,
        który doprowadził w 1986 roku do zarejestrowania pierwszej w Europie
        Fundacji ds. Szkolenia w Anestezjologii (Foundation for Education in
        Anaesthesiology – FEEA), która otrzymała od Wspólnoty Europejskiej (EC)
        wysokiej wartości grant na rozwijanie inicjatywy CME w pozostałych
        krajach E C. Idea FEEA błyskawicznie została zaakceptowana przez
        Francję, Niemcy, Hiszpanię, Włochy, Grecję i Portugalię.
      </Paragraph>

      <Paragraph firstLetter>
        <img
          className="sm:float-right max-sm:hidden w-60 h-auto px-5 p-5"
          src={Picture2}
          alt=""
        />
        Szkolenie ustawiczne było oczekiwane także poza krajami CE, a od 1995
        roku poza UE, co skutkowało powołaniem pierwszego ośrodka FEEA w Europie
        Środkowo-Wschodniej w Poznaniu w 1995 r. Otwarcia Centrum FEEA w
        Poznaniu dokonał prof. Johan Spirdijk wraz z prof. Witoldem Jurczykiem.
        Miejscem obrad i szkolenia był ośrodek wypoczynkowy nad jeziorem
        Kierskim w Kiekrzu pod Poznaniem. W kilka lat później pierwszy Dyrektor
        Centrum Regionalnego FEEA w Poznaniu prof. Witold Jurczyk przekazał
        uprawnienia do otwarcia kolejnego regionalnego ośrodka FEEA w Polsce
        Katedrze Anestezjologii UJ w Krakowie, a konkretnie Panu Profesorowi
        Januszowi Andresowi. Wówczas także kursy FEAA rozlały się na wszystkie
        kontynenty i stały się dla anestezjologów powszechnie dostępne. W roku
        2005, kiedy to ukonstytuowało się Europejskie Towarzystwo Anestezjologów
        (ESA) nazwę FEEA przekształcono w CEEA (Committee for European Education
        in Anaesthesiology), który rozwinął listę dydaktyczną proponowanych
        kursów z pięciu do sześciu.
      </Paragraph>

      <Paragraph firstLetter>
        CEEA jest także związane z inicjatywą recertyfikowania dyplomów
        specjalisty w dziedzinie anestezjologii i intensywnej terapii w oparciu
        o ukończenie cyklu sześciu kursów. W związku z tym, że recertyfikacja
        dyplomów specjalisty wydaje się być nie unikniona, czy to w formie
        egzaminów, jak to ma miejsce w niektórych krajach UE, czy też poprzez
        kursy CEEA poprzez test samoewaluacji po każdym odbytym kursie, wydaje
        się, że zasadnym jest aktywne uczestniczenie w tej inicjatywie
        edukacyjnej. Zachęcam zatem do kontynuowania szkolenia w Regionalnym
        Centrum CEEA w Poznaniu, gdyż udział naszych kursach i certyfikowanie
        tego udziału poprzez odpowiednie dokumenty UE i ESAIC może skutecznie
        pozwolić na uzyskanie przedłużenia ważności dyplomu specjalisty w
        dziedzinie anestezjologii i intensywnej terapii.
        <img
    className="mt-9 max-w-2xl max-md:max-w-xl max-sm:max-w-lg mx-auto object-cover w-full"
    src={Picture3}
          alt=""
        />
      </Paragraph>
    </>
  )
}
export const Head = () => <Seo title="O nas" />
export default AboutUs
