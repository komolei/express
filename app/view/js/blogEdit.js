let blogEditBtn = document.querySelector('button');
blogEditBtn.addEventListener('click', () => {
    // let url='/blogEdit';
    // use Request and configuration parameter
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let content = document.getElementById('content').value;
    let data = new Object({
        title: title,
        author: author,
        content: content,
    })
    data = JSON.stringify(data);
    // 设置post相关参数
    let hearders1 = {
        'Content-type': 'application/json'
    };

    let url = new Request('/blogEdit', {
        method: 'Post', headers: { //fuck I spell error this is headers and isn't hearders
            'Content-Type': 'application/json'
        }, body: data,
    })

    fetch(url).then((response) => {
        console.log("response:", response);
        return response.json();
    }).then((json) => {
        console.log("this is response:", json);
    }).catch(error => console.log(error))

    // fetch("/blogEdit",{
    //     method:'POST',
    //     headers:{
    //        'Content-Type': 'application/json'
    //     },
    //     body:JSON.stringify({
    //       name:'john',
    //       pass:'xioayuan'
    //     })
    //   })
    //   .then((response)=>response.json())
    //   .then((responseJsonData)=>{
    //     alert("请求成功");
    //     console.log(responseJsonData);
    //   })
    //   .catch((error)=>{
    //     alert(error);
    //   })

})