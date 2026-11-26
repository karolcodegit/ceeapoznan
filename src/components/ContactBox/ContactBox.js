import React from "react"
import { PhoneIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline"
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
  const hasRegistry = Boolean(regon || nip || krs)

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900">
      {(name || degree) && (
        <div className="min-w-0">
          {name && (
            <h3 className="text-base font-bold leading-snug text-[#002C7C] dark:text-sky-300 sm:text-lg">
              {name}
            </h3>
          )}
          {degree && (
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {degree}
            </p>
          )}
        </div>
      )}

      {(phone || secondPhone || email) && (
        <ul className="space-y-2">
          {phone && (
            <li className="flex items-center gap-2.5">
              <PhoneIcon
                className="h-4 w-4 shrink-0 text-[#0C6478] dark:text-sky-400"
                aria-hidden="true"
              />
              <a
                href={`tel:${phone}`}
                className="truncate text-sm font-medium text-slate-800 underline-offset-2 hover:underline dark:text-slate-100"
              >
                {phone}
              </a>
            </li>
          )}
          {secondPhone && (
            <li className="flex items-center gap-2.5">
              <PhoneIcon
                className="h-4 w-4 shrink-0 text-[#0C6478] dark:text-sky-400"
                aria-hidden="true"
              />
              <a
                href={`tel:${secondPhone}`}
                className="truncate text-sm font-medium text-slate-800 underline-offset-2 hover:underline dark:text-slate-100"
              >
                {secondPhone}
              </a>
            </li>
          )}
          {email && (
            <li className="flex items-center gap-2.5">
              <EnvelopeIcon
                className="h-4 w-4 shrink-0 text-[#0C6478] dark:text-sky-400"
                aria-hidden="true"
              />
              <a
                href={`mailto:${email}`}
                className="truncate text-sm font-medium text-slate-800 underline-offset-2 hover:underline dark:text-slate-100"
              >
                {email}
              </a>
            </li>
          )}
        </ul>
      )}

      {place && (
        <div className="flex items-start gap-2.5">
          <HomeIcon
            className="mt-0.5 h-4 w-4 shrink-0 text-[#0C6478] dark:text-sky-400"
            aria-hidden="true"
          />
          <div className="text-sm leading-snug text-slate-800 dark:text-slate-100">
            <p className="font-medium">{place}</p>
            {place2 && <p className="text-slate-600 dark:text-slate-300">{place2}</p>}
          </div>
        </div>
      )}

      {account && (
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/70">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Numer konta
          </p>
          <CopyToClipboardWithNotification text={account}>
            <span className="mt-1 block break-all font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-200 sm:text-sm">
              {account}
            </span>
          </CopyToClipboardWithNotification>
        </div>
      )}

      {hasRegistry && (
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-700">
          {regon && (
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                REGON
              </dt>
              <dd className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {regon}
              </dd>
            </div>
          )}
          {nip && (
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                NIP
              </dt>
              <dd className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {nip}
              </dd>
            </div>
          )}
          {krs && (
            <div className="col-span-2">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                KRS
              </dt>
              <dd className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {krs}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}

export default ContactBox
