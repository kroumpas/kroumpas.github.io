#!/usr/bin/env python3
"""Turn a "News item" issue (.github/ISSUE_TEMPLATE/0_news_item.yml) into a file in _news/.

Run by .github/workflows/news-from-issue.yml. The issue is read from the event payload, never through the
shell, so nothing typed into the issue is executed.
"""

import datetime as dt
import json
import os
import re
import sys
import urllib.request
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

LABELS = {"Date": "date", "Text": "text", "Link (optional)": "link", "Image (optional)": "image", "Image type": "fit"}
IMAGE_HOSTS = {"github.com", "user-images.githubusercontent.com", "private-user-images.githubusercontent.com"}
IMAGE_TYPES = {"image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp"}
MAX_IMAGE_BYTES = 15 * 1024 * 1024


def fail(message):
    print(f"::error::{message}")
    sys.exit(1)


def sections(body):
    """Split the issue body into the form's fields."""
    fields = {}
    parts = re.split(r"^### (.+?)[ \t]*$", body or "", flags=re.M)
    for i in range(1, len(parts) - 1, 2):
        key = LABELS.get(parts[i].strip())
        if key:
            value = parts[i + 1].strip()
            fields[key] = "" if value == "_No response_" else value
    return fields


def slugify(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug[:50].strip("-") or "news"


class DropAuthOnRedirect(urllib.request.HTTPRedirectHandler):
    """Don't send the GitHub token on to the storage host that attachments redirect to."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        new = super().redirect_request(req, fp, code, msg, headers, newurl)
        if new is not None and urlparse(newurl).hostname != urlparse(req.full_url).hostname:
            new.remove_header("Authorization")
        return new


def download(url, token):
    if urlparse(url).scheme != "https" or urlparse(url).hostname not in IMAGE_HOSTS:
        fail(f"The image should be dragged into the issue, so it's hosted on GitHub. Got: {url}")
    request = urllib.request.Request(url, headers={"User-Agent": "news-from-issue"})
    if token and urlparse(url).hostname == "github.com":
        request.add_header("Authorization", f"token {token}")
    opener = urllib.request.build_opener(DropAuthOnRedirect)
    with opener.open(request, timeout=60) as response:
        content_type = response.headers.get_content_type()
        data = response.read(MAX_IMAGE_BYTES + 1)
    if content_type not in IMAGE_TYPES:
        fail(f"The image isn't a PNG, JPG, GIF or WebP file (got {content_type}).")
    if len(data) > MAX_IMAGE_BYTES:
        fail("The image is larger than 15 MB.")
    return data, IMAGE_TYPES[content_type]


def main(event_path):
    with open(event_path, encoding="utf-8") as f:
        issue = json.load(f)["issue"]
    fields = sections(issue.get("body"))

    text = fields.get("text", "").strip()
    if not text:
        fail("The Text field is empty.")

    today = dt.datetime.now(ZoneInfo("Europe/Athens")).date()
    raw_date = fields.get("date", "").strip()
    if raw_date:
        try:
            date = dt.date.fromisoformat(raw_date)
        except ValueError:
            fail(f"The date should look like 2026-11-07. Got: {raw_date}")
        if date > today:
            fail("The date is in the future, and the site only shows news once its date has passed. Use today's date.")
    else:
        date = today

    link = fields.get("link", "").strip()
    if link:
        if urlparse(link).scheme not in ("http", "https"):
            fail(f"The link should start with https://. Got: {link}")
        text = f"{text} [More]({link})"

    title = re.sub(r"^news:\s*", "", issue.get("title") or "", flags=re.I).strip()
    slug = slugify(title or text)
    base = f"{date.isoformat()}-{slug}"
    name, n = base, 2
    while os.path.exists(f"_news/{name}.md"):
        name, n = f"{base}-{n}", n + 1

    front = ["---", "layout: post", f"date: {date.isoformat()}", "inline: true", "related_posts: false"]

    match = re.search(r"!\[[^\]]*\]\((\S+?)\)|<img[^>]*\ssrc=\"([^\"]+)\"", fields.get("image", ""))
    if match:
        data, ext = download(match.group(1) or match.group(2), os.environ.get("GH_TOKEN"))
        os.makedirs("assets/img/news", exist_ok=True)
        image_path = f"assets/img/news/{name}.{ext}"
        with open(image_path, "wb") as f:
            f.write(data)
        fit = "cover" if fields.get("fit", "").lower().startswith("photo") else "contain"
        front += [f"thumbnail: {image_path}", f"thumbnail_fit: {fit}", f"thumbnail_alt: {json.dumps(title or 'news image')}"]

    front += ["---", ""]
    os.makedirs("_news", exist_ok=True)
    path = f"_news/{name}.md"
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        # raw: braces typed in the text are shown as they are rather than read as Liquid.
        f.write("\n".join(front) + "\n{% raw %}" + text + "{% endraw %}\n")

    with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a", encoding="utf-8") as out:
        out.write(f"file={path}\n")
    print(f"Wrote {path}")


if __name__ == "__main__":
    main(sys.argv[1])
