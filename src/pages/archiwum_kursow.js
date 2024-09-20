import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import Title from "../components/Title/Title"
import Seo from "../components/seo"
import { Link } from "gatsby"
import { slugify } from "../../utils/slugify"

const ArchiwumKursow = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      // Ustawienie początkowej wartości
      setWindowWidth(window.innerWidth);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!data) {
    return <div>Loading...</div>
  }
  const {
    allDatoCmsCourse: { nodes },
  } = data

  return (
    <div>
      <div
    className="grid sm:grid-cols-2 md:grid-cols-[3] gap-4 py-24 relative"
    style={{
      gridTemplateColumns: `${
        windowWidth < 640
          ? "1fr"
          : `repeat(${Math.min(nodes.length, 3)}, 1fr)`
      }`,
    }}
  >
        {nodes.map((course, index) => (
          <div
            key={course.id}
            className="relative bg-white rounded-xl shadow-md p-6 transition duration-500 ease-in-out transform lg:hover:scale-110 hover:z-10 z-0"
            style={{
              backgroundImage: `url(${course.image.fluid.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Link to={`/kursy/${slugify(course.nameCourse)}`}>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md" />
              <div className="relative z-10 flex flex-col h-full gap-6">
              <Title tag="h5" white>
                  Kurs nr {course.numerCourse}
                </Title>
                <Title tag="h4" white>
                  {course.nameCourse}
                </Title>
                <div className="flex justify-between mt-auto text-white">
                  <p className=" text-white">{course.date}</p>
                  <span
                    className={`px-2 items-center inline-flex text-xs leading-5 font-semibold rounded-full ${
                      course.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.available ? "Aktywny" : "Nieaktywny"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export const query = graphql`
  query archiveCourse {
    allDatoCmsCourse(filter: { archive: { eq: true } }, sort: { date: ASC }) {
      nodes {
        id
        nameCourse
        numerCourse
        date
        available
        image {
          fluid {
            src
          }
        }
      }
    }
  }
`

export const Head = () => <Seo title="Archiwum kursów" />

export default ArchiwumKursow
