# 🌈 Nexium – Mood Tracker & Mental Wellness Companion

Nexium is a beautifully designed mood tracking app that empowers users to log daily moods, reflect with notes, and view weekly insights – all built with ❤️ using Next.js, Supabase, and Tailwind CSS.

---

## ✨ Features

- 🔐 **Magic Link Authentication** – Login securely with your email via Supabase Auth.
- 📓 **Mood Logging** – Track how you feel with intensity levels and optional notes.
- 📊 **Weekly Summary** – View automatically generated insights about your emotional trends.
- 📈 **Interactive Mood Chart** – Visualize your emotional journey through time.
- 🎨 **Modern UI/UX** – Gradient backgrounds, animated buttons, toast notifications, and responsive design.
- 🔒 **Secure & Private** – Your data stays safe and belongs to you.

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **Supabase** – Auth & Realtime DB
- **Tailwind CSS** – Styling
- **Recharts** – Graphs and Visualizations
- **n8n** – Weekly summary automation (via webhook)
- **TypeScript** – Optional but recommended

---

## 🚀 Getting Started

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/nexium-mood-tracker.git
cd nexium-mood-tracker
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up Supabase**:

- Create a [Supabase](https://supabase.com/) project.
- Create a `moods` table:
  ```sql
  CREATE TABLE moods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    mood TEXT,
    intensity INTEGER,
    note TEXT,
    created_at TIMESTAMP DEFAULT now()
  );
  ```
- Set up **RLS policies** and enable `uuid-ossp` extension.
- Create a `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

4. **Run the app**:

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

OR

Visit the vercel link to test it directly

## 📁 Folder Structure

```
/app
  ├─ /login            → Magic Link login page
  ├─ /dashboard        → User's home after login
  ├─ /mood             → Mood form + graph
  ├─ /api/weekly-summary → Server-side route for webhook
/lib
  └─ supabaseClient.js
/public
/styles
```

---

## 💡 Tips

- Customize Tailwind animations in `globals.css`
- Adjust your webhook inside `weekly-summary/route.js`
- Add toast UI feedback or sound if you'd like ✨

---

## 🧠 Credits

Built with care by **Eshaal** during internship @ Nexium 🧪

---
