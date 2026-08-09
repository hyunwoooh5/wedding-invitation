# Wedding Invitation

A simple GitHub Pages Jekyll template for a wedding invitation page.

## Setup

1. Clone repository to GitHub Pages branch or repo.
2. Add your wedding details to `_data/wedding.yml`.
3. Replace image files under `assets/images/`.
4. Update `url` in `_config.yml` with your GitHub Pages URL.

## Build

This site uses plain Jekyll and can be built with:

```bash
bundle exec jekyll build
```

Or serve locally with:

```bash
bundle exec jekyll serve
```

## Notes

- This repository uses a custom layout in `_layouts/default.html`.
- Add static images into `assets/images/`.
- The `index.html` page uses data from `_data/wedding.yml`.
