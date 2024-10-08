import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import marked from 'marked';

export default function Doc() {
    const [content, setContent] = useState('');
    const [list, setList] = useState([]);
    const [result, setResult] = useState([]);
    const router = useRouter();
    const { doc } = router.query;

    useEffect(() => {
        if (doc) {
            fetch(`https://raw.githubusercontent.com/jedenzero/alcze/main/docs/${doc}.md`)
                .then(response => {
                    return response.text();
                })
                .then(data => {
                    setContent(parseMarkdown(data));
                })
                .catch(() => {
                    setContent('<div class="danger">존재하지 않는 문서입니다.</div>');
                });

            fetch(`https://api.github.com/repos/jedenzero/alcze/contents/docs`)
                .then(response => response.json())
                .then(data => {
                    const documents = data.map(obj => obj['name'].replace('.md', ''));
                    setList(documents);
                });
        }
    }, [doc]);

    const search = (keyword) => {
        const filteredResults = list.filter(item => item.includes(keyword));
        filteredResults.sort((a, b) => a.length - b.length || a.localeCompare(b));
        setResult(filteredResults.slice(0, 5));
    };

    const parseMarkdown = (doc) => {
        let theme = '';
        if (doc.match(/^<<[^\n>]+>>\n/)) {
            doc = doc.replace(/^<<([^\n>]+)>>\n/, (match, captured_theme) => {
                theme = captured_theme;
                return '';
            });

            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = `https://jedenzero.github.io/alcze/themes/${theme}.css`;
            document.head.appendChild(themeLink);
            document.querySelector('#theme_default').disabled = true;
        }

        doc = marked.parse(doc);
        doc = doc.replace(/<a href="([^"]+)">/g, '<a href="./$1">');
        doc = doc.replace(/(?<=<a href="[^"]*)_(?=[^">]*">)/g, ' ');
        doc = doc.replace(/\[\[([^\[\]\n]+)\]\]/g, '<a href="./$1">$1</a>');
        doc = doc.replace(/<img src="([^"]+)"/g, '<img src="https://jedenzero.github.io/alcze/imgs/$1"');
        return doc;
    };

    return (
        <div>
            <div id="navbar">
                <div id="logo">
                    <img src="https://jedenzero.github.io/alcze/imgs/알체_로고_색상.svg" alt="알체 로고"/>
                </div>
                <div id="inputbox">
                    <input
                        spellCheck="false"
                        onInput={(e) => search(e.target.value)}
                        onFocus={() => document.querySelector('#resultbox').style.display = 'block'}
                    />
                </div>
            </div>
            <div id="resultbox" style={{ display: result.length ? 'block' : 'none' }}>
                <div id="result">
                    {result.map((doc, index) => (
                        <a key={index} href={`./${doc}`}>
                            <div>{doc}</div>
                        </a>
                    ))}
                </div>
            </div>
            <div id="contentbox" onClick={() => document.querySelector('#resultbox').style.display = 'none'}>
                <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}
