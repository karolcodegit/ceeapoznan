import React from "react"
import { useLocation } from "@reach/router"
import { menuLinks, otherLinks, przydatneLinki } from "../Menu"

const Breadcrumbs = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  const links = allLinks.filter(link => currentPath.includes(link.to))

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {links.map((link, index) => (
          <li key={index}>
            <div className="flex items-center">
              {index !== 0 && (
                <svg
                  className="flex-shrink-0 h-5 w-5 text-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              <a
                href={link.to}
                className="text-dark font-medium dark:text-gray-100"
              >
                {link.title}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Breadcrumbs.propTypes = {
//   links: PropTypes.arrayOf(
//     PropTypes.shape({
//       text: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

export default Breadcrumbs
