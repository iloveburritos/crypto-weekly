#!/usr/bin/env python3
"""
PDF to Markdown Converter
Converts all PDF files in the current directory to markdown files.
Handles special characters, large files, and includes error handling.
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Tuple, Optional
import concurrent.futures
from datetime import datetime

# Try importing required libraries
try:
    import pdfplumber
except ImportError:
    print("Error: pdfplumber not found. Install with: pip install pdfplumber")
    sys.exit(1)

# Configuration
MAX_FILE_SIZE_MB = 50  # Maximum PDF file size to process
MAX_WORKERS = 4  # Number of parallel workers
LOG_FILE = "conversion_log.txt"


class PDFConverter:
    """Handles PDF to Markdown conversion with error handling."""

    def __init__(self, max_file_size_mb: int = MAX_FILE_SIZE_MB):
        self.max_file_size_bytes = max_file_size_mb * 1024 * 1024
        self.conversion_log = []

    def sanitize_filename(self, filename: str) -> str:
        """
        Sanitize filename by removing/replacing special characters.

        Args:
            filename: Original filename

        Returns:
            Sanitized filename safe for filesystem
        """
        # Remove .pdf extension if present
        name = filename.replace('.pdf', '')

        # Replace problematic characters with safe alternatives
        # Keep alphanumeric, spaces, hyphens, underscores
        name = re.sub(r'[^\w\s\-]', '', name)

        # Replace multiple spaces with single space
        name = re.sub(r'\s+', ' ', name)

        # Trim whitespace
        name = name.strip()

        # Limit filename length
        if len(name) > 200:
            name = name[:200]

        return name + '.md'

    def check_file_size(self, pdf_path: Path) -> Tuple[bool, str]:
        """
        Check if file size is within acceptable limits.

        Args:
            pdf_path: Path to PDF file

        Returns:
            Tuple of (is_valid, message)
        """
        file_size = pdf_path.stat().st_size
        file_size_mb = file_size / (1024 * 1024)

        if file_size > self.max_file_size_bytes:
            return False, f"File too large: {file_size_mb:.2f}MB (max: {self.max_file_size_bytes / (1024 * 1024)}MB)"

        return True, f"File size OK: {file_size_mb:.2f}MB"

    def fix_doubled_characters(self, text: str) -> Tuple[str, bool]:
        """
        Detect and fix doubled character encoding issues.
        Some PDFs have font encoding issues where each character appears twice.

        Args:
            text: Input text potentially with doubled characters

        Returns:
            Tuple of (fixed_text, was_fixed)
        """
        if not text or len(text) < 100:
            return text, False

        # Sample the text to detect if it has doubled characters
        # Check first 500 characters for the pattern
        sample = text[:500]

        # Count sequences where the same character appears twice consecutively
        doubled_count = 0
        total_chars = 0

        i = 0
        while i < len(sample) - 1:
            char1 = sample[i]
            char2 = sample[i + 1]

            # Skip whitespace and newlines
            if char1.isalnum() or char1 in '.,;:!?-_':
                total_chars += 1
                if char1 == char2:
                    doubled_count += 1
                    i += 2  # Skip both characters
                    continue
            i += 1

        # If more than 40% of characters are doubled, likely encoding issue
        if total_chars > 20 and (doubled_count / total_chars) > 0.4:
            # Fix the doubled characters by removing every other duplicate
            fixed_text = []
            i = 0
            while i < len(text):
                if i < len(text) - 1 and text[i] == text[i + 1]:
                    # Keep only one character
                    fixed_text.append(text[i])
                    i += 2
                else:
                    fixed_text.append(text[i])
                    i += 1

            return ''.join(fixed_text), True

        return text, False

    def extract_text_from_pdf(self, pdf_path: Path) -> Tuple[bool, str, Optional[str]]:
        """
        Extract text from PDF file.

        Args:
            pdf_path: Path to PDF file

        Returns:
            Tuple of (success, message, extracted_text)
        """
        try:
            text_content = []

            with pdfplumber.open(pdf_path) as pdf:
                total_pages = len(pdf.pages)

                if total_pages == 0:
                    return False, "PDF has no pages", None

                for page_num, page in enumerate(pdf.pages, 1):
                    try:
                        text = page.extract_text()
                        if text:
                            text_content.append(f"\n\n--- Page {page_num} ---\n\n")
                            text_content.append(text)
                    except Exception as e:
                        self.log(f"Warning: Could not extract page {page_num}: {str(e)}")
                        continue

                if not text_content:
                    return False, "No text could be extracted from PDF", None

                return True, f"Successfully extracted {total_pages} pages", ''.join(text_content)

        except Exception as e:
            return False, f"Error reading PDF: {str(e)}", None

    def create_markdown(self, pdf_path: Path, text: str) -> str:
        """
        Create markdown content from extracted text.

        Args:
            pdf_path: Path to original PDF
            text: Extracted text content

        Returns:
            Formatted markdown content
        """
        # Extract title from filename
        title = pdf_path.stem

        # Create markdown with frontmatter
        markdown = f"""---
title: "{title}"
source: "{pdf_path.name}"
converted: "{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
---

# {title}

{text.strip()}
"""
        return markdown

    def convert_pdf(self, pdf_path: Path, output_dir: Path) -> Tuple[bool, str]:
        """
        Convert a single PDF to markdown.

        Args:
            pdf_path: Path to PDF file
            output_dir: Directory to save markdown file

        Returns:
            Tuple of (success, message)
        """
        try:
            # Check file size
            size_ok, size_msg = self.check_file_size(pdf_path)
            self.log(f"{pdf_path.name}: {size_msg}")

            if not size_ok:
                return False, size_msg

            # Extract text
            success, msg, text = self.extract_text_from_pdf(pdf_path)

            if not success:
                return False, msg

            # Fix doubled character encoding issues
            text, was_fixed = self.fix_doubled_characters(text)
            if was_fixed:
                self.log(f"{pdf_path.name}: Fixed doubled character encoding")

            # Create markdown
            markdown_content = self.create_markdown(pdf_path, text)

            # Generate output filename
            output_filename = self.sanitize_filename(pdf_path.name)
            output_path = output_dir / output_filename

            # Ensure unique filename
            counter = 1
            original_output_path = output_path
            while output_path.exists():
                name_without_ext = original_output_path.stem
                output_path = output_dir / f"{name_without_ext}_{counter}.md"
                counter += 1

            # Write markdown file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(markdown_content)

            return True, f"Converted to {output_path.name}"

        except Exception as e:
            return False, f"Unexpected error: {str(e)}"

    def log(self, message: str):
        """Add message to conversion log."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        self.conversion_log.append(log_entry)
        print(log_entry)

    def save_log(self, log_path: Path):
        """Save conversion log to file."""
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.conversion_log))


def find_pdf_files(directory: Path) -> List[Path]:
    """Find all PDF files in directory."""
    return list(directory.glob('*.pdf'))


def process_single_pdf(args: Tuple[Path, Path, PDFConverter]) -> Tuple[Path, bool, str]:
    """
    Process a single PDF file (for parallel processing).

    Args:
        args: Tuple of (pdf_path, output_dir, converter)

    Returns:
        Tuple of (pdf_path, success, message)
    """
    pdf_path, output_dir, converter = args
    success, msg = converter.convert_pdf(pdf_path, output_dir)
    return pdf_path, success, msg


def main():
    """Main conversion process."""
    # Setup
    script_dir = Path(__file__).parent
    output_dir = script_dir / 'converted_markdown'
    output_dir.mkdir(exist_ok=True)

    converter = PDFConverter(max_file_size_mb=MAX_FILE_SIZE_MB)

    # Find PDF files
    pdf_files = find_pdf_files(script_dir)

    if not pdf_files:
        converter.log("No PDF files found in directory")
        return

    converter.log(f"Found {len(pdf_files)} PDF file(s) to process")
    converter.log(f"Output directory: {output_dir}")
    converter.log(f"Max file size: {MAX_FILE_SIZE_MB}MB")
    converter.log(f"Using {MAX_WORKERS} parallel workers")
    converter.log("-" * 80)

    # Process PDFs in parallel
    successful = 0
    failed = 0

    # Prepare arguments for parallel processing
    process_args = [(pdf, output_dir, converter) for pdf in pdf_files]

    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Submit all tasks
            future_to_pdf = {
                executor.submit(process_single_pdf, args): args[0]
                for args in process_args
            }

            # Process results as they complete
            for future in concurrent.futures.as_completed(future_to_pdf):
                pdf_path = future_to_pdf[future]
                try:
                    _, success, msg = future.result()

                    if success:
                        successful += 1
                        converter.log(f"✓ {pdf_path.name}: {msg}")
                    else:
                        failed += 1
                        converter.log(f"✗ {pdf_path.name}: {msg}")

                except Exception as e:
                    failed += 1
                    converter.log(f"✗ {pdf_path.name}: Unexpected error: {str(e)}")

    except KeyboardInterrupt:
        converter.log("\nConversion interrupted by user")

    # Summary
    converter.log("-" * 80)
    converter.log(f"Conversion complete!")
    converter.log(f"Successful: {successful}")
    converter.log(f"Failed: {failed}")
    converter.log(f"Total: {len(pdf_files)}")

    # Save log
    log_path = script_dir / LOG_FILE
    converter.save_log(log_path)
    converter.log(f"Log saved to: {log_path}")


if __name__ == "__main__":
    main()
