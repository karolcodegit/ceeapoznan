// src/pages/koszyk/wyslane.js — potwierdzenie zamówienia (transfer | tpay)
import React from "react"
import { Link } from "gatsby"
import Title from "../../components/Title/Title"
import Paragraph from "../../components/Paragraph/Paragraph"

const Wyslane = ({ location }) => {
  const params = new URLSearchParams(location?.search || "")
  const method = params.get("metoda") // 'tpay' | 'transfer'
  const order = params.get("zamowienie")
  const isOnline = method === "tpay"

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <Title tag="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {isOnline ? "Płatność potwierdzona!" : "Dziękujemy za zamówienie!"}
      </Title>

      {order && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Numer zamówienia:{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">{order}</span>
        </p>
      )}

      <Paragraph className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        {isOnline
          ? "Twoja płatność została zaksięgowana. Książki wyślemy najszybciej, jak to możliwe – potwierdzenie wysyłki otrzymasz mailem."
          : "Twoje zamówienie zostało przyjęte. Na Twój adres email wysłaliśmy dane do przelewu – po zaksięgowaniu wpłaty przystępujemy do wysyłki. Sprawdź także folder spam."}
      </Paragraph>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
          Strona główna
        </Link>
        <Link to="/ksiazki" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
          Kontynuuj przeglądanie
        </Link>
      </div>
    </div>
  )
}

export default Wyslane
