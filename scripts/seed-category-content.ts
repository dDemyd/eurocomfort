/**
 * Phase 2 — сід контенту категорій із JSON-файлів у Supabase
 * (`categories.content jsonb`), матчинг по `slug`.
 *
 * Запуск (потрібні NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY):
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-category-content.ts
 *
 * Ідемпотентний: оновлює `content` наявних рядків categories. Не створює
 * категорії (їх заводять окремо). Кожен файл валідовано Zod перед записом.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { CategoryContentSchema } from '../src/lib/categoryContent.ts';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    'Немає NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. ' +
      'Запускайте з `node --env-file=.env.local …`.'
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const dir = join(fileURLToPath(new URL('.', import.meta.url)), '../src/content/categories');
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

let failed = 0;
for (const file of files) {
  const slug = basename(file, '.json');
  const raw = JSON.parse(readFileSync(join(dir, file), 'utf8'));

  const result = CategoryContentSchema.safeParse(raw);
  if (!result.success) {
    failed++;
    console.error(`✗ ${file}: не пройшов валідацію — пропускаю`);
    for (const i of result.error.issues) console.error(`   ${i.path.join('.')}: ${i.message}`);
    continue;
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ content: result.data })
    .eq('slug', slug)
    .select('id');

  if (error) {
    failed++;
    console.error(`✗ ${slug}: ${error.message}`);
  } else if (!data || data.length === 0) {
    console.warn(`⚠ ${slug}: рядок categories із таким slug не знайдено — нічого не оновлено`);
  } else {
    console.log(`✓ ${slug}: content оновлено`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} помилок під час сіду.`);
  process.exit(1);
}
console.log('\nСід завершено.');
