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

### Notes

- Tags are free-form; each gets a page at `/blog/tags/<tag>` listing every post on it, oldest first.
- New posts go out by email automatically: Buttondown watches `https://justinrowsell.dev/rss.xml`.
- Leave old posts up. Revise with `updated:` rather than deleting.

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
