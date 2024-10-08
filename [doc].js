import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import './index.css';

function App(){
    const [content, setContent] = useState('');
    const name = [doc];

    useEffect(() => {
        fetch(`https://raw.githubusercontent.com/jedenzero/alcze/main/docs/${name}.md`)
            .then(response => {
                if (!response.ok) throw new Error('문서를 불러오는 데 실패했습니다.');
                return response.text();
            })
            .then(data => {
                setContent(marked(data));
            })
            .catch(() => {
                setContent('<div class="danger">존재하지 않는 문서입니다.</div>');
            });
    }, [name]);

    return (
        <div>
            <div id="navbar">
                <div id="logo">
                    <img src="./imgs/알체_로고_색상.svg" alt="알체 로고" />
                </div>
                <div id="inputbox">
                    <input
                        spellCheck="false"
                        onInput={() => search()}
                        onFocus={() => document.querySelector('#resultbox').style.display = 'block'}
                    />
                </div>
            </div>
            <div id="resultbox">
                <div id="result"></div>
            </div>
            <div id="contentbox" onClick={() => document.querySelector('#resultbox').style.display = 'none'}>
                <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('content'));
