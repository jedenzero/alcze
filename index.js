const name = new URLSearchParams(location.search).get('doc');
let list = [];

if(name){
  //문서 내용 가지고 오기
  fetch(`https://raw.githubusercontent.com/jedenzero/alcze/main/docs/${name}.md`)
    .then(response => response.text())
    .then(data => {
        document.querySelector('#content').innerHTML = `<h1>${name}</h1>`;
        document.querySelector('#content').innerHTML += parse(data);
    })
    .catch(() => {
        document.querySelector('#content').innerHTML = `<div class="danger">존재하지 않는 문서입니다.</div>`;
    });
}

//문서 목록 가지고 오기
fetch(`https://api.github.com/repos/jedenzero/alcze/contents/docs`)
  .then(response => response.json())
  .then(data => {
    list = data.map(obj => obj['name'].replace('.md', ''));
  });

//문서 검색
function search(){
    document.querySelector('#result').innerHTML = '';
    
    const keyword = document.querySelector('input').value;
    let result = list.filter(doc => doc.includes(keyword));
    
    result.sort((a,b) => a.length-b.length || a.localeCompare(b));
    result = result.slice(0,5);
    result.forEach(doc => {
        document.querySelector('#result').innerHTML += `<a href="./?doc=${doc}"><div>${doc}</div></a>`;
    });
}

function parse(doc){
  if(doc.match(/^<<[^\n>]+>>\n/)){
    let theme = '';
    doc = doc.replace(/^<<([^\n>]+)>>\n/,(match, captured_theme)=>{
      theme = captured_theme;
      return '';
    });
    
    const theme_link = document.createElement('link');
    theme_link.rel = 'stylesheet';
    theme_link.href = `./themes/${theme}.css`;
    document.head.appendChild(theme_link);
    document.querySelector('#theme_default').disabled = true;
  }
  doc = marked.parse(doc);
  doc = doc.replace(/<a href="([^"]+)">/g, '<a href="./?doc=$1">');
  doc = doc.replace(/(?<=<a href="[^"]*)_(?=[^">]*">)/g, ' ');
  doc = doc.replace(/\[\[([^\[\]\n]+)\]\]/g, '<a href="./?doc=$1">$1</a>');
  doc = doc.replace(/<img src="([^"]+)"/g, '<img src="./imgs/$1"');
  return doc;
}
