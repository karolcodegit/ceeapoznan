import React from "react"
import { PhoneIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline";
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
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl flex flex-col space-y-6">
  {/* Nagłówek */}
  <div>
    <Title tag="h4" className="text-2xl font-bold dark:text-white">
      {name}
    </Title>
    {degree && (
      <span className="block text-sm text-gray-600 dark:text-gray-300 mt-2">
        {degree}
      </span>
    )}
  </div>

  {/* Sekcja kontaktowa */}
  <div className="space-y-4">
    {phone && (
      <div className="flex items-center space-x-4">
        <PhoneIcon className="h-6 w-6 text-blue-500 dark:text-gray-100" />
        <a href={`tel:${phone}`} className="text-gray-800 dark:text-gray-100 text-sm font-medium">
          {phone}
        </a>
      </div>
    )}
    {secondPhone && (
      <div className="flex items-center space-x-4">
        <PhoneIcon className="h-6 w-6 text-blue-500 dark:text-gray-100" />
        <a href={`tel:${secondPhone}`} className="text-gray-800 dark:text-gray-100 text-sm font-medium">
          {secondPhone}
        </a>
      </div>
    )}
    {email && (
      <div className="flex items-center space-x-4">
        <EnvelopeIcon className="h-6 w-6 text-blue-500 dark:text-gray-100" />
        <a
          href={`mailto:${email}`}
          className="text-gray-800 dark:text-gray-100 text-sm font-medium"
        >
          {email}
        </a>
      </div>
    )}
  </div>

  {/* Adres */}
  {place && (
    <div className="space-y-1">
      <div className="flex items-center space-x-4">
        <HomeIcon className="h-6 w-6 text-blue-500 dark:text-gray-100" />
        <span className="text-gray-800 dark:text-gray-100 text-sm font-medium">
          {place}
        </span>
      </div>
      {place2 && (
        <div className="pl-10">
          <span className="text-gray-800 dark:text-gray-100 text-sm">{place2}</span>
        </div>
      )}
    </div>
  )}

  {/* Konto bankowe */}
  {account && (
    <div className="space-y-2">
      <span className="block text-gray-800 dark:text-gray-100 text-sm font-medium">
        Numer konta bankowego:
      </span>
      <CopyToClipboardWithNotification text={account}>
        <span className="block text-gray-600 dark:text-gray-300 text-sm font-mono">
          {account}
        </span>
      </CopyToClipboardWithNotification>
    </div>
  )}

  {/* Pozostałe informacje */}
  <div className="grid grid-cols-2 gap-4">
    {regon && (
      <div>
        <span className="block text-gray-600 dark:text-gray-100 text-sm">REGON:</span>
        <span className="block text-gray-800 dark:text-gray-100 text-sm font-medium">
          {regon}
        </span>
      </div>
    )}
    {nip && (
      <div>
        <span className="block text-gray-600 dark:text-gray-100 text-sm">NIP:</span>
        <span className="block text-gray-800 dark:text-gray-100 text-sm font-medium">
          {nip}
        </span>
      </div>
    )}
    {krs && (
      <div>
        <span className="block text-gray-600 dark:text-gray-100 text-sm">KRS:</span>
        <span className="block text-gray-800 dark:text-gray-100 text-sm font-medium">
          {krs}
        </span>
      </div>
    )}
  </div>
</div>
  )
}

export default ContactBox
