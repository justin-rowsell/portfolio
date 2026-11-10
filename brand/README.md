# Newsletter branding

Assets and settings for the Far Afield emails Buttondown sends from `/rss.xml`. Nothing here is built into the site; it all gets pasted or uploaded in the Buttondown dashboard.

## Settings → Basic (branding)

- **Icon:** upload `newsletter-icon.png` (300×300, the compass mark from the Far Afield logo).
- **Share image:** upload `newsletter-share.jpg` (1080×1080).
- **Tint color:** `#DC0000`, the site's red. It colors links and the Subscribe button.

## Settings → Email design

- **CSS:** paste the contents of `buttondown.css`.

## Settings → RSS-to-email

Each email opens with a short blurb about the blog, then each post's title, a preview of its opening, and a link to read the rest on the site. The loop works whether Buttondown sends one email per post or a digest.

- **Behavior:** send a new email for every new item.
- **Subject:**

  ```
  Far Afield: {{ items.0.title }}
  ```

  The feed is newest first, so this is the latest post's title.

- **Body:**

  ```
  Far Afield is where I keep short, dated notes on what I'm building, learning, and still figuring out: AI tutoring, climate, building solo, CTO work, and wherever else curiosity leads. Expect quick notes, not polished essays. Here's the latest.

  {% for item in items %}
  ---

  ## [{{ item.title }}]({{ item.url }})

  {{ item.content|truncatewords_html:60|safe }}

  **[Keep reading on Far Afield →]({{ item.url }})**
  {% endfor %}
  ```

  Change the `60` to lengthen or shorten the preview.

Regenerating the images: `newsletter-icon.png` is a 420px crop of `static/images/far-afield.jpg` at offset (253, 66), scaled to 300. `newsletter-share.jpg` is that photo along the bottom of a square, with its sky extended upward.
