const slugify = (text) => {
  const polishDiacriticsMap = {
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    'ó': 'o',
    'ś': 's',
    'ź': 'z',
    'ż': 'z',
  };

    return (text || "")
      .toString()
      .toLowerCase()
      .trim()  // Usuwamy początkowe i końcowe spacje
      .replace(/[ąćęłńóśźż]/g, match => polishDiacriticsMap[match] || match)  // Zamiana polskich znaków
      .replace(/\s+/g, '_') // Replace spaces with -
      .replace(/[^\w]+/g, '') // Remove all non-word chars
      .replace(/\+/g, '_') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }
  
  module.exports = { slugify };