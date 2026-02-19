/**
 * Convertit le Markdown simple en HTML
 * Supporte : **gras**, *italique*, ***gras et italique***, <u>souligné</u>, ~~barré~~
 */
export function parseSimpleMarkdown(text: string): string {
  if (!text) return '';
  
  // Remplacer ***texte*** par <strong><em>texte</em></strong>
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  
  // Remplacer **texte** par <strong>texte</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Remplacer *texte* par <em>texte</em>
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Remplacer ~~texte~~ par <del>texte</del>
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
  
  // <u>texte</u> est déjà du HTML, pas besoin de le remplacer
  
  return text;
}
