import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormField from "./FormField/FormField"
import { updateField, resetForm } from "../../store/RegisterForm/formSlice"
import Form from "./Form"
import Title from "../Title/Title"
import SideInfoPanel from "../SideInfoPanel/SideInfoPanel"
import { CheckboxOption } from "./CheckboxOption/CheckboxOption"
import FormRadioGroup from "./FormRadioGroup/FormRadioGroup"
import { FormList } from "./FormList/FormList"
import Paragraph from "../Paragraph/Paragraph"
import { prepareRegistrationData } from "../../utils/prepareRegistrationData"
import { handleRegisterSubmit } from "../../utils/handleRegisterSubmit"
import { changeDate } from "../../utils/changeDate"
import PaymentMethodSelector from "../PaymentMethodSelector/PaymentMethodSelector"
import { getPaymentFee } from "../../utils/payment"

const BANK_ACCOUNT = "47 1140 2004 0000 3202 8319 5381"

const TPAY_ENABLED = process.env.GATSBY_TPAY_ENABLED === "true"

const FormRegister = ({
  data = { allDatoCmsRegisterform: { nodes: [] } },
  buttonText = "Zapisz na kurs",
  availableCourse,
}) => {
  const dispatch = useDispatch()
  const formData = useSelector(state => state.formRegister || {})
  const [token, setToken] = useState("")

  const paymentMethod = formData.paymentMethod || (TPAY_ENABLED ? "tpay" : "transfer")
  const wantsInvoice = !!formData.wantsInvoice

  useEffect(() => {
    setToken(Math.random().toString(36).substring(2))
  }, [])

  const registerFormNode = data?.allDatoCmsRegisterform?.nodes?.[0]

  const safeCourse = useMemo(
    () =>
      availableCourse || {
        nameCourse: "Brak aktywnego kursu",
        courseCost: 0,
        courseDuration: "Nie określono",
      },
    [availableCourse]
  )

  // Opcje dodatkowe (z DatoCMS) – stabilna referencja dla useMemo/useEffect
  const checkboxFields = useMemo(
    () =>
      (registerFormNode?.positioncheckbox || [])
        .filter(
          item =>
            item && item.label && item.price !== undefined && item.price !== null
        )
        .map((item, index) => ({
          id: item.id || `option-${index}`,
          name: `option${index + 1}`,
          label: `${item.label} (${item.price} PLN)`,
          price: item.price,
          disabled: !item.available,
        })),
    [registerFormNode]
  )

  const dishOptions = useMemo(
    () =>
      registerFormNode?.dish?.filter(d => d?.dish)?.map(d => d.dish) || [],
    [registerFormNode]
  )

  // 💰 JEDNO źródło prawdy dla kwot: kurs + opcje (bez opłaty)
  const baseAmount = useMemo(() => {
    const base = parseFloat(safeCourse.courseCost || 0)
    const options = checkboxFields.reduce(
      (sum, field) => (formData[field.name] ? sum + field.price : sum),
      0
    )
    return base + options
  }, [safeCourse, checkboxFields, formData])

  const paymentFee = getPaymentFee(baseAmount, paymentMethod)
  const total = Math.round((baseAmount + paymentFee) * 100) / 100

  // Dane kursu + domyślna metoda płatności do Redux (walidacja Form czyta stan!)
  useEffect(() => {
    dispatch(updateField({ form: "formRegister", field: "baseCourseCost", value: safeCourse.courseCost }))
    dispatch(updateField({ form: "formRegister", field: "courseTitle", value: safeCourse.nameCourse }))
    dispatch(updateField({ form: "formRegister", field: "courseId", value: safeCourse.originalId }))
    dispatch(updateField({ form: "formRegister", field: "paymentMethod", value: paymentMethod }))
    dispatch(updateField({ form: "formRegister", field: "total", value: total }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, safeCourse, baseAmount, paymentMethod])

  // Early return – po wszystkich hookach!
  if (!registerFormNode || !registerFormNode.positioncheckbox) {
    return (
      <div className="py-20 text-center max-w-6xl mx-auto">
        <Title tag="h3" className="text-2xl font-bold">
          Formularz rejestracyjny tymczasowo niedostępny
        </Title>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Skontaktuj się z organizatorem kursu.
        </p>
      </div>
    )
  }

  const handleSubmitOverride = async e => {
    e.preventDefault()
    await handleRegisterSubmit({
      ...formData,
      token,
      paymentMethod,
      paymentFee,
      baseAmount,
      total,
    })
  }

  return (
    <div className="py-10 max-w-6xl mx-auto gap-12 flex flex-col xl:flex-row justify-between items-start">
      <div className="max-w-3xl w-full xl:w-2/3">
        <Title tag="h1" className="text-3xl sm:text-4xl">
          Formularz rejestracyjny
        </Title>
        <Title tag="h5" className="mt-4 text-lg sm:text-xl">
          Kurs:{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {safeCourse.nameCourse}
          </span>
        </Title>

        <Form
          requireToken
          onSubmitOverride={handleSubmitOverride}
          submitButtonText={
            paymentMethod === "tpay" ? "Opłać i zapisz na kurs" : buttonText
          }
          variant="submit"
          notificationMessage="Formularz został wysłany!"
          clearAction={resetForm}
          formSliceKey="formRegister"
          prepareFormData={prepareRegistrationData}
          addToButton="float-right"
          requiredFields={[
            "firstName",
            "surName",
            "street",
            "numberHome",
            "zipCode",
            "city",
            "phone",
            "birthday",
            "email",
            "profession",
            "npwz",
            "specjalist",
            "specialist2",
            "lastcourse",
            "paymentMethod",
          ]}
          dynamicRequiredFields={() => (wantsInvoice ? ["invoiceNip"] : [])}
        >
          <input type="hidden" name="token" value={token} />

          <FormField type="text" label="Imię" name="firstName" formSliceKey="formRegister" required />
          <FormField type="text" label="Nazwisko" name="surName" formSliceKey="formRegister" required />
          <FormField type="text" label="Ulica" name="street" formSliceKey="formRegister" required />
          <FormField type="text" label="Numer domu" name="numberHome" formSliceKey="formRegister" required />
          <FormField type="text" label="Kod pocztowy" name="zipCode" formSliceKey="formRegister" required />
          <FormField type="text" label="Miasto" name="city" formSliceKey="formRegister" required />
          <FormField type="phone" label="Numer telefonu" name="phone" formSliceKey="formRegister" required />
          <FormField
            type="date"
            label="Data urodzenia"
            name="birthday"
            formSliceKey="formRegister"
            required
            onBlur={e => {
              const value = e.target.value
              const formatted = changeDate(value)
              dispatch(updateField({ form: "formRegister", field: "birthday", value: changeDate(formatted) }))
            }}
          />
          <FormField type="email" name="email" label="Adres email" formSliceKey="formRegister" required />
          <FormField type="number" label="Ile lat w zawodzie?" name="profession" formSliceKey="formRegister" required />
          <FormField type="number" label="Numer Prawa Wykonywania Zawodu (NPWZ)" name="npwz" formSliceKey="formRegister" required />

          <FormRadioGroup
            label="Jestem w trakcie specjalizacji z anestezjologii i intensywnej terapii"
            name="specjalist"
            options={["tak", "nie"]}
            required
            formSliceKey="formRegister"
          />
          <FormRadioGroup
            label="Jestem specjalistą anestezjologii i intensywnej terapii"
            name="specialist2"
            options={["tak", "nie"]}
            required
            formSliceKey="formRegister"
          />
          <FormRadioGroup
            label="Czy bieżący kurs jest ostatnim z cyklu kursów CEEA?"
            name="lastcourse"
            options={["tak", "nie"]}
            required
            formSliceKey="formRegister"
          />

          {/* Faktura – pola tylko po zaznaczeniu */}
          <div className="pt-6">
            <CheckboxOption
              label="Potrzebuję faktury VAT – pokaż pola danych do faktury"
              name="wantsInvoice"
              formSliceKey="formRegister"
            />
          </div>

          {wantsInvoice && (
            <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 p-5">
              <Title tag="h5">Dane do faktury</Title>
              <FormField type="text" label="Nazwa firmy/imię i nazwisko" name="invoiceName" formSliceKey="formRegister" />
              <FormField type="text" label="Ulica" name="invoiceStreet" formSliceKey="formRegister" />
              <FormField type="text" label="Numer domu" name="invoiceNumberHome" formSliceKey="formRegister" />
              <FormField type="text" label="Kod pocztowy" name="invoiceZipCode" formSliceKey="formRegister" />
              <FormField type="text" label="Miasto" name="invoiceCity" formSliceKey="formRegister" />
              <FormField type="text" label="NIP" name="invoiceNip" formSliceKey="formRegister" required={wantsInvoice} />
            </div>
          )}

          <FormList
            name="ocenaKursu"
            label="Rok specjalizacji"
            options={["1", "2", "3", "4", "5"]}
            placeholder="Nie dotyczy"
            formSliceKey="formRegister"
          />
          {dishOptions.length > 0 && (
            <FormList
              name="dishes"
              label="Wybierz danie"
              options={dishOptions}
              placeholder="Proszę wybrać dania"
              formSliceKey="formRegister"
            />
          )}

          <div className="pt-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3 mb-3">
              Dodatkowe opcje
            </label>
            {checkboxFields.map(field => (
              <CheckboxOption
                key={field.id}
                name={field.name}
                label={field.label}
                disabled={field.disabled}
                formSliceKey="formRegister"
              />
            ))}
          </div>

          <PaymentMethodSelector
            name="paymentMethod"
            value={paymentMethod}
            onChange={e =>
              dispatch(updateField({ form: "formRegister", field: "paymentMethod", value: e.target.value }))
            }
          />

          {paymentMethod === "transfer" && (
            <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold mb-1">Dane do przelewu:</p>
              <p>Europejska Fundacja ds. Szkolenia w Anestezjologii</p>
              <p>ul. Sokolnicka 56, 62-021 Paczkowo</p>
              <p>
                Numer konta: <span className="font-medium">{BANK_ACCOUNT}</span>
              </p>
              <p className="mt-1">
                Tytuł: „{formData.firstName} {formData.surName} – kurs {safeCourse.nameCourse}"
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Pełny tytuł z numerem zamówienia otrzymasz w mailu potwierdzającym.
              </p>
            </div>
          )}

          <div className="pt-14">
            <Title tag="h5">Zgody na przetwarzanie danych osobowych:</Title>
            <Paragraph>
              Zgoda na przetwarzanie danych osobowych jest dobrowolna, ale niezbędna
              do udziału w kursie. Zgoda może być w każdej chwili wycofana. Wycofanie
              zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano
              na podstawie zgody przed jej wycofaniem. Wycofanie zgody może nastąpić
              poprzez wysłanie wiadomości na adres
            </Paragraph>
            <CheckboxOption
              label="Nie wyrażam zgody na utrwalanie wizerunku podczas Kursu (zdjęcia, nagrania)."
              name="wyrazamZgode"
              formSliceKey="formRegister"
            />
          </div>

          <div className="pt-14">
            <Title tag="h3">Uwaga</Title>
            <Paragraph>
              Potwierdzenie rejestracji oraz faktura za udział w kursie zostaną
              przesłane na wskazany adres mailowy po opłaceniu{" "}
              {paymentMethod === "tpay"
                ? "kosztów udziału w kursie online"
                : "przelewem kosztów udziału w kursie"}
              .
            </Paragraph>
          </div>
        </Form>
      </div>

      <div className="w-full xl:w-1/3 lg:w-2/3 mx-auto mt-10 xl:mt-0 xl:sticky xl:top-20 xl:right-0 xl:max-h-[calc(100vh-15vh)]">
        <SideInfoPanel
          money={total}
          paymentFee={paymentFee}
          time={availableCourse?.courseDuration}
          available={availableCourse ? "Dostępny" : "Niedostępny"}
        />
      </div>
    </div>
  )
}

export default FormRegister
