import React, { useState } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeOpenIcon,
  PhoneIcon,
  MapPinIcon,
  BanknotesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import Line from "../components/Line/Line"
import Seo from "../components/seo"
import { MarkdownText } from "../utils/markdownText"
import StyledMarkdown from "../components/StyledMarkdown/StyledMarkdown"

// --- Mały helper: karta informacyjna ---

const InfoCard = ({ icon: Icon, label, children, className = "" }) => (
  <div
    className={`flex items-start gap-1 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm ${className}`}
  >
    {Icon && (
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
        <Icon className="w-5 h-5 dark:text-white" />
      </div>
    )}
    <div className="min-w-0 flex-1">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
          {label}
        </p>
      )}
      <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  </div>
)

// --- Komponent danych bankowych z kopiowaniem ---

const BankDetails = ({ company, courseNumber }) => {
  const [copied, setCopied] = useState(false)
  const account = company?.bankAccount || ""

  const handleCopy = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <BanknotesIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Dane do przelewu
        </h3>
      </div>

      <div className="space-y-3 text-sm sm:text-base">
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          Europejska Fundacja ds. Szkolenia w Anestezjologii i Intensywnej
          Terapii CEEA
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          {company?.zipCode} {company?.city}, ul. {company?.street}{" "}
          {company?.numberHome}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <code className="flex-1 text-sm sm:text-base font-mono text-gray-900 dark:text-gray-100 break-all">
            {account}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            aria-label="Kopiuj numer konta"
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span>Skopiowano</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Kopiuj</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          W tytule przelewu wpisz:{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Kurs nr {courseNumber}
          </span>
        </p>
      </div>
    </div>
  )
}

// --- Główna strona ---

const CourseDetails = ({ data }) => {
  const { datoCmsCourse: course, datoCmsCompany: company } = data

  const courseInfo = course?.detailedInformationAboutTheCourse
  const hotelInfo = course?.detailedInformationAboutTheHotel

  console.log(courseInfo)

  const hotelImage = courseInfo?.imageHotel
    ? getImage(courseInfo.imageHotel)
    : null
  const hotelPicture = hotelInfo?.pictureHotel
    ? getImage(hotelInfo.pictureHotel)
    : null

  return (
    <div className="px-5 py-12 sm:py-16 max-w-6xl mx-auto">
      {/* ===== SEKCJA: LOKALIZACJA I OPIS ===== */}
      <section className="mb-16 sm:mb-20">
        <header className="mb-8 sm:mb-10">
          <Title tag="h2">Lokalizacja</Title>
          <Line />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Treść — 3/5 szerokości */}
          <div className="lg:col-span-3 space-y-6">
            {courseInfo?.description && (
              <div className="text-gray-700 dark:text-gray-300 leading-7 text-base sm:text-lg">
                <MarkdownText text={courseInfo.description} />
              </div>
            )}

            {/* Karty kontaktowe — bardziej zwarte */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {courseInfo?.emailHotel && (
                <InfoCard icon={EnvelopeOpenIcon} label="E-mail">
                  <a
                    href={`mailto:${courseInfo.emailHotel}`}
                    className="text-primary hover:underline break-all text-sm"
                  >
                    {courseInfo.emailHotel}
                  </a>
                </InfoCard>
              )}

              {courseInfo?.phone && (
                <InfoCard icon={PhoneIcon} label="Telefon">
                  <a
                    href={`tel:${courseInfo.phone.replace(/\s/g, "")}`}
                    className="text-primary hover:underline text-sm"
                  >
                    {courseInfo.phone}
                  </a>
                </InfoCard>
              )}

              {courseInfo?.password && (
                <InfoCard
                  icon={InformationCircleIcon}
                  label="Hasło na rezerwację"
                  className="sm:col-span-2"
                >
                  <span className="text-base font-bold tracking-wide text-gray-900 dark:text-gray-100">
                    {courseInfo.password}
                  </span>
                </InfoCard>
              )}
            </div>
          </div>

          {/* Obrazek — 2/5 szerokości, ograniczona wysokość */}
          {hotelImage && (
            <div className="lg:col-span-2 lg:sticky lg:top-8 self-start">
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800 h-full min-h-[240px]">
                <GatsbyImage
                  image={hotelImage}
                  alt={courseInfo?.hotelName || "Hotel"}
                  className="w-full h-full object-cover"
                  objectFit="cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== SEKCJA: KOSZT I PŁATNOŚCI ===== */}
      {/* ===== SEKCJA: KOSZT I PŁATNOŚCI ===== */}
      <section className="mb-16 sm:mb-20">
        <header className="mb-8 sm:mb-10">
          <Title tag="h2">Warunki uczestnictwa i płatności</Title>
          <Line />
        </header>

        <div className="space-y-10">
          {/* Ceny zakwaterowania */}
          {courseInfo?.hotelprice && courseInfo.hotelprice.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Ceny zakwaterowania
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courseInfo.hotelprice.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                      <BanknotesIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      {item.room}
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                        {item.price}
                      </span>
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        zł
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {courseInfo.additionalInformation && (
                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700">
                  <InformationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{courseInfo.additionalInformation}</span>
                </div>
              )}
            </div>
          )}

          {/* Co obejmuje opłata za kurs */}
          {hotelInfo?.conditionsOfParticipation && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ClipboardDocumentIcon className="w-5 h-5 text-primary" />
                Co obejmuje opłata za kurs
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <StyledMarkdown>
                  {hotelInfo.conditionsOfParticipation}
                </StyledMarkdown>
              </div>
            </div>
          )}

          {/* Dane bankowe + obrazek hotelu */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <BankDetails
                company={company}
                courseNumber={course?.numerCourse}
              />
            </div>
            <div className="lg:col-span-2">
              {hotelPicture && (
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800 h-full min-h-[240px]">
                  <GatsbyImage
                    image={hotelPicture}
                    alt="Zdjęcie hotelu"
                    className="w-full h-full"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dodatkowe info o płatnościach */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium">
                  Prosimy o dokonywanie wpłat z uwzględnieniem w tytule „Kurs nr{" "}
                  {course?.numerCourse}" oraz czego dotyczą.
                </p>
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  Liczba miejsc na kursie jest ograniczona — prosimy o jak
                  najszybsze dokonanie wpłaty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEKCJA: DODATKI ===== */}
      {hotelInfo?.extras && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <StyledMarkdown>{hotelInfo.extras}</StyledMarkdown>
        </div>
      )}
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
        description
        emailHotel
        password
        phone
        hotelprice {
          price
          room
        }
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
      bankAccount
    }
  }
`

export const Head = () => <Seo title="O kursie" />

export default CourseDetails
