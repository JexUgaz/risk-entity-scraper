# Risk Entity Scraper

A scraper for detecting entities in high-risk lists, built with TypeScript and Puppeteer.

---

## 🚀 Clone the Project

Clone the repository:

```bash
git clone https://github.com/JexUgaz/risk-entity-scraper.git
cd risk-entity-scraper
```

## 📦 Install Dependencies

You can use either pnpm or npm:

```bash
# Using pnpm
pnpm install

# Or using npm
npm install
```

## ⚙️ Environment Setup

1. Copy the .env.example file to .env:

```bash
cp .env.example .env
```

2. Open .env and add a random value for the JWT_SECRET:

```bash
JWT_SECRET=your_random_secure_value
```

3. Set the path to the Google Chrome executable depending on your OS:

```bash
# Windows
CHROME_EXECUTABLE_PATH="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

# macOS
CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux (you need to edit the code directly if necessary)
```

⚠️ On Linux, you may need to adjust the code in src/api/controllers/ScraperController.ts to properly locate the Chrome/Chromium executable.

4. Add the internal secret key used to secure internal routes:

```bash
INTERNAL_SECRET_KEY=your_internal_secret_key
```

⚠️ Important: The INTERNAL_SECRET_KEY is required to access internal routes (such as /internal/screening). Only backends or services providing this exact secret can access these routes. Ensure that any backend calling this service uses the same INTERNAL_SECRET_KEY value.

## 🔧 Available Scripts

### Development

Run the project in development mode with auto-reload:

```bash
pnpm run dev
# or
npm run dev
```

### Production

Run the compiled project:

```bash
pnpm run start
# or
npm run start
```

## 🛠 Project Structure

```pgsql
src/
  ├── api/
  ├── config/
  ├── data/
  ├── domain/
  ├── infraestructure/
  └── index.ts
```

## ✅ Requirements

- Node.js >= 18

- Google Chrome installed (and accessible via CHROME_EXECUTABLE_PATH)

- pnpm (optional): npm install -g pnpm
