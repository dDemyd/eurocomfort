/**
 * Phase 0 — валідація контенту категорій проти Zod-схеми.
 *
 * Запуск: `node --experimental-strip-types scripts/validate-category-content.ts`
 * (Node ≥ 23.6 стрипає типи нативно; на Node 22 додайте прапор вручну.)
 *
 * Перевіряє, що кожен JSON у src/content/categories відповідає
 * CategoryContentSchema і що slug у файлі збігається з іменем файла.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CategoryContentSchema } from '../src/lib/categoryContent.ts';

const dir = join(fileURLToPath(new URL('.', import.meta.url)), '../src/content/categories');
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

let failed = 0;
for (const file of files) {
  const slug = basename(file, '.json');
  const raw = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  const result = CategoryContentSchema.safeParse(raw);

  if (!result.success) {
    failed++;
    console.error(`✗ ${file}`);
    for (const issue of result.error.issues) {
      console.error(`   ${issue.path.join('.')}: ${issue.message}`);
    }
    continue;
  }
  if (result.data.slug !== slug) {
    failed++;
    console.error(`✗ ${file}: slug "${result.data.slug}" ≠ ім'я файла "${slug}"`);
    continue;
  }

  const types = result.data.sections.map((s) => s.type).join(' → ');
  console.log(`✓ ${file}  (${result.data.sections.length} секцій: ${types})`);
}

if (failed > 0) {
  console.error(`\n${failed} файл(ів) не пройшли валідацію.`);
  process.exit(1);
}
console.log(`\nУсі ${files.length} файли валідні.`);
