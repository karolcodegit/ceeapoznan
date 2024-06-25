import React from "react"
import Img from "gatsby-image"
import Title from "../Title/Title"
import Paragraph from "../Paragraph/Paragraph"

const Box = ({ image, title, description }) => {
  return (
    <>
      <div className="h-auto transition duration-500 ease-in-out transform lg:hover:scale-110">
        <div className="max-w-full max-h-full">
          <div className="h-96 w-full relative z-0">
          <Img
              className="rounded-2xl object-cover h-full w-full overflow-clip z-0"
              fluid={image}
              alt={title}
              loading="eager"
            />
          </div>
          <div className="py-8">
            <Title tag="h5">{title}</Title>
            <Paragraph>{description}</Paragraph>
          </div>
        </div>
      </div>
    </>
  )
}

export default Box
