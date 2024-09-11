const name = new URLSearchParams(location.search).get('doc');
let list = [];

if(name){
  //문서 내용 가지고 오기
  fetch(`https://raw.githubusercontent.com/jedenzero/alcze/main/docs/${name}`)
    .then(response => response.text())
    .then(data => {
        document.querySelector('#content').innerHTML = `<h1>${name.replace('.md', '')}</h1>`;
        document.querySelector('#content').innerHTML += marked.parse(data);
    })
    .catch(() => {
        document.querySelector('#content').innerHTML = `<div class="danger">존재하지 않는 문서입니다.</div>`;
    });
}

//문서 목록 가지고 오기
fetch(`https://api.github.com/repos/jedenzero/alcze/contents/docs`)
  .then(response => response.json())
  .then(data => {list = data;});

//문서 검색
function search(){
    
    const keyword = document.querySelector('input').value;
    let result = list.filter(doc => doc.includes(keyword));
    
    result.sort((a,b) => a.length-b.length || a.localeCompare(b));
    result = result.slice(0,5);
    result.forEach(doc => {
        document.querySelector('#result').append(`<a href="/?doc=${doc}"><div>${doc.replace('.md', '')}</div></a>`);
    });
}