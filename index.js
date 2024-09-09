const name = new URLSearchParams(location.search).get('doc');

if(name){
  //문서 내용 가지고 오기
  fetch(`https://raw.githubusercontent.com/jedenzero/alcze/main/docs/${name}`)
    .then(response => response.text())
    .then(data => {
      document.querySelector('#content').innerHTML = marked.parse(data);
    });
}

//문서 목록 가지고 오기
fetch(`https://api.github.com/repos/jedenzero/alcze/contents/docs`)
  .then(response => response.json())
  .then(data => {const list = data;});

//문서 검색
