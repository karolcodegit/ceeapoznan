import React from "react"
import { graphql } from "gatsby"
import { useLocation } from "@reach/router"
import { menuLinks, otherLinks, przydatneLinki } from "../components/Menu"
import Seo from "../components/seo"
import FormRegister from "../components/Form/FormRegister"

const Rejestracja = ({ data }) => {
  // const location = useLocation()
  // const currentPath = location.pathname
  // const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  // const currentLink = allLinks.find(link => link.to === currentPath)

  const availableCourse = data.allDatoCmsCourse.nodes.find(
    course => course.available === true
  )

  return (
    <>
      <div className="">
        <div className="max-w-6xl mx-auto ">
          <FormRegister
            data={data}
            availableCourse={
              availableCourse || { nameCourse: "Bez nazwy kursu" }
            }
          />
        </div>
      </div>
    </>
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

export const Head = () => <Seo title="Rejestracja" />

export default Rejestracja
