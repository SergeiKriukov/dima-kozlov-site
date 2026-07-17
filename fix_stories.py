#!/usr/bin/env python3
import re

with open('constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Находим массив STORIES
start = content.find('export const STORIES: Story[] = [')
end = content.rfind('];', start) + 2
stories_text = content[start:end]

# Извлекаем каждый рассказ более аккуратно
stories = []
# Разбиваем по закрывающим скобкам объектов
parts = re.split(r'\},\s*\n\s*\{', stories_text)

for i, part in enumerate(parts):
    if i == 0:
        part = part.lstrip('{').lstrip()
    if i == len(parts) - 1:
        part = part.rstrip('}').rstrip()
    else:
        part = '{' + part + '}'
    
    story = {}
    
    # ID
    match = re.search(r"id:\s*['`]([^'`]+)['`]", part)
    if match:
        story['id'] = match.group(1)
    else:
        continue
    
    # Title
    match = re.search(r"title:\s*['`]([^'`]+)['`]", part)
    if not match:
        # Попробуем с обратными кавычками для многострочных
        match = re.search(r"title:\s*`([^`]+)`", part)
    if match:
        story['title'] = match.group(1)
    
    # Date
    match = re.search(r"date:\s*['`]([^'`]+)['`]", part)
    if match:
        story['date'] = match.group(1)
    
    # Tags
    tags_match = re.search(r"tags:\s*\[(.*?)\]", part, re.DOTALL)
    if tags_match:
        tags_str = tags_match.group(1)
        tags = re.findall(r"['`]([^'`]+)['`]", tags_str)
        story['tags'] = tags
    else:
        story['tags'] = []
    
    # Excerpt
    match = re.search(r"excerpt:\s*['`]([^'`]+)['`]", part)
    if not match:
        match = re.search(r"excerpt:\s*`([^`]+)`", part)
    if match:
        story['excerpt'] = match.group(1)
    
    # Content - самый сложный случай
    # Ищем content: `...` до associatedImageId или до конца объекта
    content_pattern = r"content:\s*`(.*?)(?=`\s*[,}])"
    content_match = re.search(content_pattern, part, re.DOTALL)
    if content_match:
        story['content'] = content_match.group(1).strip()
    else:
        story['content'] = ''
    
    # AssociatedImageId
    match = re.search(r"associatedImageId:\s*['`]([^'`]*)['`]", part)
    if match:
        img_id = match.group(1)
        story['associatedImageId'] = img_id if img_id else None
    else:
        story['associatedImageId'] = None
    
    stories.append(story)

# Генерируем Swift
swift_lines = ['    static let sample: [Story] = [']
for story in stories:
    swift_lines.append('        .init(')
    swift_lines.append(f'            id: "{story["id"]}",')
    swift_lines.append(f'            title: "{story["title"].replace(chr(34), chr(92)+chr(34))}",')
    swift_lines.append(f'            date: "{story["date"]}",')
    
    tags_str = ', '.join([f'"{tag}"' for tag in story['tags']])
    swift_lines.append(f'            tags: [{tags_str}],')
    
    excerpt = story['excerpt'].replace('"', '\\"')
    swift_lines.append(f'            excerpt: "{excerpt}",')
    
    swift_lines.append('            content: """')
    swift_lines.append(story['content'])
    swift_lines.append('""",')
    
    if story['associatedImageId']:
        swift_lines.append(f'            associatedImageId: "{story["associatedImageId"]}"')
    else:
        swift_lines.append('            associatedImageId: nil')
    
    swift_lines.append('        ),')

swift_lines.append('    ]')

with open('/tmp/swift_stories_final.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(swift_lines))

print(f"Создано {len(stories)} рассказов")

