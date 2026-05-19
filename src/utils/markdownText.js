import React, { useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeAddClasses from 'rehype-add-classes';

export const MarkdownText = ({ text }) => {
  const modifiedText = useMemo(() => {
    if (!text) return ""

    const lines = text.split('')
    const result = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Pusta linia – zachowaj jako separator
      if (trimmed === '') {
        result.push('')
        continue
      }

      // Jeśli to element listy markdown – nie dodawaj nic, zostaw czystą linię
      const isListItem = /^\s*[*\-+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)

      if (isListItem) {
        result.push(line)
        continue
      }

      // Jeśli następna linia to element listy – dodaj pustą linię przed (markdown wymaga separatora)
      const nextLine = lines[i + 1]
      const isNextListItem = nextLine && (/^\s*[*\-+]\s+/.test(nextLine) || /^\s*\d+\.\s+/.test(nextLine))

      if (isNextListItem) {
        result.push(line + '')
        continue
      }

      // Zwykła linia – dodaj podwójny enter dla nowego paragrafu w markdown
      // lub pojedynczy jeśli następna też jest zwykła (łączenie w paragraf)
      const nextTrimmed = nextLine ? nextLine.trim() : ''
      const isNextEmpty = nextTrimmed === ''

      if (isNextEmpty || i === lines.length - 1) {
        result.push(line)
      } else {
        // Sprawdź czy to nie jest kontynuacja tego samego paragrafu
        result.push(line + '  ') // 2 spacje = nowa linia w markdown
      }
    }

    return result.join('')
  }, [text])

  return (
    <ReactMarkdown
      rehypePlugins={[
        rehypeRaw,
        rehypeSanitize,
        [rehypeAddClasses, { img: 'custom-image' }]
      ]}
    >
      {modifiedText}
    </ReactMarkdown>
  )
}