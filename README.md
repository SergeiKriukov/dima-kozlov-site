# dima-kozlov-site

Веб-сайт с рассказами и фотогалереей [Димы Козлова](https://dimakozlov.ru).

Проект сделан в поддержку писателя: сайт и мобильное приложение с его текстами и визуальным рядом.

- **Сайт:** этот репозиторий · [dimakozlov.ru](https://dimakozlov.ru)
- **Приложение:** [dima-kozlov-flutter](https://github.com/SergeiKriukov/dima-kozlov-flutter)

## Стек

- Vite + React + TypeScript
- Контент: `constants.ts` → `public/stories.json` (общий источник для веба и приложения)

## Запуск локально

Нужен Node.js.

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`.

Опционально: скопируйте `.env.example` в `.env.local` и укажите `GEMINI_API_KEY`, если используете связанные AI-функции.

## Добавление контента

### Важно

Рассказы синхронизируются через `public/stories.json`. После правок в `constants.ts` обновите JSON:

```bash
./scripts/generate-stories-json.sh
```

Или через сборку: `npm run build`.

### Только рассказы

1. Добавьте объект в массив `STORIES` в `constants.ts`:

```typescript
{
  id: 'd1',
  title: 'Новый рассказ',
  date: 'Сторона D',
  tags: ['тег1', 'тег2'],
  excerpt: 'Краткое описание...',
  content: `Полный текст рассказа...`,
  // associatedImageId: 'pict010' — опционально; иначе фото подберётся стабильно по id
}
```

2. Сгенерируйте `stories.json` (см. выше).

### Только фото

1. Положите файл в `public/photos/`
2. Добавьте запись в `PHOTOS` в `constants.ts`:

```typescript
{
  id: 'pict200',
  url: '/photos/pict200.jpg',
  caption: 'Новое фото',
  width: 1200,
  height: 900
}
```

### Рассказ + фото

Добавьте фото в `PHOTOS`, рассказ в `STORIES` с `associatedImageId`, затем обновите JSON и соберите проект.

## Сборка и деплой

```bash
npm run build
```

Содержимое `dist/` загрузите в корень хостинга.

Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Оптимизация фото

Для веба обычно достаточно JPEG ~80–85%, длинная сторона до ~1600px.

Скрипт (нужен ImageMagick):

```bash
./scripts/optimize-photos.sh
```

Результат появится в `public/photos-optimized/` — при необходимости замените им файлы в `public/photos/`.

## Связанные репозитории

| Репозиторий | Назначение |
|---|---|
| [dima-kozlov-site](https://github.com/SergeiKriukov/dima-kozlov-site) | Веб-сайт |
| [dima-kozlov-flutter](https://github.com/SergeiKriukov/dima-kozlov-flutter) | Flutter-приложение |
