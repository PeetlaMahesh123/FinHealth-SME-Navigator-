
# FinHealth SME Navigator

A world-class financial health assessment tool for SMEs, powered by Google Gemini AI.

## 🚀 Quick Start for Deployment

To make this app live on GitHub Pages, follow these three steps:

### 1. Setup GitHub Secrets
1. Go to your GitHub Repository **Settings**.
2. Navigate to **Secrets and variables** > **Actions**.
3. Add a **New repository secret**:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: `your_actual_gemini_api_key_here`

### 2. Configure Pages
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

### 3. Push to Main
- Simply push your code to the `main` branch. 
- GitHub will automatically trigger the workflow in `.github/workflows/deploy.yml`.
- Your site will be live at `https://<your-username>.github.io/<repo-name>/` within minutes.

## 🛠 Features
- **AI Financial Auditor**: Deep analysis of P&L, Balance Sheets, and Cash Flow.
- **Credit Risk Engine**: Automated credit grading (A+ to D) and borrowing capacity estimation.
- **Multilingual Support**: Instant switching between English, Hindi, Gujarati, Marathi, Bengali, Tamil, and Telugu.
- **Scenario Modeling**: "What-if" simulations for market volatility.
- **Privacy First**: AES-256 encrypted local storage for audit history.

## 💻 Local Development
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file: `VITE_GEMINI_API_KEY=your_key_here`.
4. Start the dev server: `npm run dev`.
