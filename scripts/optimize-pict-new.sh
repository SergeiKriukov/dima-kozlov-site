#!/bin/bash

# Скрипт для оптимизации фотографий из папки pict_new
# Требует ImageMagick

SOURCE_DIR="pict_new"
OPTIMIZED_DIR="pict_new-optimized"

# Создаём папку для оптимизированных фото
mkdir -p "$OPTIMIZED_DIR"

echo "Оптимизация фотографий из $SOURCE_DIR..."
echo ""

total_original=0
total_optimized=0
count=0

for file in "$SOURCE_DIR"/*.{jpg,JPG,jpeg,JPEG}; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        output="$OPTIMIZED_DIR/$filename"
        
        count=$((count + 1))
        echo "[$count] Обработка: $filename"
        
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
        
        total_original=$((total_original + original_size))
        total_optimized=$((total_optimized + new_size))
        
        original_kb=$((original_size / 1024))
        new_kb=$((new_size / 1024))
        reduction=$(echo "scale=1; (1 - $new_size / $original_size) * 100" | bc)
        
        echo "  Было: ${original_kb}KB → Стало: ${new_kb}KB (экономия: ${reduction}%)"
        echo ""
    fi
done

total_original_mb=$(echo "scale=2; $total_original / 1024 / 1024" | bc)
total_optimized_mb=$(echo "scale=2; $total_optimized / 1024 / 1024" | bc)
total_reduction=$(echo "scale=1; (1 - $total_optimized / $total_original) * 100" | bc)

echo "=========================================="
echo "Итого обработано: $count файлов"
echo "Было: ${total_original_mb}MB"
echo "Стало: ${total_optimized_mb}MB"
echo "Общая экономия: ${total_reduction}%"
echo "=========================================="
echo ""
echo "Оптимизированные фото сохранены в: $OPTIMIZED_DIR"

