import React from "react"
import { graphql } from "gatsby"
import Title from "../components/Title/Title"
import Paragraph from "../components/Paragraph/Paragraph"
import FaqItem from "../components/FaqItem/FaqItem"
import Seo from "../components/seo"


const Faq = ({ data }) => {
  return (
    
    <div className="mx-auto px-4 md:px-0">
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-12 py-24">
        <div className="lg:col-span-5">
          <Title tag="h2">Częste pytania</Title>
          <Paragraph>
            Nie możesz znaleźć odpowiedzi, której szukasz? Skontaktuj się z
            naszym działem obsługi klienta.
          </Paragraph>
        </div>
        <div className="lg:col-span-7">
          <dl>
            {data.allDatoCmsFaq.nodes[0].questionanswer.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export const query = graphql`
  query faq {
    allDatoCmsFaq {
      nodes {
        questionanswer {
          question
          answer
        }
      }
    }
  }
`

export const Head = () => <Seo title="Faq" />

export default Faq
