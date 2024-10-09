import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Doc() {
    const [content, setContent] = useState('');
    const [list, setList] = useState([]);
    const [result, setResult] = useState([]);
    const [theme, setTheme] = useState('');
    const router = useRouter();
    const { docName } = router.query;

    useEffect(() => {
        if (router.isReady && docName) {
            console.log(docName);
            fetch(`/api/getDoc?docName=${encodeURIComponent(docName ? docName : '대문')}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('문서를 불러오는 데 실패했습니다.');
                    }
                    return response.json();
                })
                .then(data => {
                    setContent(data.doc);
                    setTheme(data.theme);
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
    }, [router.isReady, docName]);
    
    useEffect(() => {
        if (theme) {
            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = `https://jedenzero.github.io/alcze/themes/${theme}.css`;
            document.head.appendChild(themeLink);
        }
    }, [theme]);
    
    const search = (keyword) => {
        const filteredResults = list.filter(item => item.includes(keyword));
        filteredResults.sort((a, b) => a.length - b.length || a.localeCompare(b));
        setResult(filteredResults.slice(0, 5));
    };

    return (
        <div>
            <Head>
                <title>{docName ? docName : '대문'}</title>
                <meta name="google-site-verification" content="Fb4dZfbsUFfHNH2547L2XC-Rc_80cWN8gcomQge5t7k"/>
            </Head>
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
                        <a key={index} href={`/${doc}`}>
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
