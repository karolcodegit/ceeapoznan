import React from 'react'
import Title from '../../components/Title/Title'
import Paragraph from '../../components/Paragraph/Paragraph'
import { Link } from 'gatsby'

const wyslano = () => {
    return (
        <div className="text-center p-12 font-sans">
          <Title tag='h1' className="text-4xl text-green-600 font-bold mb-4">Dziękujemy za przesłanie formularza!</Title>
          <Paragraph className="text-lg text-gray-700 mb-6">
            Twój formularz został pomyślnie wysłane. Odpowiemy na wiadomość najszybciej jak to możliwe.
          </Paragraph>
          <img
            src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
            alt="Funny cat"
            className="w-72 mx-auto mb-6"
          />
          <p className="text-sm text-gray-500">
            W międzyczasie możesz wrócić na{' '}
            <Link to="/" className="text-green-500 hover:underline">
              stronę główną
            </Link>.
          </p>
        </div>
      )
}

export default wyslano