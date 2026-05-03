import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Paragraph from "../components/Paragraph/Paragraph"
import Seo from "../components/seo"
import {OfficialLetter} from '../components/OfficialLetter/OfficialLetter'

const AboutUs = ({ data }) => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <OfficialLetter />

      <div className="my-20 border-t border-gray-200 dark:border-gray-800" />

      {data.allDatoCmsAboutCompany.nodes[0].paragraph.map((para, index) => {
        const isFullWidth = index === 2;

        return (
          <div
            key={index}
            className={`mb-16
              ${isFullWidth 
                ? "flex flex-col gap-6 items-center" 
                : "grid gap-6 lg:gap-10 items-center md:grid-cols-2"
              }
            `}
          >
            {/* Obrazek */}
            {para.picture && (
              <div className={`
                ${isFullWidth 
                  ? "w-full order-1" 
                  : index % 2 === 0 
                    ? "md:order-2 flex justify-center" 
                    : "md:order-1 flex justify-center"
                }
              `}>
                <GatsbyImage
                  image={getImage(para.picture)}
                  className={`
                    rounded-xl shadow-lg
                    ${isFullWidth 
                      ? "w-full max-h-[500px] object-cover" 
                      : "w-full max-w-md object-cover"
                    }
                  `}
                  alt={para.picture.alt || "Zdjęcie"}
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
            )}

            {/* Tekst */}
            <div className={`
              ${isFullWidth 
                ? "order-2 w-full" 
                : index % 2 === 0 
                  ? "md:order-1" 
                  : "md:order-2"
              }
            `}>
              <Paragraph 
                firstLetter
                className="text-base leading-7 text-gray-700 dark:text-gray-300"
              >
                {para.description}
              </Paragraph>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export const query = graphql`
  query DatoCMSQuery {
    allDatoCmsAboutCompany {
      nodes {
        paragraph {
          description
          picture {
            alt
            gatsbyImageData(width: 800)
          }
        }
      }
    }
  }
`
export const Head = () => <Seo title="O nas" />
export default AboutUs