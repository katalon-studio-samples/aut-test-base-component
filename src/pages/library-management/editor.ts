// Preview clones markup and removes anything outside the supported editor vocabulary.
export function cleanAnnouncement(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const allowed = new Set([
    "P",
    "BR",
    "STRONG",
    "B",
    "EM",
    "I",
    "UL",
    "OL",
    "LI",
    "DIV",
  ]);
  const visit = (root: DocumentFragment | Element) => {
    for (const child of [...root.children]) {
      if (
        ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "IMG", "SVG"].includes(
          child.tagName,
        )
      ) {
        child.remove();
        continue;
      }
      visit(child);
      for (const attr of [...child.attributes])
        child.removeAttribute(attr.name);
      if (!allowed.has(child.tagName)) child.replaceWith(...child.childNodes);
    }
  };
  visit(template.content);
  return template.innerHTML;
}
