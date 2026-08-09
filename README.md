# Wedding Invitation

A Jekyll wedding invitation for GitHub Pages. The invitation supports Korean
and Taiwanese Mandarin (Traditional Chinese), switched with the `TW` button.

## Setup

1. Install Ruby and Bundler.
2. Run `bundle install` from the repository root.
3. Add your wedding details to `_data/wedding.yml`.
4. Replace image files under `assets/images/`.
5. Update `url` and `baseurl` in `_config.yml` for your GitHub Pages site.
6. Replace `contact.groom_url` and `contact.bride_url` in both language
	sections with the couple's KakaoTalk or LINE profile links.

The translation keys are `ko` for Korean and `tw` for Taiwanese Mandarin.
Keep the same keys in both sections when adding or removing invitation text.

## Build

This site uses plain Jekyll and can be built with:

```bash
bundle exec jekyll build
```

The generated website is written to `_site/`. Do not edit files in `_site/`;
change the source files and build again.

Or serve locally with:

```bash
bundle exec jekyll serve
```

For the project-page path used by this repository:

```bash
bundle exec jekyll serve --baseurl "/wedding-invitation" --livereload
```

Open `http://localhost:4000/wedding-invitation/` in a browser.

## Notes

- `_data/wedding.yml` contains all Korean and Taiwanese Mandarin text.
- Typography is language-aware: Korean content and its invitation title use
	Pretendard, Taiwanese Mandarin uses Noto Serif TC, and English titles use
	Great Vibes.
- Add gallery images to `assets/images/`, then add one `src` and `alt` entry
	for each image under both `ko.gallery` and `tw.gallery`. The gallery has no
	visible captions; clicking an image opens the expanded viewer.
- `contact.groom_url` and `contact.bride_url` accept external KakaoTalk or
	LINE links. The same contact URLs should be kept in both language sections.
- `_layouts/default.html` defines the shared page shell and language button.
- `assets/js/main.js` applies translations and stores the selected language in
	browser `localStorage` under `preferredLang`.
- `index.html` renders the initial Korean content and attaches translation keys
	with `data-key` attributes.
- `assets/css/style.css` controls the visual design.

## Troubleshooting

- If a new string does not change languages, add the same nested key to both
	`ko` and `tw` in `_data/wedding.yml`, then rebuild.
- If the page stays in the previous language, clear the site's browser storage
	or run `localStorage.removeItem('preferredLang')` in the browser console.
- If images or CSS are missing on GitHub Pages, check that `baseurl` matches
	the repository name and that asset paths use `site.baseurl`.
- If Jekyll fails to start, run `bundle install` again and check the first error
	shown by `bundle exec jekyll build`.
