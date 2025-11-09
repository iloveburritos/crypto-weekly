#!/usr/bin/env python3
"""
Article Processing Script
Automatically summarizes converted markdown articles and adds them to the latest post.
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Tuple, Optional, Dict
from datetime import datetime
import time

# Load environment variables from .env.local
try:
    from dotenv import load_dotenv
    # Look for .env.local in parent directory
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass  # dotenv not installed, will try to use environment variables directly

# Configuration
CONVERTED_MARKDOWN_DIR = "converted_markdown"
POSTS_DIR = "../posts"
LINKS_FILE = "links.md"
LOG_FILE = "article_processing_log.txt"
API_TIMEOUT = 60  # seconds
MAX_RETRIES = 3

# Try importing required libraries
try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False


class ArticleProcessor:
    """Processes articles and adds summaries to posts."""

    def __init__(self):
        self.processing_log = []
        self.api_client = None
        self.use_anthropic = False
        self.use_openai = False
        self.links_map = {}

        # Initialize API client
        self._initialize_api_client()

    def _initialize_api_client(self):
        """Initialize API client for summarization."""
        # Try Anthropic first
        if HAS_ANTHROPIC and os.getenv('ANTHROPIC_API_KEY'):
            try:
                self.api_client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
                self.use_anthropic = True
                self.log("Initialized Anthropic API client")
                return
            except Exception as e:
                self.log(f"Failed to initialize Anthropic: {str(e)}")

        # Try OpenAI
        if HAS_OPENAI and os.getenv('OPENAI_API_KEY'):
            try:
                openai.api_key = os.getenv('OPENAI_API_KEY')
                self.use_openai = True
                self.log("Initialized OpenAI API client")
                return
            except Exception as e:
                self.log(f"Failed to initialize OpenAI: {str(e)}")

        self.log("WARNING: No API client available. Install anthropic or openai and set API key.")
        self.log("Install with: pip install anthropic OR pip install openai")
        self.log("Set environment variable: export ANTHROPIC_API_KEY='your-key' OR export OPENAI_API_KEY='your-key'")

    def log(self, message: str):
        """Add message to processing log."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        self.processing_log.append(log_entry)
        print(log_entry)

    def save_log(self, log_path: Path):
        """Save processing log to file."""
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.processing_log))

    def load_links_map(self, links_file: Path) -> Dict[str, str]:
        """
        Load links from links.md and create a mapping.

        Args:
            links_file: Path to links.md file

        Returns:
            Dictionary mapping article identifiers to URLs
        """
        links_map = {}

        try:
            with open(links_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract all URLs
            urls = [line.strip() for line in content.split('\n') if line.strip().startswith('http')]

            for url in urls:
                # Extract key parts from URL for matching
                url_parts = url.split('/')
                if url_parts:
                    slug = url_parts[-1] if url_parts[-1] else url_parts[-2]  # Last non-empty part

                    # Detect source from URL
                    if 'bloomberg.com' in url:
                        source = 'bloomberg'
                    elif 'theblock.co' in url:
                        source = 'theblock'
                    elif 'unchained' in url:
                        source = 'unchained'
                    elif 'fortune.com' in url:
                        source = 'fortune'
                    elif 'reuters.com' in url:
                        source = 'reuters'
                    elif 'decrypt.co' in url:
                        source = 'decrypt'
                    else:
                        source = 'unknown'

                    # Store full URL path for better matching (not just slug)
                    full_path = '/'.join(url_parts[3:])  # Everything after domain

                    links_map[slug.lower()] = {
                        'url': url,
                        'source': source,
                        'slug': slug.lower(),
                        'full_path': full_path.lower()
                    }

            self.log(f"Loaded {len(links_map)} URLs from links.md")
            return links_map

        except Exception as e:
            self.log(f"ERROR: Failed to load links: {str(e)}")
            return {}

    def find_matching_url(self, article_title: str) -> Optional[str]:
        """
        Find matching URL for article title.

        Args:
            article_title: Article title from markdown file

        Returns:
            Matching URL or None
        """
        # Normalize title for matching
        normalized_title = article_title.lower()
        normalized_title = re.sub(r'[^\w\s-]', '', normalized_title)
        normalized_title = re.sub(r'\s+', '-', normalized_title)

        # Extract source from title (more comprehensive)
        source = None
        if 'bloomberg' in normalized_title:
            source = 'bloomberg'
        elif 'the-block' in normalized_title or normalized_title.endswith('-the-block'):
            source = 'theblock'
        elif 'unchained' in normalized_title:
            source = 'unchained'
        elif 'fortune' in normalized_title or 'fortune-crypto' in normalized_title:
            source = 'fortune'
        elif 'reuters' in normalized_title:
            source = 'reuters'
        elif 'decrypt' in normalized_title:
            source = 'decrypt'

        # Extract keywords from title (remove common words and source names)
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                      'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were',
                      'bloomberg', 'theblock', 'the-block', 'fortune', 'fortune-crypto',
                      'crypto', 'reuters', 'unchained', 'decrypt'}

        title_words = [w for w in normalized_title.split('-') if w and w not in stop_words]

        # Try to find best match
        best_match = None
        best_score = 0

        for slug, link_info in self.links_map.items():
            # Prefer source match but don't require it
            source_bonus = 0.3 if source and link_info['source'] == source else 0

            # Get words from both slug and full path for better matching
            url_text = link_info['full_path'].replace('/', '-')
            url_words = [w for w in url_text.split('-') if w and w not in stop_words]

            # Calculate similarity based on word overlap
            title_set = set(title_words)
            url_set = set(url_words)
            common_words = title_set.intersection(url_set)

            if len(common_words) > 0:
                # Use Jaccard similarity with source bonus
                jaccard = len(common_words) / len(title_set.union(url_set))
                score = jaccard + source_bonus

                # Extra boost for exact slug matches
                if any(word in link_info['slug'] for word in title_words[:5]):  # First 5 words
                    score += 0.1

                if score > best_score:
                    best_score = score
                    best_match = link_info['url']

        # Lower threshold to 0.2 for better matching
        if best_score > 0.2:
            return best_match

        return None

    def summarize_article(self, article_path: Path) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Summarize article in one sentence using API.

        Args:
            article_path: Path to article markdown file

        Returns:
            Tuple of (success, summary, error_message)
        """
        try:
            # Read article content
            with open(article_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract title from frontmatter
            title_match = re.search(r'title:\s*"([^"]+)"', content)
            title = title_match.group(1) if title_match else article_path.stem

            # Remove frontmatter and get article text
            content_parts = content.split('---', 2)
            if len(content_parts) >= 3:
                article_text = content_parts[2].strip()
            else:
                article_text = content

            # Limit content length for API
            if len(article_text) > 8000:
                article_text = article_text[:8000] + "..."

            prompt = "Summarize this article in one sentence:"

            # Try with retries
            for attempt in range(MAX_RETRIES):
                try:
                    if self.use_anthropic:
                        response = self.api_client.messages.create(
                            model="claude-3-haiku-20240307",
                            max_tokens=200,
                            messages=[{
                                "role": "user",
                                "content": f"{prompt}\n\n{article_text}"
                            }],
                            timeout=API_TIMEOUT
                        )
                        summary = response.content[0].text.strip()
                        return True, summary, None

                    elif self.use_openai:
                        response = openai.ChatCompletion.create(
                            model="gpt-4",
                            messages=[
                                {"role": "system", "content": "You are a helpful assistant that summarizes articles in one sentence."},
                                {"role": "user", "content": f"{prompt}\n\n{article_text}"}
                            ],
                            max_tokens=200,
                            timeout=API_TIMEOUT
                        )
                        summary = response.choices[0].message.content.strip()
                        return True, summary, None
                    else:
                        return False, None, "No API client available"

                except Exception as e:
                    if attempt < MAX_RETRIES - 1:
                        wait_time = (attempt + 1) * 2
                        self.log(f"API call failed (attempt {attempt + 1}/{MAX_RETRIES}), retrying in {wait_time}s: {str(e)}")
                        time.sleep(wait_time)
                    else:
                        return False, None, f"API call failed after {MAX_RETRIES} attempts: {str(e)}"

        except Exception as e:
            return False, None, f"Error reading article: {str(e)}"

    def get_latest_post(self, posts_dir: Path) -> Optional[Path]:
        """
        Get the latest post file by modification time.

        Args:
            posts_dir: Path to posts directory

        Returns:
            Path to latest post or None
        """
        try:
            post_files = list(posts_dir.glob('*.md'))
            if not post_files:
                return None

            # Sort by modification time (most recent first)
            post_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
            return post_files[0]

        except Exception as e:
            self.log(f"ERROR: Failed to find latest post: {str(e)}")
            return None

    def add_summary_to_post(self, post_path: Path, summary: str, url: str) -> Tuple[bool, str]:
        """
        Add summary to post file.

        Args:
            post_path: Path to post file
            summary: Article summary
            url: Article URL

        Returns:
            Tuple of (success, message)
        """
        try:
            # Read current post content
            with open(post_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find the "THIS WEEK IN CRYPTO" section
            pattern = r'(\*\*THIS WEEK IN CRYPTO\*\*\n)(.*?)(\n\n|$)'
            match = re.search(pattern, content, re.DOTALL)

            if not match:
                return False, "Could not find 'THIS WEEK IN CRYPTO' section"

            # Create new entry with extra line for spacing
            new_entry = f"\\- {summary} [Link]({url}).\n\n"

            # Check if this summary already exists (avoid duplicates)
            if new_entry.strip() in content:
                return False, "Summary already exists in post"

            # Insert new entry after the section header
            before = content[:match.end(1)]
            after = content[match.end():]  # Use match.end() to skip entire matched section

            # If there's already content, add to it
            if match.group(2).strip():
                new_content = before + match.group(2).rstrip() + "\n\n" + new_entry + after
            else:
                new_content = before + new_entry + after

            # Write updated content
            with open(post_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            return True, "Successfully added summary to post"

        except Exception as e:
            return False, f"Error updating post: {str(e)}"

    def process_article(self, article_path: Path, post_path: Path) -> Tuple[bool, str]:
        """
        Process a single article.

        Args:
            article_path: Path to article markdown file
            post_path: Path to post file

        Returns:
            Tuple of (success, message)
        """
        article_name = article_path.name

        try:
            self.log(f"Processing: {article_name}")

            # Summarize article
            success, summary, error = self.summarize_article(article_path)
            if not success:
                return False, f"Failed to summarize: {error}"

            self.log(f"Generated summary: {summary[:100]}...")

            # Find matching URL
            url = self.find_matching_url(article_path.stem)
            if not url:
                # Use blank link if URL not found
                url = ""
                self.log(f"Warning: No URL found, using blank link")
            else:
                self.log(f"Found URL: {url}")

            # Add to post
            success, msg = self.add_summary_to_post(post_path, summary, url)
            if not success:
                return False, msg

            return True, "Successfully processed article"

        except Exception as e:
            return False, f"Unexpected error: {str(e)}"


def main():
    """Main processing function."""
    script_dir = Path(__file__).parent
    converted_dir = script_dir / CONVERTED_MARKDOWN_DIR
    posts_dir = script_dir / POSTS_DIR
    links_file = script_dir / LINKS_FILE

    processor = ArticleProcessor()

    processor.log("=" * 80)
    processor.log("Article Processing Script Started")
    processor.log("=" * 80)

    # Load links
    processor.links_map = processor.load_links_map(links_file)
    if not processor.links_map:
        processor.log("ERROR: No links loaded. Cannot proceed.")
        return

    # Get target post file from command line argument or prompt
    if len(sys.argv) > 1:
        # Use command line argument
        post_path = Path(sys.argv[1])
        if not post_path.exists():
            processor.log(f"ERROR: File not found: {post_path}")
            return
    else:
        # Prompt user for file path
        processor.log("\nNo target post specified.")
        processor.log("Usage: python process_articles.py <path-to-post-file>")
        processor.log("Example: python process_articles.py ../posts/10-19-2025.md")
        return

    processor.log(f"Target post: {post_path}")

    # Get all articles
    article_files = list(converted_dir.glob('*.md'))
    if not article_files:
        processor.log("No articles found to process")
        return

    processor.log(f"Found {len(article_files)} article(s) to process")
    processor.log("-" * 80)

    # Process each article
    successful = 0
    failed = 0
    skipped = 0
    blank_links = 0

    for article_path in sorted(article_files):
        try:
            success, msg = processor.process_article(article_path, post_path)

            if success:
                successful += 1
                # Check if it was added with blank link
                if "blank link" in processor.processing_log[-2] if len(processor.processing_log) > 1 else False:
                    blank_links += 1
                    processor.log(f"⚠ {article_path.name}: {msg} (blank link)")
                else:
                    processor.log(f"✓ {article_path.name}: {msg}")
            elif "already exists" in msg:
                skipped += 1
                processor.log(f"⊘ {article_path.name}: {msg}")
            else:
                failed += 1
                processor.log(f"✗ {article_path.name}: {msg}")

            # Small delay between API calls
            time.sleep(1)

        except Exception as e:
            failed += 1
            processor.log(f"✗ {article_path.name}: Unexpected error: {str(e)}")

    # Summary
    processor.log("-" * 80)
    processor.log("Processing complete!")
    processor.log(f"Successful (with URL): {successful - blank_links}")
    processor.log(f"Successful (blank link): {blank_links}")
    processor.log(f"Failed: {failed}")
    processor.log(f"Skipped (already in post): {skipped}")
    processor.log(f"Total: {len(article_files)}")

    # Save log
    log_path = script_dir / LOG_FILE
    processor.save_log(log_path)
    processor.log(f"Log saved to: {log_path}")


if __name__ == "__main__":
    main()
