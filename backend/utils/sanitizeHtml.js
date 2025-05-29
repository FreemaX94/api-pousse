// supprime les balises <script> et tout leur contenu
function sanitize(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

module.exports = sanitize;
