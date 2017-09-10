//load aniamte
let loadAniamte = () => {
    let loadAniamte = document.getElementsByClassName('spinner')[0];
    loadAniamte.classList.remove('hide');
}
let missAniamte = () => {
    let loadAniamte = document.getElementsByClassName('spinner')[0];
    loadAniamte.classList.add('hide');
}
//signIn
let signInDialog = document.getElementById('signInDialog');
signInDialog.addEventListener('click', () => {
    document.getElementsByClassName('signInDialog')[0].classList.toggle('changeDialog');
})
let signInBtn = document.getElementById('signInBtn');
console.log("signInBtn:", signInBtn);
let isLockUp = false;
signInBtn.addEventListener('click', () => {
    loadAniamte();
    let loadAniamte = document.getElementsByClassName('spinner')[0];
    let email = document.getElementById('inputEmail').value;
    let username = document.getElementById('inputName').value;
    let password = document.getElementById('inputPassword').value;
    // empty password
    document.getElementById('inputPassword').value = '';
    console.log("username:", username, password);
    let xhr = new XMLHttpRequest(),
        method = 'POST',
        url = '/signIn';
    if (isLockUp) return;
    isLockUp = true;
    xhr.onreadystatechange = (username, password) => {
        // the data loaded,the loadAniamte miss
        missAniamte();
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("gg", xhr.responseText);
            let text = xhr.responseText;
            document.getElementById('signInDialog').innerHTML = "<a href='javascript:void(0)'>welcome " + JSON.parse(text).username + "</a>"
            // hide Dialog
            document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');

            alert('sign In')
            return isLockUp = false;
        }
        else {
            //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
            //alert('sorry! Can"t find user');
            return isLockUp = false;
        }
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send('email=' + email + '&username=' + username + '&password=' + password);
    //md. 一样的写法，现在就行了，idiot 🙄
})
//signUp
let changeSignUp = document.getElementById('changeSignUp');
changeSignUp.addEventListener('click', () => {
    document.getElementById('signUpDialog').classList.add('show');
    document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');
})

let signUpBtn = document.getElementById('signUpBtn');
signUpBtn.addEventListener('click', () => {
    let email = document.getElementById('inputEmail1').value;
    // regex 
    let one, two, three;

    let username = document.getElementById('inputName1').value;
    let password = document.getElementById('inputPassword1').value;
    let surePassword = document.getElementById('inputSurePassword1').value;
    // document.getElementById('inputEmail1').value;
    // document.getElementById('inputName1').value;
    /\w{3,10}@?\w{2,}[.]\w{2,4}/.test(email) ? one = true : console.log("email format error");
    /\w{6,}/.test(username) ? two = true : console.log("username error");
    /\S{6,12}/.test(password) ? three = true : console.log("password error");
    document.getElementById('inputPassword1').value = '';
    document.getElementById('inputSurePassword1').value = '';
    loadAniamte();
    if (one && two && three && password === surePassword) {
        let xhr = new XMLHttpRequest(),
            method = 'POST',
            url = '/signUp';
        if (isLockUp) return;
        isLockUp = true;
        xhr.onreadystatechange = (username, password) => {
            missAniamte();
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log("gg", xhr.responseText);
                let text = xhr.responseText;
                document.getElementById('signInDialog').innerHTML = "<a href='javascript:void(0)'>welcome " + JSON.parse(text).username + "</a>"
                // hide Dialog
                document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');
                document.getElementById('signUpDialog').classList.remove('show');
                alert("sign up");
                return isLockUp = false;
            }
            else {
                //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
                //alert('sorry! Can"t find user');
                console.log("the password is not same");
                return isLockUp = false;
            }
        }
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send('email=' + email + '&username=' + username + '&password=' + password);
        //md. 一样的写法，现在就行了，idiot 🙄
    }
})

//img load 

// let img = () => {
//     let imgLoad = document.getElementById('imgLoad');
//     let imgBox = document.getElementById('imgBox');
//     console.log(imgLoad.complete, imgBox);
//     let imgLoadSrc = imgLoad.getAttribute("data-src");
//     let img = new Image();
//     // let img=document.createElement("img");
//     img.src = imgLoadSrc;
//     // img.setAttribute('src', imgLoadSrc); //all right
//     // console.log(img.complete, img);

//     let load = () => {
//         console.log("complete", img.complete, img);
//         // let a=new Date();
//         if (img.complete) {
//             // imgBox.innerHTML = '<img src="http://s.amazeui.org/media/i/demos/bing-1.jpg">';
//             // imgBox.innerHTML=img; //error
//             // imgBox.appendChild(img);
//             imgBox.replaceChild(img, imgLoad);
//             clearInterval(clearTime);
//         }
//     }
//     let clearTime = setInterval(load, 1000);
//     // if (img.complete) {
//     //     imgBox.replaceChild(img, imgLoad);
//     // }

//     console.log("img:", img);
//     // img.onload = function (img) {
//     //     console.log("addImg",img);
//     //     let imgBox = document.getElementById('imgBox');
//     //     imgBox.innerHTML = img
//     // }


// }

// img();

//wrap img function

// let wrapImg = (toWrapImg, wrapElement) => {
//     let imgLoadSrc = toWrapImg.getAttribute("data-src");
//     let img = new Image();
//     img.src = imgLoadSrc;
//     let load = () => {
//         if (img.complete) {
//             wrapElement.replaceChild(img, toWrapImg);
//             clearInterval(clearTime);

//         }
//         // img.onload=()=>{
//         //       wrapElement.replaceElement(img,toWrapImg);
//         // }
//     }
//     let clearTime = setInterval(load, 1000);

// }
// wrapImg(
//     document.getElementById('imgLoad'),
//     document.getElementById('imgBox')
// );

// carousel imgLoad function 

// let carousel = document.querySelectorAll(".carousel-inner .item") //css style in Writing
// let carouselImg = document.querySelectorAll('.carousel-inner .item>img')
// Array.prototype.slice.call(carouselImg).map((element, index) => {
//     // console.log("element:", element, carousel);
//     wrapImg(element, carousel[index]);
// })

// array img load 

let arrayImgLoad = (wrappedElements, wrappedElementArea) => {
    let wrapImg = (WrappedImg, wrappedElement) => {
        let imgLoadSrc = WrappedImg.getAttribute("data-src");
        let img = new Image();
        img.src = imgLoadSrc;
        let load = () => {
            if (img.complete) {
                wrappedElement.replaceChild(img, WrappedImg);
                clearInterval(clearTime);
            }
            // img.onload=()=>{
            //       wrapElement.replaceElement(img,toWrapImg);
            // }
        }
        let clearTime = setInterval(load, 1000);
    }
    Array.prototype.slice.call(wrappedElements).map((element, index) => {
        // console.log("element:", element, carousel);
        wrapImg(element, wrappedElementArea[index]);
    })
}

arrayImgLoad(
    document.querySelectorAll(".carousel-inner .item>img"),
    document.querySelectorAll('.carousel-inner .item')
)
arrayImgLoad(
    document.querySelectorAll("#imgBox>img"),
    document.querySelectorAll('#imgBox')
)


// monitor img loading situation //监视img加载情况
let imgLoad = () => {
    // let img_arr = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];
    let imgArray = document.querySelectorAll("img")
    let imgSrcArray = [];
    Array.prototype.slice.call(imgArray).map((Element, index) => {
        // let imgSrcArray=[];
        imgSrcArray.push(Element.getAttribute('data-src'));
        //duplication array //数组去重
        // click for more information 
        //https://www.toobug.net/article/array_unique_in_javascript.html
        // imgSrcArray = new Set(imgSrcArray)
        // console.log("set ",set);
        return imgSrcArray;
    })
    // console.log("imgArray:", imgArray, "imgSrcArray", imgSrcArray); 
    // need change set type to array type ,use Array.from();
    imgSrcArray = Array.from(new Set(imgSrcArray));
    console.log("imgArray:", imgArray, "imgSrcArray", imgSrcArray);

    if (imgSrcArray.length != 0) {
        let img_arr = imgSrcArray;
        // console.log("img_arr:", img_arr);
        let nums = img_arr.length;
        let start = 0;
        for (let i in img_arr) {
            let img = document.createElement('img');
            img.src = img_arr[i];
            (function (j) {
                img.onload = function () {
                    start++;
                    if (start == nums) {
                        console.log('全部加载完成');
                    }
                    // document.getElementById('loading').style.width = (start / nums) * 100 + '%';
                    // combine bootstrap
                    let targetNode = document.getElementById('progressBar');
                    // let longShow = (start / nums) * 100 +'%';
                    let longShow = Math.floor((start / nums) * 100)+ '%';
                    console.log("longShow", longShow);
                    targetNode.style.width = longShow;
                    targetNode.innerText = longShow;
                };
                img.onerror = function () {
                    start;
                    console.log(start,j, img_arr[j] + '失败');
                    // document.getElementById('loading').style.width = (start / nums) * 100 + '%';
                    // combine bootstrap
                    // document.getElementById('progressBar').style.width = (start / nums) * 100 + '%';
                    let targetNode = document.getElementById('progressBar');
                    // let longShow = (start / nums) * 100 + '%';
                    // longShow = Math.floor(longShow)
                    let longShow = Math.floor((start / nums) * 100)+ '%';
                    targetNode.style.width = longShow;
                    targetNode.innerText = longShow;
                }
            })(i);
        }

    }

}

imgLoad();



// let login = document.getElementById('loginone');
// console.log("login:", login);
// let isLockUp = false;
// login.addEventListener('click', () => {
//     let username = document.getElementById('username1').value;
//     let password = document.getElementById('password1').value;
//     // empty password
//     document.getElementById('password1').value = '';
//     console.log("username:", username, password);
//     let xhr = new XMLHttpRequest(),
//         method = 'POST',
//         url = '/login';
//     if (isLockUp) return;
//     isLockUp = true;
//     xhr.onreadystatechange = (username, password) => {
//         if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//             console.log("gg", xhr.responseText);
//             let text = xhr.responseText;
//             document.getElementById('loginDiv').innerHTML = "<p>welcome " + JSON.parse(text).username + " back🐵</p>"
//             return isLockUp = false;
//         }
//         else {
//             //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
//             alert('sorry! Can"t find user');
//             return isLockUp = false;
//         }
//     }
//     xhr.open(method, url, true);
//     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhr.send('username=' + username + '&password=' + password);
//     //md. 一样的写法，现在就行了，idiot 🙄
// })