import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import FormRegister from "../components/Form/FormRegister"

// Strona rejestracji: wybiera aktywny kurs z DatoCMS i renderuje formularz.
// Logika formularza: components/Form/FormRegister.js (zapis → Cloud Run → Supabase)
const Rejestracja = ({ data }) => {
  const availableCourse =
    data.allDatoCmsCourse.nodes.find(c => c.available === true) || null

  return (
    <div className="max-w-6xl mx-auto">
      <FormRegister data={data} availableCourse={availableCourse} />
    </div>
  )
}

export const query = graphql`
  query registerForm {
    allDatoCmsRegisterform {
      nodes {
        positioncheckbox {
          price
          label
          id
          available
        }
        dish {
          dish
        }
      }
    }
    allDatoCmsCourse {
      nodes {
        originalId
        courseCost
        available
        courseDuration
        nameCourse
      }
    }
  }
`

export const Head = () => <Seo title="Rejestracja na kurs" />

export default Rejestracja
