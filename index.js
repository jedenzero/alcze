import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';

function Content() {
    const [content, setContent] = useState('');
    const name = window.location.pathname.slice(1);

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
        <div dangerouslySetInnerHTML={{__html:content }}/>
    );
}

ReactDOM.render(<Content/>, document.querySelector('#content'));