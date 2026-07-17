const fs = require('fs');
const path = require('path');

// Читаем файл с текстами
const textsPath = path.join(__dirname, '../_texts/texts.md');
const content = fs.readFileSync(textsPath, 'utf8');

// Разделяем по трем звездочкам
const rawStories = content.split('***').map(s => s.trim()).filter(s => s.length > 0);

// Функция для извлечения заголовка
function extractTitle(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return 'Без названия';
  
  const firstLine = lines[0].trim();
  
  // Если первая строка содержит номер в скобках, используем её как заголовок
  if (firstLine.match(/^\(?\d+\)/)) {
    return firstLine;
  }
  
  // Если первая строка короткая и похожа на заголовок
  if (firstLine.length < 100 && !firstLine.includes('.')) {
    return firstLine;
  }
  
  // Ищем заголовок в первых строках
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length < 100 && line.length > 0) {
      // Проверяем, не является ли это началом текста
      if (line.match(/^[А-ЯЁ]/) || line.match(/^\(?\d+\)/)) {
        return line;
      }
    }
  }
  
  return 'Без названия';
}

// Функция для создания excerpt
function createExcerpt(text, maxLength = 150) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  let excerpt = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    
    // Пропускаем заголовок
    if (excerpt.length === 0 && trimmed.length < 100) {
      continue;
    }
    
    if (excerpt.length > 0) excerpt += ' ';
    excerpt += trimmed;
    
    if (excerpt.length >= maxLength) {
      break;
    }
  }
  
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).trim() + '...';
  }
  
  return excerpt || text.substring(0, maxLength) + '...';
}

// Функция для очистки текста от заголовка в начале
function cleanContent(text, title) {
  const lines = text.split('\n');
  let content = text;
  
  // Удаляем заголовок из начала, если он там есть
  if (lines[0] && lines[0].trim() === title) {
    content = lines.slice(1).join('\n').trim();
  }
  
  return content.trim();
}

// Парсим истории
const stories = rawStories.map((rawStory, index) => {
  const title = extractTitle(rawStory);
  const content = cleanContent(rawStory, title);
  const excerpt = createExcerpt(content);
  
  // Генерируем id (d1, d2, d3...)
  const id = `d${index + 1}`;
  
  return {
    id,
    title,
    date: 'Сторона B',
    tags: [],
    excerpt,
    content
  };
});

// Читаем существующий constants.ts
const constantsPath = path.join(__dirname, '../constants.ts');
let constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Находим конец массива STORIES
const storiesEndMatch = constantsContent.match(/(export const STORIES: Story\[\] = \[[\s\S]*?)(\];)/);
if (!storiesEndMatch) {
  console.error('Не удалось найти массив STORIES в constants.ts');
  process.exit(1);
}

// Форматируем новые истории для вставки
const newStoriesCode = stories.map(story => {
  // Экранируем кавычки и переносы строк в тексте
  const escapedContent = story.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
  
  const escapedExcerpt = story.excerpt
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
  
  const escapedTitle = story.title
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
  
  return `  {
    id: '${story.id}',
    title: \`${escapedTitle}\`,
    date: '${story.date}',
    tags: ${JSON.stringify(story.tags)},
    excerpt: \`${escapedExcerpt}\`,
    content: \`${escapedContent}\`
  }`;
}).join(',\n');

// Вставляем новые истории перед закрывающей скобкой
const beforeStories = constantsContent.substring(0, storiesEndMatch.index + storiesEndMatch[1].length);
const afterStories = constantsContent.substring(storiesEndMatch.index + storiesEndMatch[1].length);

// Добавляем запятую перед новыми историями, если массив не пустой
const needsComma = !beforeStories.match(/\[\s*$/);
const comma = needsComma ? ',\n' : '';

const newConstantsContent = beforeStories + comma + newStoriesCode + '\n' + afterStories;

// Сохраняем
fs.writeFileSync(constantsPath, newConstantsContent, 'utf8');

console.log(`Добавлено ${stories.length} новых историй в constants.ts`);
console.log('ID новых историй:', stories.map(s => s.id).join(', '));

