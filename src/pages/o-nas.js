import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Paragraph from "../components/Paragraph/Paragraph"
import Seo from "../components/seo"
import {OfficialLetter} from '../components/OfficialLetter/OfficialLetter'

const AboutUs = ({ data }) => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <OfficialLetter />

      <div className="my-20 border-t border-gray-200 dark:border-gray-800" />

      {data.allDatoCmsAboutCompany.nodes[0].paragraph.map((para, index) => (
        <Paragraph
          key={index}
          firstLetter
          className={`relative pb-8 ${
            index % 2 === 0 ? "sm:pr-12" : "sm:pl-12"
          }`}
        >
          {para.picture && (
            <Img
              fluid={para.picture.fluid}
              className={`${
                index === 2
                  ? "mt-9 max-w-2xl max-md:max-w-xl max-sm:max-w-lg mx-auto mb-8"
                  : "sm:float-right max-sm:hidden w-60 md:w-72 lg:w-80 h-auto mx-4 py-4"
              } object-cover rounded-lg shadow-lg`}
              alt={para.picture.alt}
              loading="eager"
            />
          )}
          <span className="text-base leading-7 text-gray-700 dark:text-gray-300">
            {para.description}
          </span>
        </Paragraph>
      ))}
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
            fluid(maxWidth: 800) {
              ...GatsbyDatoCmsFluid
            }
          }
        }
      }
    }
  }
`
export const Head = () => <Seo title="O nas" />
export default AboutUs
