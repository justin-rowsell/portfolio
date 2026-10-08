# justinrowsell.dev

## Writing a post

Add a markdown file to `src/posts/`. The filename becomes the permanent link, so pick it once and never rename it:
`src/posts/why-i-killed-this-idea.md` → `https://justinrowsell.dev/blog/why-i-killed-this-idea`

```md
---
title: Why I killed this idea
date: 2026-09-24
tags: [building solo, climate]
summary: Optional. Defaults to the first paragraph.
updated: 2026-10-02   # optional, shows a "revised" note
draft: true           # optional, only visible in `npm run dev`
---

Write here.
```

### Photos

Put images in `static/images/<post-slug>/` and reference them from the root. An image on its own line becomes a centered figure, and the quoted text becomes its caption:

```md
![Umbrellas outside a Seoul cafe](/images/more-korea/umbrellas.jpg "We love sunny days, as long as we're not in the sun")
```

Resize phone photos to about 1600px on the long edge before adding them (on a Mac: `sips -Z 1600 photo.jpg`).

### Brainmade mark

Every post shows the [Brainmade](https://brainmade.org) mark at the bottom, next to the permalink, to say a person wrote it. It's public domain and works on the honor system: their bar is roughly 90% human-made. Add `brainmade: false` to a post's frontmatter to hide it there.

### Banner and link previews

Add `image:` to show a full-width photo above the post. The same photo becomes the link preview in iMessage, Slack, Notion bookmarks and so on, along with the title and `summary`. Leave out `image:` to use the blog banner instead, and set `summary: ""` to send no description.

```md
image: /images/my-post/fuego-after-dark.jpg
```

### From Notion

Write the post in Notion, then import it:

```bash
npm run notion -- https://www.notion.so/... --title "Optional title override"
```

This writes `src/posts/<slug>.md` as a draft and copies every image into `static/images/<slug>/`, resizing photos the same way as above. Notion's own image links expire after an hour, so they can't be linked directly. The page's cover photo becomes the banner unless the post already has an `image:` you picked. Run the command again after editing in Notion to update the post: the body and banner are refreshed, the rest of the frontmatter is left as you edited it, and a published post gets an `updated:` date.

Formatting carries over: headings, bold/italic/strikethrough/underline, text colors and highlights, links, lists, checklists, quotes, callouts, toggles, code, tables, columns, dividers, images with captions, and YouTube/Vimeo/Loom videos. Sub-pages and equations don't carry over; the command lists anything it skipped.

From a database, it also reads these columns if they exist: **Tags** or **Topic**, **Summary**, **Date** or **Publish Date**, and **Slug**.

One-time setup:

1. Create an internal integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) (read content is enough) and copy its token.
2. Add it to a `.env` file in the project root (it's gitignored): `NOTION_TOKEN=ntn_...`
3. In Notion, open the page or database your posts live in, choose **••• → Connections**, and add the integration. Pages inside it are covered too.

### Notes

- Tags are free-form; each gets a page at `/blog/tags/<tag>` listing every post on it, oldest first.
- New posts go out by email automatically: Buttondown watches `https://justinrowsell.dev/rss.xml`.
- Leave old posts up. Revise with `updated:` rather than deleting.

### Cross-posting

After a post is live, `npm run crosspost` (newest post) or `npm run crosspost <slug>` opens a page with copy buttons for Substack and Indie Hackers. Links and images point back at the site, and the copy ends with an "Originally published on Far Afield" link.

- **Substack:** paste the title and subtitle into their fields, then use "Copy body for Substack" and paste into the editor. Turn off "Send via email" when publishing, since Buttondown already emails subscribers.
- **Indie Hackers:** use "Copy markdown for Indie Hackers".

## SvelteKit

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
