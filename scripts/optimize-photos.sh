#!/bin/bash

# Скрипт для оптимизации фотографий
# Требует ImageMagick: brew install imagemagick (macOS) или apt-get install imagemagick (Linux)

PHOTOS_DIR="public/photos"
OPTIMIZED_DIR="public/photos-optimized"

# Создаём папку для оптимизированных фото
mkdir -p "$OPTIMIZED_DIR"

echo "Оптимизация фотографий..."

for file in "$PHOTOS_DIR"/*.{jpg,JPG,jpeg,JPEG}; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        output="$OPTIMIZED_DIR/$filename"
        
        echo "Обработка: $filename"
        
        # Оптимизация JPEG:
        # - quality 85: хорошее качество, но меньше размер
        # - strip: удаляет метаданные
        # - progressive: прогрессивный JPEG (лучше для веба)
        # - resize: ограничиваем максимальный размер до 1600px по большей стороне
        magick "$file" \
            -quality 85 \
            -strip \
            -interlace Plane \
            -resize '1600x1600>' \
            "$output"
        
        # Показываем размеры
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        reduction=$(echo "scale=1; (1 - $new_size / $original_size) * 100" | bc)
        
        echo "  Было: $(numfmt --to=iec-i --suffix=B $original_size 2>/dev/null || echo "$(($original_size / 1024))KB")"
        echo "  Стало: $(numfmt --to=iec-i --suffix=B $new_size 2>/dev/null || echo "$(($new_size / 1024))KB")"
        echo "  Экономия: ${reduction}%"
        echo ""
    fi
done

echo "Готово! Оптимизированные фото в папке: $OPTIMIZED_DIR"
echo "Проверьте результат и замените оригиналы при необходимости:"
echo "  mv $OPTIMIZED_DIR/* $PHOTOS_DIR/"

