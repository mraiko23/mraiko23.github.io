
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


// Middleware: доступ только после авторизации через Telegram
function telegramOnly(req, res, next) {
  if (req.cookies.tg_user) {
    next();
  } else {
    res.render('index', { user: null });
  }
}

// Telegram login verification
function checkTelegramAuth(data) {
  const secret = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
  const checkString = Object.keys(data)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === data.hash;
}

app.get('/', telegramOnly, (req, res) => {
  const user = req.cookies.tg_user ? JSON.parse(req.cookies.tg_user) : null;
  res.render('index', { user });
});

app.get('/auth/telegram', (req, res) => {
  const data = req.query;
  if (checkTelegramAuth(data)) {
    res.cookie('tg_user', JSON.stringify(data), { httpOnly: true });
    res.redirect('/');
  } else {
    res.status(403).send('Auth failed');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('tg_user');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
