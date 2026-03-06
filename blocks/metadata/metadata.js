/**
 * Metadata block — reads key/value pairs from the block table
 * and promotes them to <meta> tags in the document <head>.
 * This enables getMetadata() to return values set in the page content.
 * @param {Element} block The metadata block element
 */
export default function decorate(block) {
  const meta = [...block.querySelectorAll(':scope > div')].reduce((acc, row) => {
    if (row.children.length >= 2) {
      const key = row.children[0].textContent.trim();
      const value = row.children[1].textContent.trim();
      if (key && value) acc[key] = value;
    }
    return acc;
  }, {});

  Object.entries(meta).forEach(([name, content]) => {
    const attr = name.includes(':') ? 'property' : 'name';
    if (!document.head.querySelector(`meta[${attr}="${name}"]`)) {
      const tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      tag.content = content;
      document.head.append(tag);
    }
  });

  // Set page title from metadata if present and not already set
  if (meta.title && !document.title) {
    document.title = meta.title;
  }

  block.remove();
}
