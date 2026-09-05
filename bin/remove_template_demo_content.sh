#!/usr/bin/env bash
# Removes the leftover al-folio demo content that is currently live and indexable
# on kroumpas.github.io (33 lorem-ipsum blog posts, "The Godfather" bookshelf,
# "Prof. Data" course pages, hipster-ipsum news announcements, and the theme's
# own plugin-catalog page).
#
# REVIEW THIS LIST BEFORE RUNNING. Run from the repository root:
#   bash bin/remove_template_demo_content.sh
# Then inspect with `git status` and commit if you're happy.

set -euo pipefail

if [ ! -f _config.yml ]; then
  echo "Run this from the repository root (no _config.yml here)." >&2
  exit 1
fi

echo "Removing demo blog posts..."
git rm -q -r --ignore-unmatch _posts

echo "Removing demo news announcements..."
git rm -q --ignore-unmatch _news/announcement_1.md _news/announcement_2.md _news/announcement_3.md

echo "Removing demo bookshelf..."
git rm -q -r --ignore-unmatch _books assets/img/book_covers
git rm -q --ignore-unmatch _pages/books.md

echo "Removing demo course pages..."
git rm -q -r --ignore-unmatch _teachings
git rm -q --ignore-unmatch _pages/teaching.md

echo "Removing theme scaffolding pages..."
git rm -q --ignore-unmatch \
  _pages/about_einstein.md \
  _pages/profiles.md \
  _pages/dropdown.md \
  _pages/plugins.md \
  _pages/blog.md \
  _data/featured_plugins.yml

echo "Removing unused template images and the example PDF..."
git rm -q --ignore-unmatch \
  assets/img/1.jpg assets/img/2.jpg assets/img/3.jpg assets/img/4.jpg \
  assets/img/5.jpg assets/img/6.jpg assets/img/7.jpg assets/img/8.jpg \
  assets/img/9.jpg assets/img/10.jpg assets/img/11.jpg assets/img/12.jpg \
  assets/img/rhino.png assets/img/template_error.png \
  assets/pdf/example_pdf.pdf

cat <<'EOF'

Done. Now:

  1. git status                 # review what was removed
  2. Check _config.yml for any remaining references to the removed
     collections (books / teachings) under `collections:`.
  3. Re-run the site locally if you can, then commit.

Note: some of these URLs are already indexed by Google. After deploying,
add them to Search Console's removal tool, or leave them 404ing and they
will drop out of the index on their own over a few weeks.
EOF
