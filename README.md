# NovelNest

**NovelNest** is a beautiful, modern, single-page web application created by olwethu hadebe that lets you **discover**, **search**, **read**, and **download** free public-domain books — powered entirely by the [Gutendex API](https://gutendex.com/) (a clean JSON wrapper around [Project Gutenberg](https://www.gutenberg.org/)).

No backend, no login required, no ads — just timeless literature in your browser.

![NovelNest screenshot – hero section with trending books](https://via.placeholder.com/1280x720/111827/ffffff?text=NovelNest+Screenshot)  
*(Replace this placeholder with a real screenshot of your app)*

## Features

- Browse **trending / most-downloaded** books right now
- Search by title, author, topic, mood or keyword
- Beautiful book detail view with cover, metadata, subjects & download links
- In-browser **reader** (plain text / HTML formats)
- Download books in multiple formats (txt, epub, kindle, html…)
- **Favorites** list (persisted in localStorage)
- Pinned / Library view
- Responsive dark-mode-first design with Tailwind CSS
- Random book discovery (dice button 🎲)
- Keyboard shortcut: `/` to focus search

## Technologies

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Vanilla HTML5 + CSS + JavaScript    |
| Styling     | Tailwind CSS (via CDN)              |
| Icons       | Font Awesome 6 (via CDN)            |
| Fonts       | Playfair Display + Inter (Google Fonts) |
| Data source | Gutendex API (`https://gutendex.com/books`) |
| Storage     | browser `localStorage`              |

## Demo

Try it live:  
**(You can host this anywhere — GitHub Pages, Vercel, Netlify, Cloudflare Pages, or just open the HTML file locally.)**

Example deployment links (add yours here once hosted):
- https://your-username.github.io/novelnest/
- https://novelnest.vercel.app/

## How to Use / Install

### Option 1: Run locally (easiest)

1. Download or copy the entire code into a file named `index.html`
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari…)
3. That's it — no installation needed!

### Option 2: Host online (recommended for sharing)

1. Create a GitHub repository
2. Upload `index.html` (and optionally a screenshot)
3. Enable **GitHub Pages** in repo settings → main branch → / (root)
4. Your site will be live at `https://yourusername.github.io/your-repo-name/`

Alternative free hosts:
- [Vercel](https://vercel.com) – drag & drop or Git
- [Netlify](https://app.netlify.com/drop) – drag the HTML file
- [Cloudflare Pages](https://pages.cloudflare.com/)

## Project Structure

## Known Limitations / Notes

- Reader works best with plain text or clean HTML formats
- Some very old books have formatting quirks in plain text
- No offline support yet (Service Worker could be added later)
- LocalStorage favorites are per-browser/device only
- Gutendex sometimes returns partial results — API is very reliable though

## Future Ideas

- Add light/dark mode toggle
- Offline caching of book metadata & covers (PWA)
- Reading progress tracking
- Category / collection browsing
- Export favorites as JSON/CSV
- Multiple language support beyond English

## License

MIT License

Feel free to use, modify, fork, and share this project.  
Attribution appreciated but not required.

Made with ❤️ for free literature lovers.

## Acknowledgments

- [Project Gutenberg](https://www.gutenberg.org/) — 70,000+ free ebooks
- [Gutendex API](https://gutendex.com/) by Gareth Johnson — excellent, fast metadata API
- Tailwind CSS team
- Font Awesome & Google Fonts

---

Happy reading! 📖
