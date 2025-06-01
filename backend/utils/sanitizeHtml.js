function sanitizeHtml(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

module.exports = { sanitizeHtml };