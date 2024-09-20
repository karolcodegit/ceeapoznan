import React from "react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

import Markdown from "react-markdown"

const markdownStyles = css`
  ol > li {
    list-style: decimal;
    margin-left: 2rem;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => (theme.mode === 'dark' ? "#d1d5db" : "black")};
    line-height: 3rem;
  }
  ul > li {
    list-style: disc;
    margin-left: 2rem;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => (theme.mode === "dark" ? "#d1d5db" : "black")} !important;
    line-height: 3rem;
  }

  p {
    line-height: 3rem;
  }
  a {
    font-weight: bold;
    color: ${({ theme }) => (theme.mode === 'dark' ? '#4267B2' : 'black')};
    text-decoration: underline;
  }
`

const MarkdownStyles = styled.div`
  ${markdownStyles}
`

const StyledMarkdown = ({ children }) => (
  <MarkdownStyles>
    <Markdown className="dark:text-gray-200 ">{children}</Markdown>
  </MarkdownStyles>
)

export default StyledMarkdown
