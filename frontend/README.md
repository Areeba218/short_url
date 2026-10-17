# Snip – frontend

React + Vite frontend for your MERN URL shortener.

## Chalane ka tareeqa

```bash
# 1) Backend (apne original folder mein)
node index.js          # port 8001, MongoDB chalna chahiye

# 2) Frontend (is folder mein)
npm install
npm run dev            # http://localhost:5173
```

Dev mode mein Vite `/url` ki requests khud backend ko forward karta hai, isliye CORS ki zaroorat nahi.

## Zaroori: short link kholne ke liye redirect route

Aapke backend mein abhi sirf `POST /url` hai. Short link browser mein tab hi khulega
jab ye redirect route add karo:

**controllers/url.js** ke end mein:

```js
export async function redirectUrl(req, res) {
  const entry = await URL.findOneAndUpdate(
    { shortId: req.params.shortId },
    { $push: { visitHistory: { timeStamp: Date.now() } } }
  );
  if (!entry) return res.status(404).json({ error: 'link not found' });
  res.redirect(entry.redirectURL);
}
```

**index.js** mein (`app.use('/url', router)` ke baad):

```js
import { redirectUrl } from './controllers/url.js'
app.get('/:shortId', redirectUrl)
```

## Config

`.env.example` dekho. `VITE_SHORT_BASE` woh address hai jo short link mein dikhta hai
(default `http://localhost:8001`). Deploy karte waqt `VITE_API_BASE` bhi set karna hoga.
