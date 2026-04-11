import yaml from 'js-yaml';

export function parseMD(contenido) {
  const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = contenido.match(regex);
  if (!match) return { frontmatter: {}, body: contenido.trim() };
  return {
    frontmatter: yaml.load(match[1]) || {},
    body: match[2].trimStart() // 👈 elimina salto de línea inicial
  };
}

export function generarMarkdown(frontmatter, contenido) {
  const yamlContent = yaml.dump(frontmatter, { defaultStyle: null, lineWidth: -1 });
  // 👇 Usamos yamlContent y quitamos el salto extra
  return `---\n${yamlContent}---\n${contenido.trim()}`
}

export function limpiarImagen(valor) {
  if (!valor) return null;
  return valor.toString().replace(/^"|"$/g, '').replace(/^\[\[(.+?)\]\]$/, '$1');
}