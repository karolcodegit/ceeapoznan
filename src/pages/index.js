import * as React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Seo from "../components/seo"
import Title from "../components/Title/Title"
import Button from "../components/Button/Button"
import Box from "../components/Box/Box"
import Paragraph from "../components/Paragraph/Paragraph"
import { slugify } from "../../utils/slugify"
import { AcademicCapIcon, BookOpenIcon } from "@heroicons/react/24/outline"
import { getYearFromDate } from "../../utils/getYearFromDate"

const IndexPage = ({ data }) => {
  const image1 = data.allFile.edges.find(
    edge => edge.node.name === "Collaborative_learning_environment"
  ).node.childImageSharp.fluid
  const image2 = data.allFile.edges.find(
    edge => edge.node.name === "rozwoj-umiejetnosci"
  ).node.childImageSharp.fluid
  const image3 = data.allFile.edges.find(
    edge => edge.node.name === "Creativity_and_innovation"
  ).node.childImageSharp.fluid

  return (
    <>
      <div className="dark:bg-gray-800">
        <div className="mx-auto max-w-6xl bg-white grid lg:grid-cols-12 max-lg:grid-cols-1 px-6 py-36 w-full h-full items-center justify-between gap-x-10 dark:bg-gray-800 ">
          <div className="max-w-xl col-span-6">
            <Title tag="h1" className="text-gray-900 dark:text-white">
              Serdecznie zapraszamy do udziału w kolejnym Kursie
              <span className="text-[#002C7C] pl-3">C</span>
              <span className="text-[#016ABA]">E</span>
              <span className="text-[#47AEE6]">E</span>
              <span className="text-[#88C8EB]">A</span>
            </Title>
            <Paragraph>
              {data.datoCmsMainsite.paragraph ||
                "Ośrodek Poznański CEEA już od niespełna 30 lat organizuje kursy dla lekarzy specjalistów oraz lekarzy rezydentów anestezjologii i intensywnej terapii. Dzięki udziałowi w naszych cyklach kursów mają Państwo możliwość udziału w wykładach prowadzonych przez ekspertów w dziedzinie anestezjologii i intensywnej terapii, aktualizacji wiedzy medycznej w oparciu o Evidence Based Medicine oraz dyskusji w gronie praktyków, w której przeniesiemy wiedzę teoretyczną na realia naszej codziennej pracy, niejednokrotnie obfite w wyzwania organizacyjne."}
            </Paragraph>
            {/* <Paragraph>
              Nasz kurs jest zaprojektowany tak, aby dostarczyć Ci najbardziej
              aktualnych i istotnych treści w przystępny i angażujący sposób. Z
              nami nauczysz się od najlepszych w branży!
            </Paragraph> */}
            {data.allDatoCmsCourse.nodes[0]?.nameCourse && (
              <Button
                href={`/kursy/${getYearFromDate(data.allDatoCmsCourse.nodes[0].date)}/${slugify(
                  data.allDatoCmsCourse.nodes[0].nameCourse
                )}/rejestracja`}
              >
                Zapisz się na kurs
              </Button>
            )}
          </div>
          <div className="w-full lg:h-500 max-lg:hidden px-8 col-span-6">
            {data.allDatoCmsCourse.nodes.length > 0 ? (
              data.allDatoCmsCourse.nodes.map(course => (
                <Img
                  key={course.id}
                  fluid={
                    course.image?.fluid ||
                    data.defaultImage.childImageSharp.fluid
                  }
                  className="rounded-3xl w-full h-full object-cover"
                  alt={course.nameCourse}
                  loading="eager"
                />
              ))
            ) : (
              <Img
                fluid={data.defaultImage.childImageSharp.fluid}
                className="rounded-3xl w-full h-full object-cover"
                alt="Default"
                loading="eager"
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-medium flex py-14 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl flex max-xl:flex-col items-center px-7 max-xl:text-center">
          <div className="max-w-xl xl:mr-10 max-xl:mb-10">
            <Title tag="h2" white>
              Kształcenie ustawiczne w anestezjologii i intensywnej terapii
            </Title>
          </div>
          <div className="flex text-white">
            <div className="flex max-sm:flex-col items-center pr-4 ">
              <div className="bg-darker p-3 rounded-full">
                <BookOpenIcon className="w-10 h-10 max-md:w-7 max-md:h-7 object-cover" />
              </div>
              <span className="md:px-3 max-md:px-2 max-md:text-base max-sm:py-3">
                Kompleksowe kursy
              </span>
            </div>
            <div className="flex items-center max-sm:flex-col">
              <div className="bg-darker p-3 rounded-full">
                <AcademicCapIcon className="w-10 h-10 max-md:w-7 max-md:h-7 object-cover" />
              </div>
              <span className="md:px-3 max-md:px-2 max-md:text-base max-sm:py-3">
                Obszerna biblioteka
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 z-0">
        <div className="max-auto flex flex-col items-center px-6 py-32 ">
          <div className="text-center">
            <Title tag="h2">Dlaczego warto wziąć udział w kursach CEEA?</Title>
            <p className="text-sm text-gray-500 mt-4">
              Jesteśmy pierwszym w Polsce ośrodkiem CEEA, który od 1995 roku
              wyszkolił dziesiątki polskich anestezjologów.
            </p>
          </div>
          <div className="max-w-6xl py-10 grid grid-flow-row lg:grid-cols-3 max-lg:grid-cols-1 max-lg:w-full gap-x-12 gap-y-8  mt-7">
            <Box
              image={image1}
              title="Wymiana doświadczeń między praktykami i ekspertami"
              description="Każdorazowo w kursach CEEA uczestniczy grono kilkudziesięciu lekarzy – znakomitych ekspertów, doświadczonych praktyków a także początkujących rezydentów. Podczas wielu sesji wykładowych wywiązują się interesujące dyskusje i konfrontacje różnych doświadczeń i punktów widzenia.
              "
            />
            <Box
              image={image2}
              title="Aktualna wiedza medyczna oparta o EBM oraz doświadczenie"
              description="Wierzymy, że u podstaw nowoczesnej anestezjologii i intensywnej terapii stoją dowody naukowe wskazujące na skuteczność naszego postępowania, dlatego przedstawiana wiedza opiera się na aktualnych wytycznych i rekomendacjach, uzupełniona praktycznymi wskazówkami budowanymi na latach doświadczeń klinicznych naszych wykładowców.
              "
            />
            <Box
              image={image3}
              title="Warsztaty praktyczne"
              description="W programie bogatym w sesje teoretycznym musi znaleźć się miejsce na aspekt praktyczny. Podczas każdego kursu odbywa się spotkanie warsztatowe, np. poświęcone wykorzystaniu ultrasonografii w anestezji regionalnej wybranych okolic ciała. Z uwagi na ograniczone możliwości czasowe liczba miejsc na udział w warsztatach jest ograniczona.
              "
            />
          </div>
        </div>
      </div>
    </>
  )
}

export const query = graphql`
  query ImageQuery {
    allDatoCmsCourse(filter: { available: { eq: true } }) {
      nodes {
        id
        nameCourse
        date
        available
        image {
          fluid(maxWidth: 800) {
            ...GatsbyDatoCmsFluid
          }
        }
      }
    }
    activeCourse: allDatoCmsCourse(filter: { available: { eq: true } }) {
      nodes {
        id
        nameCourse
      }
    }
    allFile(filter: { relativeDirectory: { eq: "Home" } }) {
      edges {
        node {
          name
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    defaultImage: file(relativePath: { eq: "onas3.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    datoCmsMainsite {
      paragraph
    }
  }
`

export const Head = () => <Seo title="Strona główna" />

export default IndexPage
