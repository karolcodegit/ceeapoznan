import React, { useState } from "react"
import { graphql } from "gatsby"
import Book from "../components/Book/Book"
import Seo from "../components/seo"
import Input from "../components/Input/Input"
import Label from "../components/Label/Label"

const Books = ({ data }) => {
  const {
    allDatoCmsBook: { nodes },
  } = data

  const [inputValue, setInputValue] = useState("")

  const handleInputChange = e => {
    setInputValue(e.target.value)
  }

  const searchBooks = (books, query) => {
    return books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase())
    )
  }
  const filtredBooks = searchBooks(nodes, inputValue)
  return (
    <>
      <div>
        {/* <p>
          W celu zamówienia książki prosimy o kontakt mailowy z <b> dr Natalią
          Znojkiewicz </b> - dane kontaktowe w zakładce "Kontakt". Przy składaniu
          zamówienia prosimy o podanie numeru telefonu, adresu mailowego oraz
          adresu do wysyłki - w przypadku zamawiania do Paczkomatu InPost
          prosimy o podanie numeru paczkomatu.
        </p> */}
      </div>
      <div className="flex justify-end py-20">
     
        <div className="mr-4">
          <Label name="Wyszukiwarka: " />
        </div>
        <Input
          label="Wyszukiwarka:"
          type="text"
          name="name"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      {filtredBooks.map(book => (
        <Book key={book.title} {...book} />
      ))}
    </>
  )
}

export const query = graphql`
  query MyQuery {
    allDatoCmsBook(sort: { year: DESC }) {
      nodes {
        title
        price
        publisher
        editor
        year
        covertype
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

export const Head = () => <Seo title="Książki" />

export default Books
