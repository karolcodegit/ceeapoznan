import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Paragraph from "../components/Paragraph/Paragraph"
import Seo from "../components/seo"

const AboutUs = ({ data }) => {
  return (
    <>
      <Paragraph firstLetter>
        <Img
          fluid={data.allDatoCmsAboutCompany.nodes[0].paragraph[0].picture.fluid}
          className="sm:float-right max-sm:hidden w-72 h-auto px-5 p-5"
          alt={data.allDatoCmsAboutCompany.nodes[0].paragraph[0].picture.alt}
          loading="eager"
        />
        {data.allDatoCmsAboutCompany.nodes[0].paragraph[0].description}
      </Paragraph>

      <Paragraph firstLetter>
         <Img
          fluid={data.allDatoCmsAboutCompany.nodes[0].paragraph[1].picture.fluid}
          className="sm:float-right max-sm:hidden w-60 h-auto px-5 p-5"
          alt={data.allDatoCmsAboutCompany.nodes[0].paragraph[1].picture.alt}
          loading="eager"
        />
        {data.allDatoCmsAboutCompany.nodes[0].paragraph[1].description}
      </Paragraph>

      <Paragraph firstLetter>
        {data.allDatoCmsAboutCompany.nodes[0].paragraph[2].description}
        
        <Img
          fluid={data.allDatoCmsAboutCompany.nodes[0].paragraph[2].picture.fluid}
          className="mt-9 max-w-2xl max-md:max-w-xl max-sm:max-w-lg mx-auto object-cover w-full"
          alt={data.allDatoCmsAboutCompany.nodes[0].paragraph[2].picture.alt}
          loading="eager"
        />
      </Paragraph>
    </>
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
