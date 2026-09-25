// Canonical origin, used for permalinks, the RSS feed, and social/canonical tags.
export const SITE_URL = 'https://justinrowsell.dev';

export const BLOG_NAME = 'Far Afield';
export const BLOG_TITLE = `${BLOG_NAME} — Justin Rowsell`;
export const BLOG_DESCRIPTION =
	'Short, dated notes on what I’m building, learning, and still confused about. Early takes stay up.';
// Link-preview image for blog pages (JPEG, since some sites won't show WebP).
export const BLOG_IMAGE = '/images/far-afield.jpg';

// Buttondown handles email: it watches /rss.xml and mails new posts to subscribers.
export const BUTTONDOWN_USERNAME = 'justinrowsell';
export const BUTTONDOWN_SUBSCRIBE_URL = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;
