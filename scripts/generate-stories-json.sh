#!/bin/bash
# Скрипт для генерации stories.json из constants.ts

cd "$(dirname "$0")/.."

echo "Генерация stories.json из constants.ts..."

node -e "
const fs = require('fs');
const content = fs.readFileSync('constants.ts', 'utf8');
// Извлекаем массив STORIES
const match = content.match(/export const STORIES: Story\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Не найден массив STORIES');
  process.exit(1);
}
const storiesStr = match[1];
// Парсим как JavaScript (убираем типы)
const stories = eval(storiesStr);
// Сохраняем в JSON
fs.writeFileSync('public/stories.json', JSON.stringify(stories, null, 2), 'utf8');
console.log('✓ Создан файл public/stories.json с', stories.length, 'рассказами');
"

