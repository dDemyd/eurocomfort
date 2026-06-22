/**
 * Статичний реєстр контенту категорій.
 *
 * JSON-файли імпортуються статично, щоб потрапити в бандл і бути доступними
 * як fallback у проді (коли `categories.content` у БД порожній/невалідний).
 * Валідація проти `CategoryContentSchema` відбувається в місці використання
 * (`getCategoryContent`), тож тут типи навмисно «сирі».
 *
 * Це ж джерело використовує seed-скрипт `scripts/seed-category-content.ts`.
 */
import panoramicGlazing from './panoramic-glazing.json';
import facadeGlazing from './facade-glazing.json';
import slidingSystems from './sliding-systems.json';
import customForms from './custom-forms.json';

export const categoryContentSeed: Record<string, unknown> = {
  'panoramic-glazing': panoramicGlazing,
  'facade-glazing': facadeGlazing,
  'sliding-systems': slidingSystems,
  'custom-forms': customForms,
};
