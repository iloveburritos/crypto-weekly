# Crypto Weekly site

Next.js (Pages Router) site for the Crypto Weekly newsletter. Issues are published first on Substack (https://thisweekincrypto.substack.com) and mirrored here as markdown in `posts/`.

## Adding posts

- Import new Substack issues with `node tools/import-substack.js` (`--dry-run` to preview). It only imports issues dated after the newest file in `posts/`, writing `posts/MM-DD-YYYY.md` and `public/images/MM-DD-YYYY-1.png`.
- One image per post: `![Image](/images/MM-DD-YYYY-1.png)` under the price table. Never add a `-2.png`.
- Keep the content exactly as published on Substack. If an item has a "Link" with no URL, leave it as-is and report it rather than guessing a URL.
- After adding a post, run `npm run build` (it regenerates `public/search-index.json` and checks the site builds).
- Commit the post, its image, and `public/search-index.json` together, with a message like `Add 10-18-26 post - restored from Substack archive`, and push to `main`. No PR needed.

## Notes

- `scripts/` is gitignored (private); `scripts/generate-search-index.js` is the one tracked exception. Put new shared tooling in `tools/`.
- There was no publishing between 5/24/2026 and 7/12/2026; that gap is intentional, so don't try to fill it.
