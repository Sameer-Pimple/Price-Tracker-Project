# Frontend Documentation (React)

## Overview
This frontend is a React single-page app built with Create React App. It focuses on product tracking, price history visualization, and a set of marketing pages. All backend communication goes through a centralized API service layer.

## Folder Map
- `src/App.js`
  - App entry with `react-router-dom` routes and shared `Navbar`.
- `src/index.js`
  - React root render and web-vitals hook.
- `src/services/api.js`
  - Single API bridge for all network requests and normalization.
- `src/pages/`
  - `Home.jsx`: track product URLs, list recently tracked products.
  - `Product.jsx`: product details, live scrape check, CTA to history.
  - `History.jsx`: price history chart and trend insights.
- `src/components/`
  - `Navbar.jsx`: top-level navigation links.
  - `UrlForm.jsx`: URL input + basic validation.
  - `StatusComponents.jsx`: shared Loading/Error/Empty states.
  - `ProductInfo.jsx`: product summary and availability badge.
  - `PriceChart.jsx`: chart.js line chart for price history.
- `src/marketing/`
  - `Landing.jsx`, `Deals.jsx`, `Trends.jsx`, `Alerts.jsx`: marketing pages.
- `src/utils/frontend-helpers.js`
  - Formatting utilities and trend calculation.
- `src/index.css`
  - App-wide styling and layout rules.
- `src/App.css`
  - App-specific overrides (currently not referenced directly in code).

## Routing
Defined in `src/App.js`:
- `/` -> `Home`
- `/product/:id` -> `Product`
- `/history/:id` -> `History`
- `/landing` -> `Home` (note: `Landing` component is imported but not routed)
- `/deals` -> `Deals`
- `/trends` -> `Trends`
- `/alerts` -> `Alerts`

## API Bridge
`src/services/api.js` is the only place that performs HTTP requests.
- Base URL: `REACT_APP_API_URL` (default: `http://localhost:8080`).
- Normalizes responses for UI safety and consistency.
- Distinguishes network failures vs API errors.
- Mock toggle: `REACT_APP_USE_MOCKS` (`true` uses mock data, `false` uses real backend).

Endpoints used by the frontend:
- `POST /api/track` -> `trackProduct(url)`
  - Expects `{ url }`, returns normalized `{ id, status, message }`.
- `GET /api/products` -> `getAllProducts()`
  - Normalizes list for UI grid.
- `GET /api/products/:id` -> `getProductById(id)`
  - Normalizes fields and provides fallback values.
- `GET /api/products/:id/history` -> `getPriceHistory(id)`
  - Normalizes to `{ date, price, currency }`.
- `POST /api/scrape/amazon` -> `checkLiveStatus(url)`
  - Direct scraper call for live availability + rating.

## Page Behavior
- `Home.jsx`
  - Loads tracked products on mount.
  - Submits new Amazon URL (basic validation) to tracking endpoint.
  - Navigates to `/product/:id` on success.
- `Product.jsx`
  - Loads product details by ID.
  - Allows live scraper check for availability + rating.
  - Shows action buttons to view history or open Amazon.
- `History.jsx`
  - Loads price history.
  - Uses `calculateTrends` to display direction + min/max/current.
  - Renders `PriceChart` when data exists.

## Utilities
- `formatCurrency(amount, currency)`
  - Formats amounts with `Intl.NumberFormat` (INR default).
- `formatRelativeTime(dateString)`
  - Converts ISO dates to human-friendly relative time.
- `calculateTrends(history)`
  - Computes min/max/current and direction from price history.

## Styling
- Global styling and page layout in `src/index.css`.
- Includes global sections styling, navbar styles, and page-specific layout rules.

## Dependencies (from `package.json`)
- React 19, React Router DOM 7.
- Charting: `chart.js` + `react-chartjs-2`.
- Testing: React Testing Library + Jest DOM.

## Notes
- `Landing.jsx` is currently not wired to `/landing`.
- `History.jsx` relies on hooks and components but the import list is incomplete in the file header.
