import React, { useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeAddClasses from 'rehype-add-classes';

export const MarkdownText = ({ text }) => {
  const modifiedText = useMemo(() => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      const isListItem = /^\s*[*\-+]\s+|^\s*\d+\.\s+/.test(line);
      const isNextLineListItem = index < lines.length - 1 && /^\s*[*\-+]\s+|^\s*\d+\.\s+/.test(lines[index + 1]);

      if (isListItem || isNextLineListItem) 
        return line;
      
      if(line.trim() === '\\')
        return line.replace('\\', '&nbsp;\n');

      return line + '&nbsp;\n';
    }).join('\n');
  }, [text]);

  return (
    <ReactMarkdown
      rehypePlugins={[
        rehypeRaw,
        rehypeSanitize,
        [rehypeAddClasses, { img: 'custom-image' }]  // Dodanie klasy do obrazów
      ]}
    >
      {modifiedText}
    </ReactMarkdown>
  );
};