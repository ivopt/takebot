import React from 'react'
import { NavLink, Link } from 'react-router-dom'

export const BSNavLink = (props) => (
  <NavLink className="nav-link" {...props}>{props.children}</NavLink>
)

export const BSBrand = (props) => (
  <Link className="navbar-brand" {...props}>{props.children}</Link>
)

const buttonVariants = {
  "": "btn-primary",
  undefined: "btn-primary",

  primary: "btn-primary",
  secondary: "btn-secondary",
  success: "btn-success",
  warning: "btn-warning",
  danger: "btn-danger",
  info: "btn-info",
  light: "btn-light",
  dark: "btn-dark",
  link: "btn-link",
}

export const BSLinkButton = (props) => {
  const extraClassNames = props.className
  const variant = buttonVariants[props.variant]
  return (
    <Link {...props} className={`btn ${variant} ${extraClassNames}`}>{props.children}</Link>
  )
}
