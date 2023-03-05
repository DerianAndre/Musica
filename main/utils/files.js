const slugify = (string) => {
  if (!string) return '';
  return String(string)
    .toString()
    .toLowerCase()
    .replaceAll('ｃ', 'c') // TODO better way to do this...
    .replaceAll('ｄ', 'd')
    .replaceAll('ｅ', 'e')
    .replaceAll('ｈ', 'h')
    .replaceAll('ｏ', 'o')
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

module.exports = { slugify };
