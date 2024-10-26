import React from "react"
import { graphql } from "gatsby"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import Line from "../components/Line/Line"
import Button from "../components/Button/Button"
import SideInfoPanel from "../components/SideInfoPanel/SideInfoPanel"
import { MarkdownText } from "../../utils/markdownText"
import { slugify } from "../../utils/slugify"
import StyledMarkdown from "../components/StyledMarkdown/StyledMarkdown"
import { FaFacebook } from "react-icons/fa"
import { getYearFromDate } from "../../utils/getYearFromDate"

const Course = ({ data }) => {
  const { datoCmsCourse: course } = data
  console.log(course.date);
  
  return (
    <div className="py-20 max-w-6xl max-md:mx-auto gap-32 flex flex-col xl:flex-row justify-between">
      <div className=" max-w-2xl">
        <section className="border-b">
          <div>
            <Title tag="h3">{course.nameCourse}</Title>
            <Line />
          </div>
          <div>
            <Paragraph>
              <MarkdownText text={course.description} />
            </Paragraph>
          </div>
        </section>
        <section className="pt-20">
          <div className="py-8">
            <Title tag="h4" className="text-2xl font-semibold text-gray-800">
              Program kursu
            </Title>
            <Line />
          </div>
          <div className="ml-5 space-y-12">
            {course.daycourse.length === 0 ? (
              <Paragraph className="text-lg text-gray-600">
                Plan w trakcie tworzenia
              </Paragraph>
            ) : (
              course.daycourse.map((day, index) => {
                return (
                  <div key={index} className="my-8 space-y-8">
                    <Title
                      tag="h4"
                      
                    >
                      Dzień {index + 1}
                    </Title>
                    <span className="text-gray-500 dark:text-gray-200 font-bold">
                      {day.date}
                    </span>
                    <ul className="space-y-2">
                      {day.event.map((event, eventIndex) => {
                        const isFacebookLink =
                          event.event.includes("facebook.com")
                        return (
                          <li
                            key={eventIndex}
                            className="py-3 text-gray-600 dark:text-gray-200 text-sm md:text-base"
                          >
                            {isFacebookLink ? (
                              <div className="flex flex-col md:flex-row items-start md:items-center">
                                <div className="flex items-center mb-2 md:mb-0">
                                  <FaFacebook className="text-xl md:text-2xl mr-2" />
                                  <span className="font-bold md:hidden">
                                    Facebook link:
                                  </span>
                                </div>
                                <StyledMarkdown>{event.event}</StyledMarkdown>
                              </div>
                            ) : (
                              <StyledMarkdown>{event.event}</StyledMarkdown>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })
            )}
          </div>
        </section>
        {(course.detailedInformationAboutTheCourse ||
          course.detailedInformationAboutTheHotel) && (
          <div className="flex justify-start mt-8">
            <Button href={`/kursy/${getYearFromDate(course.date)}/${slugify(course.nameCourse)}/szczegoly`}>
              Szczegółowe informacje o kursie
            </Button>
          </div>
        )}
      </div>
      <SideInfoPanel
        money={course.courseCost}
        time={course.courseDuration}
        available={course.available}
        nameCourse={course.nameCourse}
        date={course.date}
      />
    </div>
  )
}

export const courseQuery = graphql`
  query CourseQuery($id: String!) {
    datoCmsCourse(id: { eq: $id }) {
      id
      nameCourse
      description
      date
      image {
        url
      }
      daycourse {
        date
        event {
          event
        }
      }
      courseDuration
      courseCost
      available

      detailedInformationAboutTheCourse {
        imageHotel {
          url
        }
        additionalInformation
        costHotel
        description
        emailHotel
        password
        phone
      }

      detailedInformationAboutTheHotel {
        conditionsOfParticipation
        pictureHotel {
          url
        }
        extras
      }
    }
  }
`

export default Course
