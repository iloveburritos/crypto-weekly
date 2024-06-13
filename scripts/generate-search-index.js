const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const lunr = require('lunr');

const postsDirectory = path.join(process.cwd(), './posts');

function getPostData(fileName) {
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    content: content,
    slug: fileName.replace(/\.md$/, ''),
  };
}

const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
const documents = files.map(getPostData);

const idx = lunr(function () {
  this.ref('slug');
  this.field('title');
  this.field('content');

  documents.forEach(function (doc) {
    this.add(doc);
  }, this);
});

fs.writeFileSync(
  path.join(process.cwd(), 'public', 'search-index.json'),
  JSON.stringify({ documents, idx })
);

console.log('Search index generated.');