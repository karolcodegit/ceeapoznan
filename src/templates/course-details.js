import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import Line from "../components/Line/Line"
import Seo from "../components/seo"
import { EnvelopeOpenIcon, PhoneIcon } from "@heroicons/react/24/outline"
import { MarkdownText } from "../utils/markdownText"
import StyledMarkdown from "../components/StyledMarkdown/StyledMarkdown"

const courseDetails = ({ data }) => {
  const { datoCmsCourse: course } = data
  return (
    <div className="px-5 py-12 max-w-6xl mx-auto lg:flex-row items-center justify-between">
      <div className="max-w-full ">
        <div className="border-b">
          <section className="col-span-6">
            <div>
              <Title tag="h3">Lokalizacja</Title>
              <Line />
            </div>
            <div>
              <GatsbyImage
                className="float-right w-full lg:w-6/12 rounded-lg shadow-lg lg:mx-5 lg:my-4 max-lg:my-8"
                image={
                  data.datoCmsCourse &&
                  data.datoCmsCourse.detailedInformationAboutTheCourse &&
                  data.datoCmsCourse.detailedInformationAboutTheCourse
                    .imageHotel
                    ? getImage(data.datoCmsCourse.detailedInformationAboutTheCourse.imageHotel)
                    : undefined
                }
                alt="Hotel Ilonn"
              />

              <Paragraph>
                <MarkdownText
                  text={
                    course.detailedInformationAboutTheCourse &&
                    course.detailedInformationAboutTheCourse.description
                      ? course.detailedInformationAboutTheCourse.description
                      : ""
                  }
                />
              </Paragraph>

              {course?.detailedInformationAboutTheCourse?.password && (
                <Paragraph>
                  W celu rezerwacji pokoju (na hasło:{" "}
                  <span className="font-bold">
                    {course.detailedInformationAboutTheCourse.password}
                  </span>
                  ) prosimy o kontakt z:
                </Paragraph>
              )}

              {course?.detailedInformationAboutTheCourse?.emailHotel && (
                <Paragraph>
                  <span className="flex my-2 items-center">
                    <EnvelopeOpenIcon className="w-8" />
                    <span className="pl-4">
                      {course.detailedInformationAboutTheCourse.emailHotel}
                    </span>
                  </span>
                </Paragraph>
              )}

              {course?.detailedInformationAboutTheCourse?.phone && (
                <Paragraph>
                   <span className="flex my-2 items-center">
                    <PhoneIcon className="w-8"></PhoneIcon>
                    <span className="pl-4">
                      {course.detailedInformationAboutTheCourse.phone}
                    </span>
                  </span>
                </Paragraph>
              )}
              <div className="mt-4">
                <Paragraph>
                  Na powyższego maila należy przesłać swoje dane, a w przypadku,
                  gdy potrzebujecie Państwo FV należy podać także NIP i dane
                  firmy.
                </Paragraph>
              </div>
              <div className="py-1">
                <Paragraph>Koszt pokoju wynosi:</Paragraph>
                <StyledMarkdown>
                  {course.detailedInformationAboutTheCourse &&
                  course.detailedInformationAboutTheCourse.costHotel
                    ? course.detailedInformationAboutTheCourse.costHotel
                    : "Kwota nieznana "}
                </StyledMarkdown>
              </div>
              <Paragraph>
                {course.detailedInformationAboutTheCourse &&
                course.detailedInformationAboutTheCourse.additionalInformation
                  ? course.detailedInformationAboutTheCourse
                      .additionalInformation
                  : ""}
              </Paragraph>
            </div>
          </section>
        </div>
        <div className="flex">
          <section className="pt-20">
            <div className="py-8">
              <Title tag="h4">Warunki uczestnictwa</Title>
              <Line />
            </div>
            <div className="">
              <Paragraph>
              <StyledMarkdown>
                {course?.detailedInformationAboutTheCourse &&
                course?.detailedInformationAboutTheHotel
                  ?.conditionsOfParticipation
                  ? course.detailedInformationAboutTheHotel
                      .conditionsOfParticipation
                  : ""}
              </StyledMarkdown>
              </Paragraph>
            </div>
            <div className="py-12">
              <div className="flex lg:flex-row max-lg:flex-col items-start gap-8">
                {data.datoCmsCourse &&
                  data.datoCmsCourse.detailedInformationAboutTheHotel &&
                  data.datoCmsCourse.detailedInformationAboutTheHotel
                    .pictureHotel && (
                    <GatsbyImage
                      className="float-left w-full rounded-lg shadow-lg lg:mx-5 "
                      image={
                        getImage(data.datoCmsCourse.detailedInformationAboutTheHotel.pictureHotel)
                      }
                      alt="Hotel Ilonn"
                    />
                  )}
                <Paragraph className="w-full">
                  <div className="py-3">Wpłaty prosimy dokonywać na konto:</div>
                  <div>
                    Europejska Fundacja ds. Szkolenia w Anestezjologii i
                    Intensywnej Terapii CEEA
                  </div>
                  <div>
                    {data.datoCmsCompany.zipCode} {data.datoCmsCompany.city},
                    ul.{data.datoCmsCompany.street}{" "}
                    {data.datoCmsCompany.numberHome}
                  </div>
                  <div className="font-bold">
                    {data.datoCmsCompany.bankAccount}
                  </div>
                </Paragraph>
              </div>
            </div>
            {course?.detailedInformationAboutTheHotel?.extras && (
              <div>
                <Paragraph>Dla osób chętnych:</Paragraph>
                <Paragraph>
                  <StyledMarkdown>
                    {course.detailedInformationAboutTheHotel.extras}
                  </StyledMarkdown>
                </Paragraph>
              </div>
            )}
            <div className="py-4">
              <Paragraph>
                Prosimy o dokonywanie wpłat z uwzględnieniem w tytule „Kurs nr{" "}
                {course.numerCourse} ” oraz czego dotyczą.
              </Paragraph>
              <Paragraph>
                Liczba miejsc na kursie ograniczona, dlatego też prosimy o jak
                najszybsze dokonanie wpłaty..
              </Paragraph>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export const courseAndCompanyQuery = graphql`
  query CourseAndCompanyQuery($id: String!) {
    datoCmsCourse(id: { eq: $id }) {
      numerCourse
      detailedInformationAboutTheCourse {
        imageHotel {
          gatsbyImageData(width: 800)
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
          gatsbyImageData(width: 800)
        }
        extras
      }
    }

    datoCmsCompany {
      nameCompany
      street
      numberHome
      city
      zipCode
      regon
      nip
      krs
      bankAccount
      bankAccountName
      mail
    }
  }
`

export const Head = () => <Seo title=" O kursie" />

export default courseDetails