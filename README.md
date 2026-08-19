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
- Set `venue.map_embed_url` in both language sections to the Google Maps embed
	URL for the venue. The venue map is rendered as a responsive iframe. Add the
	parking and metro map images to `assets/images/` using the filenames
	`parking-map.png` and `metro-map.png`, or change the matching
	`venue.parking_map` and `venue.metro_map` values. Update the matching
	`*_map_alt` values to describe each image.
- `contact.groom_url` and `contact.bride_url` accept external KakaoTalk or
	LINE links. The same contact URLs should be kept in both language sections.
- `_layouts/default.html` defines the shared page shell and language button.
- `assets/js/main.js` applies translations and stores the selected language in
	browser `localStorage` under `preferredLang`.
- `index.html` renders the initial Korean content and attaches translation keys
	with `data-key` attributes.
- `assets/css/style.css` controls the visual design.
- The letter intro optionally personalizes its greeting and RSVP name field
	from a URL such as `?to=Name`. This is client-side and not private; anyone can
	change the name in the URL.
- The starting language can be selected with `?language=ko` or `?language=tw`.
	The value is case-insensitive, so `?language=TW` works too. Both parameters
	can be combined, for example `?to=Name&language=tw`.
- The direct language pages are `/wedding-invitation/kr/` and
	`/wedding-invitation/tw/`. Share `/wedding-invitation/tw/` for Taiwanese
	chat previews; it contains Taiwanese metadata and content without a redirect.
- Edit `extra.guest_note` in both language sections of `_data/wedding.yml` to
	change the personalized letter message. Keep `{guest}` where the guest name
	should appear.
- The Google Calendar button opens a pre-filled event. The Apple Calendar button
	downloads an `.ics` calendar file that can be opened by Apple Calendar.

## RSVP Endpoint

GitHub Pages cannot receive form submissions itself. Set `extra.rsvp_endpoint`
in both language sections of `_data/wedding.yml` to a public HTTPS endpoint.

### Google Apps Script

1. Create a Google Sheet for responses and open **Extensions > Apps Script**.
2. Add a `doPost` function that reads `name`, `attendance`, and `message` from
	 `e.parameter`, then appends them to the sheet.
3. Deploy it as a web app with **Execute as: Me** and **Who has access: Anyone**.
4. Copy the `/exec` URL into `ko.extra.rsvp_endpoint` and `tw.extra.rsvp_endpoint`.
5. Rebuild and deploy the Jekyll site.

The browser sends the RSVP as a `POST` request using `FormData`. Do not put
private API keys or credentials in the repository; the endpoint URL is visible
to anyone who can view the page.

Formspree can be used instead by creating a form and placing its HTTPS endpoint
in the same `rsvp_endpoint` fields.

## Troubleshooting

- If a new string does not change languages, add the same nested key to both
	`ko` and `tw` in `_data/wedding.yml`, then rebuild.
- If the page stays in the previous language, clear the site's browser storage
	or run `localStorage.removeItem('preferredLang')` in the browser console.
- If images or CSS are missing on GitHub Pages, check that `baseurl` matches
	the repository name and that asset paths use `site.baseurl`.
- If Jekyll fails to start, run `bundle install` again and check the first error
	shown by `bundle exec jekyll build`.
