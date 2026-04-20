/**
 * Page registry for NavigationTracker (Base44 app logs).
 * Keys must match the first URL path segment (case-insensitive); "/" uses mainPage.
 * No React imports — avoids bundling unused template pages that reference missing @/entities/*.
 */
const PAGE_KEYS = [
  "Landing",
  "Subscription",
  "Results",
  "Terms",
  "Privacy",
  "Home",
  "Search",
  "Favourites",
  "Profile",
];

export const PAGES = Object.fromEntries(PAGE_KEYS.map((k) => [k, null]));

export const pagesConfig = {
  mainPage: "Landing",
  Pages: PAGES,
};
