import fetch from 'node-fetch';
import marked from 'marked';

export default async function handler(req, res) {
    const { docName } = req.query;

    if (!docName) {
        return res.status(400).json({ error: '문서 이름이 필요합니다.' });
    }

    try {
        const response = await fetch(`https://raw.githubusercontent.com/jedenzero/alcze/main/docs/${encodeURIComponent(docName)}.md`);
        if (!response.ok) {
            throw new Error('문서를 불러오는 데 실패했습니다.');
        }

        const data = await response.text();
        const {doc, theme} = parseMarkdown(data);
        res.status(200).json({doc, theme});
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: '존재하지 않는 문서입니다.' });
    }
}

const parseMarkdown = (doc) => {
    let theme = '';
    if (doc.match(/^<<[^\n>]+>>\n/)) {
        doc = doc.replace(/^<<([^\n>]+)>>\n/, (match, captured_theme) => {
            theme = captured_theme;
            return '';
        });
    }

    doc = marked.parse(doc);
    doc = doc.replace(/<a href="([^"]+)">/g, '<a href="/$1">');
    doc = doc.replace(/(?<=<a href="[^"]*)_(?=[^">]*">)/g, ' ');
    doc = doc.replace(/\[\[([^\[\]\n]+)\]\]/g, '<a href="/$1">$1</a>');
    doc = doc.replace(/<img src="([^"]+)"/g, '<img src="/imgs/$1"');
    doc = `<h1>${docName}</h1>` + doc;
    return {doc, theme};
};
