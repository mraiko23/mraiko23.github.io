# Render.com deploy instructions

1. Залей проект на GitHub (или другой git-репозиторий).
2. На render.com создай новый Web Service:
   - Укажи репозиторий.
   - Build Command: npm install
   - Start Command: node index.js
   - Environment: Node
   - Добавь переменную окружения TELEGRAM_BOT_TOKEN (токен твоего Telegram-бота).
3. Procfile и .gitignore уже добавлены.
4. Для домена и SSL настрой в Render по желанию.

Если нужен пример .env:
TELEGRAM_BOT_TOKEN=your_bot_token_here

Готово! После деплоя сайт будет работать только через Telegram-авторизацию.
