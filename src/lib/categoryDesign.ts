import fs from 'node:fs';
import path from 'node:path';
import 'server-only';

const htmlFileBySlug: Record<string, string> = {
  'panoramic-glazing': 'panoramic-glazing.html',
  'facade-glazing': 'facade-glazing.html',
  'sliding-systems': 'sliding-systems.html',
  'custom-forms': 'custom-forms.html',
};

function sectionEnd(html: string, start: number) {
  const end = html.indexOf('</section>', start);
  return end === -1 ? -1 : end + '</section>'.length;
}

function sanitize(html: string, locale: string) {
  const prefix = locale === 'ru' ? '/ru' : '';

  return html
    .replaceAll('../assets/', '/assets/')
    .replaceAll('href="panoramic-glazing.html"', `href="${prefix}/catalog/panoramic-glazing"`)
    .replaceAll('href="facade-glazing.html"', `href="${prefix}/catalog/facade-glazing"`)
    .replaceAll('href="sliding-systems.html"', `href="${prefix}/catalog/sliding-systems"`)
    .replaceAll('href="custom-forms.html"', `href="${prefix}/catalog/custom-forms"`)
    .replaceAll('href="/#catalog"', 'href="#top"')
    .replace(/\sstyle="height:\s*807px"/g, '');
}

export function getCategoryDesignSections(slug: string, locale: string) {
  const file = htmlFileBySlug[slug];
  if (!file) return null;

  const html = fs.readFileSync(path.join(process.cwd(), 'public/catalog', file), 'utf8');
  const main = html.match(/<main id="top">([\s\S]*?)<\/main>/)?.[1];
  if (!main) return null;

  const projectsStart = main.search(/<section[^>]+id="projects"[\s\S]*?>/);
  const contactStart = main.search(/<section[^>]+id="contact"[\s\S]*?>/);
  if (projectsStart === -1 || contactStart === -1) return null;

  const projectsEnd = sectionEnd(main, projectsStart);
  const contactEnd = sectionEnd(main, contactStart);
  if (projectsEnd === -1 || contactEnd === -1) return null;

  return {
    beforeProjects: sanitize(main.slice(0, projectsStart), locale),
    betweenProjectsAndContact: sanitize(main.slice(projectsEnd, contactStart), locale),
    afterContact: sanitize(main.slice(contactEnd), locale),
  };
}
