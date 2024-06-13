import React from 'react'

const Title = ({tag: Tag, children, white}) => {
  const titleClass = white ? 'text-gray-100' : 'text-dark'; 
    switch(Tag){
      case 'h1': return <Tag className={`${titleClass} text-5xl max-lg:text-4xl max-md:text-3xl font-bold dark:text-white`}>{children}</Tag>;
      case 'h2': return <Tag className={`${titleClass} text-4xl max-lg:text-3xl max-md:text-2xl font-bold dark:text-white`}>{children}</Tag>;
      case 'h3': return <Tag className={`${titleClass} text-3xl max-md:text-2xl font-bold dark:text-white`}>{children}</Tag>;
      case 'h4': return <Tag className={`${titleClass} text-2xl font-bold dark:text-white`}>{children}</Tag>;
      case 'h5': return <Tag className={`${titleClass} text-xl font-bold dark:text-white`}>{children}</Tag>;
      case 'h6': return <Tag className={`${titleClass} text-lg font-bold dark:text-white`}>{children}</Tag>;
      default: return <Tag className={`${titleClass} text-xl font-bold dark:text-white`}>{children}</Tag>;
  };
}
export default Title