import PropTypes from "prop-types"
import React from "react"
import "./footer.css"

const Footer = () => (
    <footer>
      © {new Date().getFullYear()} Daniel Matarazzo
    </footer>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
