import React from "react"

const FaqItem = ({ question, answer }) => {
  return (
    <div className="pb-10">
      <dt className="font-semibold text-gray-700 dark:text-gray-100">{question}</dt>
      <dd className="mt-2 leading-7 text-base text-gray-500 dark:text-gray-300">{answer}</dd>
    </div>
  )
}

export default FaqItem
