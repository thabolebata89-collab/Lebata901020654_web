# Khanya Library

Community library management system. **Knowledge that lights the way.** Built with React, Vite, React Router v6, plain CSS, and browser Local Storage.

## Project Structure

```text
khanya-library/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/
│       ├── overview.jpg
│       └── sign_in.jpg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── components/
    │   ├── BookForm.jsx
    │   ├── BookRow.jsx
    │   ├── CountUp.jsx
    │   ├── IntroScreen.jsx
    │   ├── MemberBorrowForm.jsx
    │   ├── MemberForm.jsx
    │   ├── MemberLoanRow.jsx
    │   ├── MemberRow.jsx
    │   ├── PageHeading.jsx
    │   ├── Sidebar.jsx
    │   ├── Toast.jsx
    │   └── TransactionForm.jsx
    ├── context/
    │   ├── LibraryContext.js
    │   ├── LibraryContext.jsx
    │   └── useLibrary.js
    ├── pages/
    │   ├── Books.jsx
    │   ├── Members.jsx
    │   ├── Overview.jsx
    │   └── Transactions.jsx
    └── utils/
        ├── localStorage.js
        ├── seedData.js
        └── validators.js
```
## Features

- Add, edit, search, and delete books. ISBN shape, duplicate ISBN, required fields, and whole-number quantities are validated.
- Record arrivals and borrows; members can return borrowed copies. Borrow quantities cannot exceed stock, and returns restore availability. Activity history includes date, book, type, quantity, and member where signed in.
- Admins and librarians can manage books and record stock activity. Members and signed-out visitors can view the collection and transaction history but cannot change them.
- Sign in using a member name and ID, and persist the session across refreshes. Only signed-in admins can view membership IDs or add, update, and delete accounts.
- View live title, copy, and low-stock counts; inventory badges distinguish out of stock, low stock, and in stock.
- First launch seeds ten books, six members, and six recent sample transactions if Khanya's library data is empty. Existing records are not overwritten.

## Run Locally

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Run Without a Development Server

Build the standalone demo, then double-click the project-root `index.html` (it opens the built app from `pages-build`), or open `pages-build/index.html` directly:

```bash
npm run build
```

The built HTML bundles the app into one file and can be opened directly from disk. Keep the `pages-build/images` folder alongside it for local imagery. Google Fonts require an internet connection; the app falls back to system fonts if they are unavailable. Do not open `src/main.jsx` directly.

## Publish on GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys the site whenever code is pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. After the workflow succeeds, the website is available at `https://thabolebata89-collab.github.io/Lebata901020654_web/`.

Check the source and create a production build with:

```bash
npm run lint
npm run build
npm run preview
```

## Demo Sign-In

- Admin: `Lebata Neo` / `KL-26001`
- Librarian: `Korotsoane Thetso` / `KL-26002`
- Member: `Lineo Lehloenya` / `KL-26003`

## Local Data

The browser stores data under `kl_books`, `kl_members`, `kl_transactions`, and `kl_session`. Data is local to the browser profile and is not synchronized. The name-and-membership-ID login is for demonstration only, not secure authentication for real member data. Role checks are client-side because this assignment uses browser Local Storage rather than a server.
