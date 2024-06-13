import React from "react"
import { FaPhone, FaEnvelope, FaHome } from "react-icons/fa"
import Title from "../Title/Title"
import CopyToClipboardWithNotification from "../CopyToClipboardWithNotification/CopyToClipboardWithNotification"

const ContactBox = ({
  name,
  phone,
  secondPhone,
  email,
  account,
  degree,
  regon,
  nip,
  krs,
  place,
  place2,
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-10 rounded-2xl flex flex-col h-auto">
      <Title tag="h5">{name}</Title>
      {degree && (
        <span className="font-normal py-1 dark:text-gray-300">{degree}</span>
      )}

      <div className="flex flex-col h-auto">
        {phone && (
          <div className="flex items-center pt-6 pb-3 dark:text-gray-100">
            <FaPhone />
            <a href={`tel:${phone}`} className="ml-2">
              {phone}
            </a>
          </div>
        )}
        {secondPhone && (
          <div className="flex items-center pb-3 dark:text-gray-100">
            <FaPhone />
            <a href={`tel:${secondPhone}`} className="ml-2">
              {secondPhone}
            </a>
          </div>
        )}
        {place && (
          <div className="flex items-center pb-3 dark:text-gray-100">
            <FaHome />
            <span className="ml-2">{place}</span>
          </div>
        )}
        {place2 && (
          <div className="flex items-center pb-3 dark:text-gray-100">
            <span className="ml-6">{place2}</span>
          </div>
        )}

        {email && (
          <div className="flex items-center dark:text-gray-100">
            <FaEnvelope />
            <a
              href={`mailto:${email}`}
              className="text-cyan-800 dark:text-gray-100 ml-2"
            >
              {email}
            </a>
          </div>
        )}
        {account && (
          <div className="flex items-center py-1 pt-6 dark:text-gray-100">
            <span className="font-normal">
              Numer konta bankowego:
              <CopyToClipboardWithNotification text={account}>
                <span style={{ display: "block" }}>{account}</span>
              </CopyToClipboardWithNotification>
            </span>
          </div>
        )}
        {regon && (
          <span className="font-normal py-1 dark:text-gray-100">
            REGON: {regon}
          </span>
        )}
        {nip && (
          <span className="font-normal py-1 dark:text-gray-100">
            NIP: {nip}
          </span>
        )}
        {krs && (
          <span className="font-normal py-1 dark:text-gray-100">
            KRS: {krs}
          </span>
        )}
      </div>
    </div>
  )
}

export default ContactBox
