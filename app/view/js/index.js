//signIn
let signInDialog = document.getElementById('signInDialog');
signInDialog.addEventListener('click', () => {
    document.getElementsByClassName('signInDialog')[0].classList.toggle('changeDialog');
})
let signInBtn = document.getElementById('signInBtn');
console.log("signInBtn:", signInBtn);
let isLockUp = false;
signInBtn.addEventListener('click', () => {
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
    if (one && two && three && password === surePassword) {
        let xhr = new XMLHttpRequest(),
            method = 'POST',
            url = '/signUp';
        if (isLockUp) return;
        isLockUp = true;
        xhr.onreadystatechange = (username, password) => {
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