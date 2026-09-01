# Tensor Theorist

A math blog and public study notebook.

- **Blog** — long-form essays on classical problems (Riemann Hypothesis, Collatz, famous problems, popular math). Markdown source under `blog/<slug>/index.md`. Static images and interactive assets under `assets/blogs/<slug>/`.
- **Notes** — short study notes organised by field: algebra, analysis, topology, number theory, specialized. Sources under `notes/<category>/<subject>/<page>.md`.
- **Competitive** — problem-solving notes for JEE, AIME, IMO, INMO, Putnam.

## Structure

```
/
├── index.html                     # Home
├── blog.html / blog-post.html     # Blog listing + article reader
├── notes.html / notes-category.html / note-post.html
├── about.html
├── style.css / script.js
├── deploy.sh                      # ./deploy.sh "<msg>" — commit + push
├── blog/<slug>/index.md           # Blog markdown
├── notes/<cat>/<sub>/<page>.md    # Notes markdown
├── assets/
│   ├── blogs/<slug>/              # Images, interactive JS per post
│   └── textbooks/                 # Textbook covers for the notes book rack
└── scripts/
    └── blog/<slug>/*.py           # Reference implementations
    └── notes/<cat>/<sub>/*.py     # (mirror of the site tab tree)
```

## Rendering features

- KaTeX inline (`$...$`) and display (`$$...$$`) math.
- Syntax highlighting via highlight.js.
- Markdown embed markers:
  - `!pdf[file.pdf]` / `!pdf-full[file.pdf]` — inline PDF viewer.
  - `!ppt[file.pptx]` — inline PowerPoint viewer.
  - `!interactive[<slug>]` — hydrates a component from `assets/blogs/<post-id>/<slug>.js`.

## Deploy

```bash
./deploy.sh "Your commit message"
```

Commits every staged change and pushes to `main`. GitHub Pages rebuilds on push; live at https://tensortheorist.github.io.

## Local preview

```bash
python3 -m http.server 8000
```

then open http://localhost:8000.
