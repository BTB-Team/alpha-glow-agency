import db from '../../db.json';

const assetImages = import.meta.glob(
  '../assets/**/*.{webp,png,jpg,jpeg,avif,svg}',
  { eager: true, import: 'default' }
);

// تبدیل حروف عربی/فارسی، نیم‌فاصله و کاراکترهای اضافه به فرم یکسان
export const normalizeSearchText = (text = '') => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[يئ]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[\u200c\u200f]/g, ' ')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const resolveSearchImage = (imgName, folder = 'portfolio') => {
  if (!imgName) return '';
  if (imgName.startsWith('http') || imgName.startsWith('/')) return imgName;

  const matchedKey = Object.keys(assetImages).find((path) =>
    path.endsWith(`/${imgName}`)
  );
  if (matchedKey) return assetImages[matchedKey];

  return `/images/${folder}/${imgName}`;
};

const collectLocalizedValues = (field) => {
  if (!field) return [];
  if (typeof field === 'string') return [field];
  if (Array.isArray(field)) return field.flatMap(collectLocalizedValues);
  if (typeof field === 'object') return Object.values(field).flatMap(collectLocalizedValues);
  return [];
};

const scoreMatch = (fields, rawQuery) => {
  const normalizedQuery = normalizeSearchText(rawQuery);
  if (!normalizedQuery) return 0;

  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const fullText = normalizeSearchText(fields.all.join(' '));
  const compactFullText = fullText.replace(/\s+/g, '');

  // همه کلمات جست‌وجوشده باید در متن وجود داشته باشند (با پشتیبانی از نبود نیم‌فاصله)
  const allTokensMatch = tokens.every(
    (token) => fullText.includes(token) || compactFullText.includes(token)
  );
  if (!allTokensMatch) return 0;

  // امتیازدهی برای نمایش نتایج دقیق‌تر در بالای لیست
  const titleText = normalizeSearchText(fields.title.join(' '));
  const compactTitle = titleText.replace(/\s+/g, '');
  let score = 10;

  if (titleText.includes(normalizedQuery) || compactTitle.includes(normalizedQuery.replace(/\s+/g, ''))) {
    score += 40;
  } else if (tokens.some((token) => titleText.includes(token))) {
    score += 20;
  }

  return score;
};

export const searchSiteContent = (rawQuery) => {
  const query = rawQuery?.trim() || '';
  if (!query) return { services: [], portfolio: [] };

  const services = (db?.services || [])
    .map((service) => {
      const titleVals = [
        ...collectLocalizedValues(service.title),
        service.slug || '',
      ];
      const allVals = [
        ...titleVals,
        ...collectLocalizedValues(service.shortDescription),
        ...collectLocalizedValues(service.fullDescription),
        ...collectLocalizedValues(service.keywords),
        ...(service.samples || []).flatMap((s) => collectLocalizedValues(s.title)),
      ];

      return {
        item: service,
        score: scoreMatch({ title: titleVals, all: allVals }, query),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  const portfolio = (db?.portfolio || [])
    .map((project) => {
      const titleVals = [
        ...collectLocalizedValues(project.title),
        ...collectLocalizedValues(project.client),
        project.slug || '',
      ];
      const allVals = [
        ...titleVals,
        project.category || '',
        ...collectLocalizedValues(project.shortDescription),
        ...collectLocalizedValues(project.fullDescription),
        ...collectLocalizedValues(project.keywords),
      ];

      return {
        item: project,
        score: scoreMatch({ title: titleVals, all: allVals }, query),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  return { services, portfolio };
};

export const filterPortfolioByQuery = (projects = [], rawQuery = '') => {
  const query = rawQuery?.trim() || '';
  if (!query) return projects;

  return projects.filter((project) => {
    const titleVals = [
      ...collectLocalizedValues(project.title),
      ...collectLocalizedValues(project.client),
      project.slug || '',
    ];
    const allVals = [
      ...titleVals,
      project.category || '',
      ...collectLocalizedValues(project.shortDescription),
      ...collectLocalizedValues(project.fullDescription),
      ...collectLocalizedValues(project.keywords),
    ];

    return scoreMatch({ title: titleVals, all: allVals }, query) > 0;
  });
};