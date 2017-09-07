// let btn = document.getElementsByTagName('button')[0];
// btn.addEventListener('click', () => {
//     console.log("I am being clicked");
// })


let login = document.getElementById('loginone');
console.log("login:", login);
let isLockUp = false;
login.addEventListener('click', () => {
    let username = document.getElementById('username1').value;
    let password = document.getElementById('password1').value;
    // empty password
    document.getElementById('password1').value = '';
    console.log("username:", username, password);
    let xhr = new XMLHttpRequest(),
        method = 'POST',
        url = '/login';
    if (isLockUp) return;
    isLockUp = true;
    xhr.onreadystatechange = (username, password) => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("gg", xhr.responseText);
            let text = xhr.responseText;
            document.getElementById('loginDiv').innerHTML = "<p>welcome " + JSON.parse(text).username + " back🐵</p>"
            return isLockUp = false;
        }
        else {
            //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
            alert('sorry! Can"t find user');
            return isLockUp = false;
        }
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send('username=' + username + '&password=' + password);
    //md. 一样的写法，现在就行了，idiot 🙄
})