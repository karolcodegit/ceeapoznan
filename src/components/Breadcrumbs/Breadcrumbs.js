import React from "react"
import { useLocation } from "@reach/router"
import { menuLinks, otherLinks, przydatneLinki } from "../Menu"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

const Breadcrumbs = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const allLinks = [...menuLinks, ...przydatneLinki, ...otherLinks]
  const links = allLinks.filter(link => currentPath.includes(link.to))

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {links.map((link, index) => (
          <li key={index} className="flex items-center dark:text-gray-200">
            {index !== 0 && (
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-2"
                aria-hidden="true"
              />
            )}
            {index === links.length - 1 ? (
              <span className="text-gray-800 dark:text-gray-200 font-semibold">
                {link.title}
              </span>
            ) : (
              <a
                href={link.to}
                className="text-gray-700 hover:text-blue-800 dark:text-blue-400 font-medium transition"
              >
                {link.title}
              </a>
            )}
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
