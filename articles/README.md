# Articles Processing Suite

Two scripts for processing crypto articles:
1. **convert_pdfs.py** - Converts PDF files to markdown format
2. **process_articles.py** - Summarizes articles and adds them to posts

## Features

- **Special Character Handling**: Automatically sanitizes filenames with special characters
- **File Size Validation**: Checks file sizes and skips files larger than 50MB (configurable)
- **Parallel Processing**: Uses multi-threading for efficient batch conversion
- **Error Recovery**: Continues processing even if individual files fail
- **Progress Logging**: Creates detailed logs of the conversion process
- **Duplicate Handling**: Automatically handles duplicate filenames

## Installation

Install required dependencies:

```bash
pip install pdfplumber
```

## Usage

Navigate to the articles folder and run:

```bash
python convert_pdfs.py
```

The script will:
1. Find all PDF files in the current directory
2. Convert them to markdown format
3. Save markdown files to `converted_markdown/` folder
4. Generate a conversion log in `conversion_log.txt`

## Configuration

You can modify these settings at the top of `convert_pdfs.py`:

- `MAX_FILE_SIZE_MB`: Maximum PDF file size to process (default: 50MB)
- `MAX_WORKERS`: Number of parallel workers (default: 4)
- `LOG_FILE`: Name of the log file (default: "conversion_log.txt")

## Output Format

Each markdown file includes:
- Frontmatter with title, source PDF name, and conversion timestamp
- Page markers showing original PDF page numbers
- Full extracted text content

Example:
```markdown
---
title: "Article Title"
source: "original-file.pdf"
converted: "2025-10-19 12:00:00"
---

# Article Title

--- Page 1 ---

[Content from page 1]

--- Page 2 ---

[Content from page 2]
```

## Error Handling

The script handles:
- **Special characters in filenames**: Automatically sanitized
- **Large files**: Files exceeding size limit are skipped with warning
- **Corrupted PDFs**: Logged as errors, conversion continues
- **Empty PDFs**: Detected and logged
- **Extraction failures**: Per-page errors logged, recoverable pages still processed
- **Duplicate filenames**: Automatically appended with `_1`, `_2`, etc.

## Troubleshooting

**Import Error: pdfplumber not found**
```bash
pip install pdfplumber
```

**File too large error**
Increase `MAX_FILE_SIZE_MB` in the script or compress your PDF.

**No text extracted**
The PDF may be image-based. Consider using OCR tools like `pytesseract` for scanned documents.

## Log File

Check `conversion_log.txt` for:
- Processing timestamps
- File size validations
- Success/failure status for each file
- Detailed error messages
- Conversion summary

## Performance

- Small files (<1MB): ~1-2 seconds per file
- Medium files (1-5MB): ~5-10 seconds per file
- Large files (>5MB): ~15-30 seconds per file

Parallel processing significantly reduces total conversion time for multiple files.

---

# Article Processing Script (process_articles.py)

Automatically summarizes all articles in `converted_markdown/` and adds them to the latest post with proper links.

## Features

- **AI-Powered Summaries**: Uses Claude or GPT-4 to generate one-sentence summaries
- **Automatic Link Matching**: Finds matching URLs from `links.md`
- **Duplicate Detection**: Skips articles already in the post
- **Retry Logic**: Handles API timeouts with automatic retries
- **Comprehensive Logging**: Logs all operations, errors, and timeouts

## Installation

Install required dependencies and set up API key:

```bash
pip install anthropic
# OR
pip install openai

# Set API key (choose one)
export ANTHROPIC_API_KEY='your-anthropic-key'
# OR
export OPENAI_API_KEY='your-openai-key'
```

## Usage

Navigate to the articles folder and run:

```bash
python process_articles.py
```

The script will:
1. Load all URLs from `links.md`
2. Find the latest post in `../posts/`
3. For each article in `converted_markdown/`:
   - Generate a one-sentence summary using AI
   - Find the matching URL from `links.md`
   - Add the summary to the post in format: `\- Summary. [Link](URL).`
4. Generate a processing log in `article_processing_log.txt`

## Configuration

Settings in `process_articles.py`:
- `API_TIMEOUT`: Timeout for API calls (default: 60 seconds)
- `MAX_RETRIES`: Number of retry attempts (default: 3)

## Output Format

Articles are added to the "THIS WEEK IN CRYPTO" section:

```markdown
**THIS WEEK IN CRYPTO**
\- Paxos accidentally minted $300 trillion of PayPal's PYUSD stablecoin but immediately burned the excess tokens. [Link](https://www.bloomberg.com/news/...).
```

## Error Handling

The script handles:
- **API Timeouts**: Automatically retries with exponential backoff
- **Missing URLs**: Logs articles with no matching URL
- **Duplicate Entries**: Skips articles already in the post
- **API Failures**: Logs errors and continues with remaining articles
- **Network Issues**: Retries up to 3 times before failing

## Link Matching

The script uses intelligent matching:
1. Extracts source (Bloomberg, The Block, Unchained) from title
2. Normalizes article title to slug format
3. Compares with URL slugs from `links.md`
4. Finds best match with >30% word overlap

## Log File

Check `article_processing_log.txt` for:
- API initialization status
- URLs loaded from links.md
- Summary generation results
- Link matching results
- Success/failure status for each article
- Processing summary with counts

## Troubleshooting

**No API client available**
```bash
pip install anthropic
export ANTHROPIC_API_KEY='your-key'
```

**API timeout errors**
Increase `API_TIMEOUT` value in the script or check your network connection.

**Could not find matching URL**
Ensure the article URL exists in `links.md` with correct format.

**Summary already exists**
The article was already processed. This is expected behavior.
