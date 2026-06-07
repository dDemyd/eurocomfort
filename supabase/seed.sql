begin;

insert into public.categories (slug, title, image, sort, is_published)
values
  (
    'panoramic-glazing',
    jsonb_build_object('uk', 'Панорамне скління', 'ru', 'Панорамное остекление'),
    '/assets/facade.webp',
    10,
    true
  ),
  (
    'facade-glazing',
    jsonb_build_object('uk', 'Фасадне скління', 'ru', 'Фасадное остекление'),
    '/assets/facade-bw.webp',
    20,
    true
  ),
  (
    'sliding-systems',
    jsonb_build_object('uk', 'Розсувні системи', 'ru', 'Раздвижные системы'),
    '/assets/sliding.webp',
    30,
    true
  ),
  (
    'custom-forms',
    jsonb_build_object('uk', 'Нестандартні форми', 'ru', 'Нестандартные формы'),
    '/assets/custom.webp',
    40,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  image = excluded.image,
  sort = excluded.sort,
  is_published = excluded.is_published;

insert into public.projects (
  slug,
  title,
  location,
  system,
  description,
  category_id,
  cover,
  images,
  sort,
  is_published
)
values
  (
    'bila-tserkva-biofarma-lab',
    jsonb_build_object('uk', 'м. Біла Церква, лабораторний корпус компанії «Біофарма»', 'ru', 'г. Белая Церковь, лабораторный корпус компании «Биофарма»'),
    jsonb_build_object('uk', 'м. Біла Церква', 'ru', 'г. Белая Церковь'),
    jsonb_build_object('uk', 'стійко-ригельна система + енергоефективні склопакети', 'ru', 'стоечно-ригельная система + энергоэффективные стеклопакеты'),
    jsonb_build_object('uk', 'Фасадне скління лабораторного корпусу з енергоефективними склопакетами.', 'ru', 'Фасадное остекление лабораторного корпуса с энергоэффективными стеклопакетами.'),
    (select id from public.categories where slug = 'facade-glazing'),
    '/assets/facade.webp',
    array['/assets/facade.webp'],
    10,
    true
  ),
  (
    'kruglyk-terrace-sliding-smart',
    jsonb_build_object('uk', 'с. Круглик, тераса', 'ru', 'с. Круглик, терраса'),
    jsonb_build_object('uk', 'с. Круглик', 'ru', 'с. Круглик'),
    jsonb_build_object('uk', 'розсувна система Sliding Smart', 'ru', 'раздвижная система Sliding Smart'),
    jsonb_build_object('uk', 'Терасне скління розсувною системою Sliding Smart.', 'ru', 'Террасное остекление раздвижной системой Sliding Smart.'),
    (select id from public.categories where slug = 'sliding-systems'),
    '/assets/sliding.webp',
    array['/assets/sliding.webp'],
    20,
    true
  ),
  (
    'vyshenky-terrace-tinted-sliding',
    jsonb_build_object('uk', 'с. Вишеньки, тераса', 'ru', 'с. Вишеньки, терраса'),
    jsonb_build_object('uk', 'с. Вишеньки', 'ru', 'с. Вишеньки'),
    jsonb_build_object('uk', 'розсувна система Sliding Smart з тонованим склом', 'ru', 'раздвижная система Sliding Smart с тонированным стеклом'),
    jsonb_build_object('uk', 'Розсувне скління тераси з тонованим склом для приватності та захисту від сонця.', 'ru', 'Раздвижное остекление террасы с тонированным стеклом для приватности и защиты от солнца.'),
    (select id from public.categories where slug = 'sliding-systems'),
    '/assets/sliding.webp',
    array['/assets/sliding.webp'],
    30,
    true
  ),
  (
    'petropavlivska-borshchahivka-pergola',
    jsonb_build_object('uk', 'Петропавлівська Борщагівка, тераса', 'ru', 'Петропавловская Борщаговка, терраса'),
    jsonb_build_object('uk', 'Петропавлівська Борщагівка', 'ru', 'Петропавловская Борщаговка'),
    jsonb_build_object('uk', 'пергольна система + розсувні системи Sliding', 'ru', 'пергольная система + раздвижные системы Sliding'),
    jsonb_build_object('uk', 'Комплексне рішення для тераси: пергола та розсувне скління.', 'ru', 'Комплексное решение для террасы: пергола и раздвижное остекление.'),
    (select id from public.categories where slug = 'sliding-systems'),
    '/assets/sliding.webp',
    array['/assets/sliding.webp'],
    40,
    true
  ),
  (
    'bykivnia-cottage-aluminium-windows',
    jsonb_build_object('uk', 'с. Биківня, котедж', 'ru', 'с. Быковня, коттедж'),
    jsonb_build_object('uk', 'с. Биківня', 'ru', 'с. Быковня'),
    jsonb_build_object('uk', 'алюмінієві віконні системи', 'ru', 'алюминиевые оконные системы'),
    jsonb_build_object('uk', 'Алюмінієві віконні системи для приватного котеджу.', 'ru', 'Алюминиевые оконные системы для частного коттеджа.'),
    (select id from public.categories where slug = 'panoramic-glazing'),
    '/assets/interior.webp',
    array['/assets/interior.webp'],
    50,
    true
  ),
  (
    'khodosivka-commercial-facade',
    jsonb_build_object('uk', 'с. Ходосівка, комерційне приміщення', 'ru', 'с. Ходосовка, коммерческое помещение'),
    jsonb_build_object('uk', 'с. Ходосівка', 'ru', 'с. Ходосовка'),
    jsonb_build_object('uk', 'фасадні системи', 'ru', 'фасадные системы'),
    jsonb_build_object('uk', 'Фасадне скління комерційного приміщення.', 'ru', 'Фасадное остекление коммерческого помещения.'),
    (select id from public.categories where slug = 'facade-glazing'),
    '/assets/facade.webp',
    array['/assets/facade.webp'],
    60,
    true
  ),
  (
    'obukhiv-commercial-facade',
    jsonb_build_object('uk', 'м. Обухів, комерційне приміщення', 'ru', 'г. Обухов, коммерческое помещение'),
    jsonb_build_object('uk', 'м. Обухів', 'ru', 'г. Обухов'),
    jsonb_build_object('uk', 'фасадні системи', 'ru', 'фасадные системы'),
    jsonb_build_object('uk', 'Фасадна система для комерційного об’єкта.', 'ru', 'Фасадная система для коммерческого объекта.'),
    (select id from public.categories where slug = 'facade-glazing'),
    '/assets/facade-bw.webp',
    array['/assets/facade-bw.webp'],
    70,
    true
  ),
  (
    'bila-tserkva-guillotine-terrace',
    jsonb_build_object('uk', 'м. Біла Церква, тераса', 'ru', 'г. Белая Церковь, терраса'),
    jsonb_build_object('uk', 'м. Біла Церква', 'ru', 'г. Белая Церковь'),
    jsonb_build_object('uk', 'системи «Гільйотина» з електроприводом', 'ru', 'системы «Гильотина» с электроприводом'),
    jsonb_build_object('uk', 'Терасне скління системою «Гільйотина» з електроприводом.', 'ru', 'Террасное остекление системой «Гильотина» с электроприводом.'),
    (select id from public.categories where slug = 'custom-forms'),
    '/assets/custom.webp',
    array['/assets/custom.webp'],
    80,
    true
  ),
  (
    'bobrytsia-semi-warm-terrace',
    jsonb_build_object('uk', 'с. Бобриця, напівтепла тераса', 'ru', 'с. Бобрица, полутеплая терраса'),
    jsonb_build_object('uk', 'с. Бобриця', 'ru', 'с. Бобрица'),
    jsonb_build_object('uk', 'розсувні системи Sliding Max Slim', 'ru', 'раздвижные системы Sliding Max Slim'),
    jsonb_build_object('uk', 'Напівтепле розсувне скління тераси системою Sliding Max Slim.', 'ru', 'Полутеплое раздвижное остекление террасы системой Sliding Max Slim.'),
    (select id from public.categories where slug = 'sliding-systems'),
    '/assets/sliding.webp',
    array['/assets/sliding.webp'],
    90,
    true
  ),
  (
    'hora-commercial-stick-facade',
    jsonb_build_object('uk', 'с. Гора, комерційне приміщення', 'ru', 'с. Гора, коммерческое помещение'),
    jsonb_build_object('uk', 'с. Гора', 'ru', 'с. Гора'),
    jsonb_build_object('uk', 'стійкоригельна фасадна система', 'ru', 'стоечно-ригельная фасадная система'),
    jsonb_build_object('uk', 'Стійкоригельне фасадне скління для комерційного простору.', 'ru', 'Стоечно-ригельное фасадное остекление для коммерческого пространства.'),
    (select id from public.categories where slug = 'facade-glazing'),
    '/assets/facade.webp',
    array['/assets/facade.webp'],
    100,
    true
  ),
  (
    'khotiv-top-hung-folding',
    jsonb_build_object('uk', 'с. Хотів, верхньопідвісна розсувна система', 'ru', 'с. Хотов, верхнеподвесная раздвижная система'),
    jsonb_build_object('uk', 'с. Хотів', 'ru', 'с. Хотов'),
    jsonb_build_object('uk', 'верхньопідвісна розсувна система книжного типу з тонованим склом', 'ru', 'верхнеподвесная раздвижная система книжного типа с тонированным стеклом'),
    jsonb_build_object('uk', 'Нестандартна розсувна система книжного типу з тонованим склом.', 'ru', 'Нестандартная раздвижная система книжного типа с тонированным стеклом.'),
    (select id from public.categories where slug = 'custom-forms'),
    '/assets/custom.webp',
    array['/assets/custom.webp'],
    110,
    true
  ),
  (
    'kyiv-aluprof-mb77-sliding',
    jsonb_build_object('uk', 'м. Київ, розсувна система Aluprof MB-77', 'ru', 'г. Киев, раздвижная система Aluprof MB-77'),
    jsonb_build_object('uk', 'м. Київ', 'ru', 'г. Киев'),
    jsonb_build_object('uk', 'розсувна система Aluprof MB-77', 'ru', 'раздвижная система Aluprof MB-77'),
    jsonb_build_object('uk', 'Тепла розсувна алюмінієва система для приватного об’єкта.', 'ru', 'Теплая раздвижная алюминиевая система для частного объекта.'),
    (select id from public.categories where slug = 'sliding-systems'),
    '/assets/sliding.webp',
    array['/assets/sliding.webp'],
    120,
    true
  ),
  (
    'hatne-frameless-terrace',
    jsonb_build_object('uk', 'с. Гатне, безрамна розсувна терасна система', 'ru', 'с. Гатное, безрамная раздвижная террасная система'),
    jsonb_build_object('uk', 'с. Гатне', 'ru', 'с. Гатное'),
    jsonb_build_object('uk', 'безрамна розсувна терасна система', 'ru', 'безрамная раздвижная террасная система'),
    jsonb_build_object('uk', 'Безрамне терасне скління з чистою лінією огляду.', 'ru', 'Безрамное террасное остекление с чистой линией обзора.'),
    (select id from public.categories where slug = 'panoramic-glazing'),
    '/assets/interior.webp',
    array['/assets/interior.webp'],
    130,
    true
  ),
  (
    'uman-fuel-station-facade',
    jsonb_build_object('uk', 'м. Умань, АЗК', 'ru', 'г. Умань, АЗК'),
    jsonb_build_object('uk', 'м. Умань', 'ru', 'г. Умань'),
    jsonb_build_object('uk', 'фасадна система з автоматичними дверима', 'ru', 'фасадная система с автоматическими дверями'),
    jsonb_build_object('uk', 'Фасадна система для АЗК з автоматичною вхідною групою.', 'ru', 'Фасадная система для АЗК с автоматической входной группой.'),
    (select id from public.categories where slug = 'facade-glazing'),
    '/assets/facade.webp',
    array['/assets/facade.webp'],
    140,
    true
  ),
  (
    'markhalivka-raynaers',
    jsonb_build_object('uk', 'с. Мархалівка, системи Raynaers aluminium', 'ru', 'с. Мархалевка, системы Raynaers aluminium'),
    jsonb_build_object('uk', 'с. Мархалівка', 'ru', 'с. Мархалевка'),
    jsonb_build_object('uk', 'системи Raynaers aluminium', 'ru', 'системы Raynaers aluminium'),
    jsonb_build_object('uk', 'Алюмінієві системи Raynaers для приватного об’єкта.', 'ru', 'Алюминиевые системы Raynaers для частного объекта.'),
    (select id from public.categories where slug = 'panoramic-glazing'),
    '/assets/interior.webp',
    array['/assets/interior.webp'],
    150,
    true
  ),
  (
    'vyshneve-structural-glass-facade',
    jsonb_build_object('uk', 'м. Вишневе, фасадна система з структурними склопакетами', 'ru', 'г. Вишневое, фасадная система со структурными стеклопакетами'),
    jsonb_build_object('uk', 'м. Вишневе', 'ru', 'г. Вишневое'),
    jsonb_build_object('uk', 'фасадна система зі структурними склопакетами', 'ru', 'фасадная система со структурными стеклопакетами'),
    jsonb_build_object('uk', 'Фасадне скління зі структурними склопакетами.', 'ru', 'Фасадное остекление со структурными стеклопакетами.'),
    (select id from public.categories where slug = 'facade-glazing'),
    '/assets/facade-bw.webp',
    array['/assets/facade-bw.webp'],
    160,
    true
  ),
  (
    'orlivshchyna-frameless-sliding',
    jsonb_build_object('uk', 'с. Орлівщина, терасні безрамні розсувні системи', 'ru', 'с. Орловщина, террасные безрамные раздвижные системы'),
    jsonb_build_object('uk', 'с. Орлівщина', 'ru', 'с. Орловщина'),
    jsonb_build_object('uk', 'терасні безрамні розсувні системи', 'ru', 'террасные безрамные раздвижные системы'),
    jsonb_build_object('uk', 'Безрамні розсувні системи для терасного простору.', 'ru', 'Безрамные раздвижные системы для террасного пространства.'),
    (select id from public.categories where slug = 'sliding-systems'),
    '/assets/sliding.webp',
    array['/assets/sliding.webp'],
    170,
    true
  ),
  (
    'bila-tserkva-glass-partitions',
    jsonb_build_object('uk', 'м. Біла Церква, скляні перегородки', 'ru', 'г. Белая Церковь, стеклянные перегородки'),
    jsonb_build_object('uk', 'м. Біла Церква', 'ru', 'г. Белая Церковь'),
    jsonb_build_object('uk', 'скляні перегородки', 'ru', 'стеклянные перегородки'),
    jsonb_build_object('uk', 'Скляні перегородки для сучасного простору.', 'ru', 'Стеклянные перегородки для современного пространства.'),
    (select id from public.categories where slug = 'custom-forms'),
    '/assets/custom.webp',
    array['/assets/custom.webp'],
    180,
    true
  ),
  (
    'novi-petrivtsi-arched-sliding',
    jsonb_build_object('uk', 'с. Нові Петрівці, розсувні алюмінієві системи з арками і теплими склопакетами', 'ru', 'с. Новые Петровцы, раздвижные алюминиевые системы с арками и теплыми стеклопакетами'),
    jsonb_build_object('uk', 'с. Нові Петрівці', 'ru', 'с. Новые Петровцы'),
    jsonb_build_object('uk', 'розсувні алюмінієві системи з арками і теплими склопакетами', 'ru', 'раздвижные алюминиевые системы с арками и теплыми стеклопакетами'),
    jsonb_build_object('uk', 'Нестандартні розсувні алюмінієві системи з арковими елементами.', 'ru', 'Нестандартные раздвижные алюминиевые системы с арочными элементами.'),
    (select id from public.categories where slug = 'custom-forms'),
    '/assets/custom.webp',
    array['/assets/custom.webp'],
    190,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  location = excluded.location,
  system = excluded.system,
  description = excluded.description,
  category_id = excluded.category_id,
  cover = excluded.cover,
  images = excluded.images,
  sort = excluded.sort,
  is_published = excluded.is_published;

insert into public.testimonials (id, author, body, sort, is_published)
values
  ('00000000-0000-4000-8000-000000000101', 'Юлія', jsonb_build_object('uk', 'Найкращий підхід до клієнтів у місті! Професіонали своєї справи!', 'ru', 'Лучший подход к клиентам в городе! Профессионалы своего дела!'), 10, true),
  ('00000000-0000-4000-8000-000000000102', 'Ірина', jsonb_build_object('uk', 'Дуже крутий консультант Олена, швидко і круто допомогла підібрати те, що потрібно!', 'ru', 'Очень классный консультант Елена, быстро и отлично помогла подобрать то, что нужно!'), 20, true),
  ('00000000-0000-4000-8000-000000000103', 'Олександр', jsonb_build_object('uk', 'Дякуємо за чудову роботу! Із задоволенням звернемося знову, коли робитимемо новий офіс.', 'ru', 'Спасибо за отличную работу! С удовольствием обратимся снова, когда будем делать новый офис.'), 30, true),
  ('00000000-0000-4000-8000-000000000104', 'Анатолій', jsonb_build_object('uk', 'Місце, де професійно підберуть теплі і комфортні вікна для Вашої оселі за розумні кошти! Рекомендую.', 'ru', 'Место, где профессионально подберут теплые и комфортные окна для вашего дома за разумные деньги! Рекомендую.'), 40, true),
  ('00000000-0000-4000-8000-000000000105', 'Богдан', jsonb_build_object('uk', 'Дуже задоволений співпрацею. Допомогли підібрати вікна швидко та зрозуміло, все пояснили і врахували наші побажання.', 'ru', 'Очень доволен сотрудничеством. Помогли быстро и понятно подобрать окна, все объяснили и учли наши пожелания.'), 50, true),
  ('00000000-0000-4000-8000-000000000106', 'Ігор', jsonb_build_object('uk', 'Якісний сервіс, хороша консультація і адекватні ціни. Рекомендую!', 'ru', 'Качественный сервис, хорошая консультация и адекватные цены. Рекомендую!'), 60, true),
  ('00000000-0000-4000-8000-000000000107', 'Ярослав', jsonb_build_object('uk', 'Дуже комфортно було співпрацювати. Все організовано, без хаосу, і результат повністю виправдав очікування.', 'ru', 'Было очень комфортно сотрудничать. Все организовано, без хаоса, и результат полностью оправдал ожидания.'), 70, true),
  ('00000000-0000-4000-8000-000000000108', 'Дмитро', jsonb_build_object('uk', 'Приємно здивований рівнем сервісу. Консультація була дуже професійною, підібрали оптимальний варіант під наш бюджет і потреби. Все чітко і без затримок.', 'ru', 'Приятно удивлен уровнем сервиса. Консультация была очень профессиональной, подобрали оптимальный вариант под наш бюджет и потребности. Все четко и без задержек.'), 80, true),
  ('00000000-0000-4000-8000-000000000109', 'Людмила', jsonb_build_object('uk', 'Все пройшло легко і без стресу. Допомогли визначитися з вибором, відповіли на всі питання. Відчувається професійний підхід.', 'ru', 'Все прошло легко и без стресса. Помогли определиться с выбором, ответили на все вопросы. Чувствуется профессиональный подход.'), 90, true)
on conflict (id) do update set
  author = excluded.author,
  body = excluded.body,
  sort = excluded.sort,
  is_published = excluded.is_published;

insert into public.faq (id, question, answer, sort, is_published)
values
  (
    '00000000-0000-4000-8000-000000000201',
    jsonb_build_object('uk', 'Які терміни виготовлення і встановлення?', 'ru', 'Какие сроки изготовления и установки?'),
    jsonb_build_object('uk', 'Залежить від складності проєкту — зазвичай від погодження до встановлення проходить від 2 тижнів до 2,5 місяців.', 'ru', 'Зависит от сложности проекта — обычно от согласования до установки проходит от 2 недель до 2,5 месяцев.'),
    10,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000202',
    jsonb_build_object('uk', 'Які профільні системи ви використовуєте?', 'ru', 'Какие профильные системы вы используете?'),
    jsonb_build_object('uk', 'Ми працюємо з перевіреними європейськими та українськими системами: Reynaers, Aluprof, Schüco, Alumil, Rehau, КМD, Framex, БРАЗ, WDS та інші.', 'ru', 'Мы работаем с проверенными европейскими и украинскими системами: Reynaers, Aluprof, Schüco, Alumil, Rehau, КМD, Framex, БРАЗ, WDS и другими.'),
    20,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000203',
    jsonb_build_object('uk', 'Чи співпрацюєте з дизайнерами та архітекторами?', 'ru', 'Сотрудничаете ли вы с дизайнерами и архитекторами?'),
    jsonb_build_object('uk', 'Так, на етапі проєктування активно співпрацюємо з архітекторами та дизайнерами. Консультуємо щодо технічних параметрів, вузлів примикання, зовнішнього вигляду та можливих габаритів.', 'ru', 'Да, на этапе проектирования активно сотрудничаем с архитекторами и дизайнерами. Консультируем по техническим параметрам, узлам примыкания, внешнему виду и возможным габаритам.'),
    30,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000204',
    jsonb_build_object('uk', 'Який термін служби алюмінієвих конструкцій?', 'ru', 'Какой срок службы алюминиевых конструкций?'),
    jsonb_build_object('uk', 'Від 30 до 50 років за умови правильного підбору системи, якісного монтажу та планового сервісу.', 'ru', 'От 30 до 50 лет при правильном подборе системы, качественном монтаже и плановом сервисе.'),
    40,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000205',
    jsonb_build_object('uk', 'Які максимальні габарити склопакетів ми можемо виготовити?', 'ru', 'Какие максимальные габариты стеклопакетов мы можем изготовить?'),
    jsonb_build_object('uk', 'Максимальні розміри обмежені форматом скла Jumbo. Остаточні габарити визначаємо після технічного прорахунку системи, ваги та логістики.', 'ru', 'Максимальные размеры ограничены форматом стекла Jumbo. Окончательные габариты определяем после технического расчета системы, веса и логистики.'),
    50,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000206',
    jsonb_build_object('uk', 'Який склопакет обрати?', 'ru', 'Какой стеклопакет выбрать?'),
    jsonb_build_object('uk', 'Найчастіше ми пропонуємо двокамерні енергоефективні склопакети, але точна формула залежить від розміру, вимог до теплоізоляції, орієнтації до сонця, розташування та обраної несучої системи.', 'ru', 'Чаще всего мы предлагаем двухкамерные энергоэффективные стеклопакеты, но точная формула зависит от размера, требований к теплоизоляции, ориентации к солнцу, расположения и выбранной несущей системы.'),
    60,
    true
  )
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer,
  sort = excluded.sort,
  is_published = excluded.is_published;

insert into public.content_blocks (key, value, updated_at)
values
  ('hero.title', jsonb_build_object('uk', 'Преміальні алюмінієві системи для дому і бізнесу', 'ru', 'Премиальные алюминиевые системы для дома и бизнеса'), now()),
  ('hero.subtitle', jsonb_build_object('uk', 'З точним монтажем і контролем якості, без затримок і переробок', 'ru', 'С точным монтажом и контролем качества, без задержек и переделок'), now()),
  ('hero.cta', jsonb_build_object('uk', 'Замовити консультацію', 'ru', 'Заказать консультацию'), now()),
  ('stats.experience', jsonb_build_object('uk', '19+ років досвіду у сучасному склінні', 'ru', '19+ лет опыта в современном остеклении'), now()),
  ('stats.projects', jsonb_build_object('uk', '500+ реалізованих проєктів', 'ru', '500+ реализованных проектов'), now()),
  ('stats.satisfaction', jsonb_build_object('uk', '98% клієнтів залишаються задоволеними співпрацею', 'ru', '98% клиентов остаются довольны сотрудничеством'), now()),
  ('features.title', jsonb_build_object('uk', 'Нестандартні алюмінієві рішення під ваш об’єкт', 'ru', 'Нестандартные алюминиевые решения под ваш объект'), now()),
  ('features.lede', jsonb_build_object('uk', 'Робимо те, за що інші не беруться: складні конструкції, великі розміри та індивідуальні проєкти під ключ.', 'ru', 'Делаем то, за что другие не берутся: сложные конструкции, большие размеры и индивидуальные проекты под ключ.'), now()),
  ('catalog.title', jsonb_build_object('uk', 'Що ми реалізуємо', 'ru', 'Что мы реализуем'), now()),
  ('catalog.lede', jsonb_build_object('uk', 'Підбираємо рішення під ваші задачі, бюджет і архітектуру об’єкта. Кожен проєкт — індивідуальний!', 'ru', 'Подбираем решения под ваши задачи, бюджет и архитектуру объекта. Каждый проект индивидуален!'), now()),
  ('why.title', jsonb_build_object('uk', 'Чому обирають «ЄВРО КОМФОРТ»', 'ru', 'Почему выбирают «ЕВРО КОМФОРТ»'), now()),
  ('why.lede', jsonb_build_object('uk', 'Нас обирають не за слова, а за результат, досвід, відповідальність і якість, яка не потребує переробок.', 'ru', 'Нас выбирают не за слова, а за результат, опыт, ответственность и качество, которое не требует переделок.'), now()),
  ('process.title', jsonb_build_object('uk', 'Як ми працюємо', 'ru', 'Как мы работаем'), now()),
  ('projects.title', jsonb_build_object('uk', 'Реалізовані проєкти', 'ru', 'Реализованные проекты'), now()),
  ('reviews.title', jsonb_build_object('uk', 'Понад 500 задоволених клієнтів', 'ru', 'Более 500 довольных клиентов'), now()),
  ('lead.title', jsonb_build_object('uk', 'Замовте консультацію', 'ru', 'Закажите консультацию'), now()),
  ('lead.lede', jsonb_build_object('uk', 'Зробіть перший крок до вашого проєкту — ми зв’яжемося з вами, обговоримо задачу, запропонуємо рішення та підготуємо прорахунок вартості.', 'ru', 'Сделайте первый шаг к вашему проекту — мы свяжемся с вами, обсудим задачу, предложим решение и подготовим расчет стоимости.'), now()),
  ('faq.title', jsonb_build_object('uk', 'Нас часто питають', 'ru', 'Нас часто спрашивают'), now()),
  ('faq.lede', jsonb_build_object('uk', 'Ще залишилися запитання? Замовте консультацію і наш менеджер із радістю відповість на всі питання та допоможе підібрати найкраще рішення саме для вас.', 'ru', 'Остались вопросы? Закажите консультацию, и наш менеджер с радостью ответит на все вопросы и поможет подобрать лучшее решение именно для вас.'), now())
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

insert into public.settings (key, value, updated_at)
values
  ('company.name', jsonb_build_object('uk', 'ЄВРО КОМФОРТ', 'ru', 'ЕВРО КОМФОРТ'), now()),
  ('company.city', jsonb_build_object('uk', 'Біла Церква', 'ru', 'Белая Церковь'), now()),
  ('contact.address', jsonb_build_object('uk', 'Україна, м. Біла Церква, вул. Ярмаркова, 39', 'ru', 'Украина, г. Белая Церковь, ул. Ярмарковая, 39'), now()),
  ('contact.phone', jsonb_build_object('uk', '+380 97 969 04 03', 'ru', '+380 97 969 04 03'), now()),
  ('contact.phone_display', jsonb_build_object('uk', '+380 (97) 969 04 03', 'ru', '+380 (97) 969 04 03'), now()),
  ('contact.email', jsonb_build_object('uk', 'eurocomfortbc@gmail.com', 'ru', 'eurocomfortbc@gmail.com'), now()),
  ('contact.work_region', jsonb_build_object('uk', 'Біла Церква, Київ та Київська область', 'ru', 'Белая Церковь, Киев и Киевская область'), now()),
  ('seo.domain', jsonb_build_object('uk', 'https://eurocomfort.vercel.app/', 'ru', 'https://eurocomfort.vercel.app/'), now())
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

commit;
