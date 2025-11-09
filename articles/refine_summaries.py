#!/usr/bin/env python3
"""
Summary Refinement Script
Refines article summaries to match the concise, direct writing style of the newsletter.
Run this after process_articles.py to improve AI-generated summaries.
"""

import os
import re
import sys
from pathlib import Path
from typing import Optional
from datetime import datetime

# Load environment variables from .env.local
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass

# Configuration
LOG_FILE = "summary_refinement_log.txt"
API_TIMEOUT = 60
MAX_RETRIES = 3

# Try importing required libraries
try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False


class SummaryRefiner:
    """Refines article summaries to match newsletter style."""

    def __init__(self):
        self.processing_log = []
        self.api_client = None
        self.use_anthropic = False
        self._initialize_api_client()

    def _initialize_api_client(self):
        """Initialize API client for refinement."""
        if HAS_ANTHROPIC and os.getenv('ANTHROPIC_API_KEY'):
            try:
                self.api_client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
                self.use_anthropic = True
                self.log("Initialized Anthropic API client")
                return
            except Exception as e:
                self.log(f"Failed to initialize Anthropic: {str(e)}")

        self.log("WARNING: No API client available. Install anthropic and set API key.")
        self.log("Install with: pip install anthropic")
        self.log("Set environment variable: export ANTHROPIC_API_KEY='your-key'")

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

    def extract_summaries(self, post_path: Path) -> list:
        """
        Extract all summaries from a post file.

        Args:
            post_path: Path to post markdown file

        Returns:
            List of (summary_text, url) tuples
        """
        try:
            with open(post_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find "THIS WEEK IN CRYPTO" section
            pattern = r'\*\*THIS WEEK IN CRYPTO\*\*(.*?)(?:\n\n---|\Z)'
            match = re.search(pattern, content, re.DOTALL)

            if not match:
                self.log("Could not find 'THIS WEEK IN CRYPTO' section")
                return []

            section = match.group(1)

            # Extract individual bullet points with their URLs
            # Pattern: \- summary text [Link](url).
            bullet_pattern = r'\\-\s+(.*?)\s+\[Link\]\((.*?)\)\.'
            summaries = re.findall(bullet_pattern, section, re.DOTALL)

            # Clean up summaries (remove extra whitespace and newlines)
            cleaned = []
            for summary, url in summaries:
                summary = re.sub(r'\s+', ' ', summary).strip()
                url = url.strip()
                cleaned.append((summary, url))

            self.log(f"Extracted {len(cleaned)} summaries from post")
            return cleaned

        except Exception as e:
            self.log(f"ERROR: Failed to extract summaries: {str(e)}")
            return []

    def refine_summary(self, summary: str) -> Optional[str]:
        """
        Refine a summary to match newsletter style.

        Args:
            summary: Original summary text

        Returns:
            Refined summary or None if refinement failed
        """
        if not self.use_anthropic:
            return None

        # Style guide for the AI
        prompt = f"""Refine this crypto news summary to match the concise, direct writing style below.

STYLE RULES:
1. Remove meta-language like "The article summarizes", "The study found", "according to"
2. Lead with the main actor/entity and action (who did what)
3. Use past tense for completed actions
4. Be concise - cut unnecessary adjectives and context
5. Include specific numbers, percentages, and dates
6. Use active voice with strong, direct verbs
7. No promotional or sensational language
8. Keep it to 1-2 sentences maximum

GOOD EXAMPLES:
- "Stablecoin transaction volume on Ethereum reached a record $2.82 trillion in October, driven by traders seeking yield and growing use for payments."
- "Ripple raised $500 million at a $40 billion valuation from Fortress Investment Group and Citadel Securities to expand into custody, stablecoins, and prime brokerage services."
- "55% of hedge funds now hold crypto-related assets, up from 47% last year, with funds allocating an average of 7% of their holdings to crypto."

BAD EXAMPLES (don't write like this):
- "The article summarizes that the crypto bear market has wiped out..."
- "According to a recent industry survey, more than half of global hedge funds..."
- "The study found that a significant portion of the trading volume..."

ORIGINAL SUMMARY:
{summary}

REFINED SUMMARY (write only the refined version, nothing else):"""

        try:
            response = self.api_client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=300,
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                timeout=API_TIMEOUT
            )
            refined = response.content[0].text.strip()

            # Remove any quotes the AI might have added
            refined = refined.strip('"\'')

            return refined

        except Exception as e:
            self.log(f"ERROR: Failed to refine summary: {str(e)}")
            return None

    def update_post(self, post_path: Path, summaries: list) -> bool:
        """
        Update post file with refined summaries.

        Args:
            post_path: Path to post file
            summaries: List of (summary_text, url) tuples

        Returns:
            True if successful, False otherwise
        """
        try:
            with open(post_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find "THIS WEEK IN CRYPTO" section
            pattern = r'(\*\*THIS WEEK IN CRYPTO\*\*\n)(.*?)(?=\n\n---|\Z)'
            match = re.search(pattern, content, re.DOTALL)

            if not match:
                self.log("ERROR: Could not find 'THIS WEEK IN CRYPTO' section")
                return False

            # Build new section
            new_section = match.group(1)
            for summary, url in summaries:
                new_section += f"\\- {summary} [Link]({url}).\n\n"

            # Replace old section with new
            new_content = content[:match.start()] + new_section + content[match.end():]

            # Write back
            with open(post_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            self.log(f"Successfully updated {post_path}")
            return True

        except Exception as e:
            self.log(f"ERROR: Failed to update post: {str(e)}")
            return False


def main():
    """Main processing function."""
    script_dir = Path(__file__).parent

    refiner = SummaryRefiner()

    refiner.log("=" * 80)
    refiner.log("Summary Refinement Script Started")
    refiner.log("=" * 80)

    # Get target post file from command line
    if len(sys.argv) > 1:
        post_path = Path(sys.argv[1])
        if not post_path.exists():
            refiner.log(f"ERROR: File not found: {post_path}")
            return
    else:
        refiner.log("\nNo target post specified.")
        refiner.log("Usage: python refine_summaries.py <path-to-post-file>")
        refiner.log("Example: python refine_summaries.py ../posts/11-09-2025.md")
        return

    refiner.log(f"Target post: {post_path}")
    refiner.log("-" * 80)

    # Extract existing summaries
    summaries = refiner.extract_summaries(post_path)
    if not summaries:
        refiner.log("No summaries found to refine")
        return

    # Refine each summary
    refined_summaries = []
    successful = 0
    failed = 0

    for i, (summary, url) in enumerate(summaries, 1):
        refiner.log(f"\nProcessing summary {i}/{len(summaries)}")
        refiner.log(f"Original: {summary[:100]}...")

        refined = refiner.refine_summary(summary)

        if refined and refined != summary:
            refiner.log(f"Refined: {refined[:100]}...")
            refined_summaries.append((refined, url))
            successful += 1
        else:
            # Keep original if refinement failed or no change
            refiner.log("Keeping original (no improvement or refinement failed)")
            refined_summaries.append((summary, url))
            if not refined:
                failed += 1

        # Small delay between API calls
        import time
        time.sleep(0.5)

    # Update post with refined summaries
    refiner.log("-" * 80)
    if refiner.update_post(post_path, refined_summaries):
        refiner.log("Post updated successfully!")
    else:
        refiner.log("Failed to update post")

    # Summary
    refiner.log("-" * 80)
    refiner.log("Processing complete!")
    refiner.log(f"Summaries refined: {successful}")
    refiner.log(f"Summaries kept unchanged: {len(summaries) - successful}")
    refiner.log(f"Failed: {failed}")
    refiner.log(f"Total: {len(summaries)}")

    # Save log
    log_path = script_dir / LOG_FILE
    refiner.save_log(log_path)
    refiner.log(f"Log saved to: {log_path}")


if __name__ == "__main__":
    main()
