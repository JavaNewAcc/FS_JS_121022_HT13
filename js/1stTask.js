window.onload = () => {
    let resDivExist = false;
    let cardDivExist = false;
    let openResBtn = document.querySelector('.openResBtn');
    let result = 0;
    let counter = 0;
    let infoMsgExist = false;
    let infoMsg;

    openResBtn.addEventListener('click', function () {
        if (!resDivExist) {
            resDivExist = true;
            createDiv();
            openResBtn.innerText = 'Close results';
            openResBtn.scrollIntoView(true);
        }
        else {
            resDivExist = false;
            delDiv();
            openResBtn.innerText = 'Result';
        }
    })

    function createDiv() {
        let resDiv = document.createElement('div');
        resDiv.classList.add('resDiv');
        resDiv.style.width = '100%';
        resDiv.classList.add('d-flex', 'flex-column');
        openResBtn.after(resDiv);
        addBtn(resDiv);
    }

    function delDiv() {
        let resDiv = document.querySelector('.resDiv');
        resDiv.remove(resDiv);
        cardDivExist = false;
    }

    function getData() {
        let request = new XMLHttpRequest();
        request.open('get', 'https://jsonplaceholder.typicode.com/users', true);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                result = request.response;
            }
        }
        request.onload = function () { addCard(result); }
        request.responseType = 'json';
        request.send(null);
    }

    function addBtn(parentElement) {
        let btn = document.createElement('button');
        btn.classList.add('btn', 'btn-success', 'm-auto', 'mt-3', 'mb-3', 'addBtn');
        btn.innerText = 'Get data';
        parentElement.appendChild(btn);
        btn.addEventListener('click', function () {
            getData();
        })
    }

    function addCard(resData) {
        if (!cardDivExist) {
            cardDivExist = true;
            if (resData.length > 0) {
                let cardDiv = document.createElement('div');
                cardDiv.classList.add('d-flex', 'flex-wrap', 'justify-content-center', 'cardDiv');
                let addBtn = document.querySelector('.addBtn');
                addBtn.after(cardDiv);
                search(cardDiv.children, 'name:');
                for (let i = 0; i < resData.length; i++) {
                    let div = document.createElement('div');
                    div.classList.add('col-8', 'col-md-5', 'd-flex', 'flex-wrap', 'userCard', 'p-1', 'm-1', 'rounded', 'font-white');
                    switch (i % 4) {
                        case 0:
                            div.classList.add('bg-c-blue');
                            break;
                        case 1:
                            div.classList.add('bg-c-red');
                            break;
                        case 2:
                            div.classList.add('bg-c-darkblue');
                            break;
                        case 3:
                            div.classList.add('bg-c-yellow');
                            break;
                    }
                    dataFiller(resData[i], div);
                    let selectBtn = document.createElement('button')
                    selectBtn.classList.add('btn', 'btn-light', 'col-12');
                    selectBtn.innerText = 'Select';
                    div.appendChild(selectBtn);
                    selectBtn.addEventListener('click', function () {
                        if (selectBtn.innerText == "Select") {
                            counter++;
                            window.localStorage.setItem(`counter`, counter);
                            selectBtn.classList.remove('btn-light');
                            selectBtn.classList.add('btn-warning');
                            selectBtn.innerText = 'Selected. Remove?';
                            window.localStorage.setItem(`id${resData[i].id}`, resData[i].id);
                        }
                        else {
                            counter--;
                            window.localStorage.setItem(`counter`, counter);
                            selectBtn.classList.add('btn-light');
                            selectBtn.classList.remove('btn-warning');
                            selectBtn.innerText = 'Select';
                            window.localStorage.removeItem(`id${resData[i].id}`, resData[i].id);
                        }

                        if (counter > 0) { infoMsgFn(counter) }
                        else {
                            let infoMsg = document.querySelector('.infoMsg');
                            animateMoveOut(infoMsg, 300);
                            setTimeout(function () {
                                infoMsg.remove(infoMsg);
                                infoMsg.setAttribute('display', 'hidden')
                            }, 300);
                            infoMsgExist = false;
                        }
                    })
                    cardDiv.appendChild(div);
                    animate(div, (500 * i));
                }
            }
        }
    }

    function dataFiller(dataObj, parentElem) {
        for (const [key, value] of Object.entries(dataObj)) {
            if (typeof (value) != 'object') {
                let keyDiv = document.createElement('div');
                keyDiv.innerText = `${key}:`;
                keyDiv.classList.add('col-5', 'fw-bold');
                parentElem.appendChild(keyDiv);
                let valueDiv = document.createElement('div');
                valueDiv.innerText = value;
                valueDiv.classList.add('col-7', 'col-md-7');
                parentElem.appendChild(valueDiv);
            }
            else {
                let keyDiv = document.createElement('div');
                keyDiv.innerText = `${key}:`;
                keyDiv.classList.add('col-12', 'fw-bold');
                parentElem.appendChild(keyDiv);
                dataFiller(value, parentElem);
            }
        }
    }

    function infoMsgFn(counter) {
        if (!infoMsgExist) {
            infoMsgExist = true;
            infoMsg = document.createElement('div');
            infoMsg.classList.add('infoMsg', 'p-2', 'rounded')
            infoMsg.style.position = 'fixed';
            infoMsg.style.zIndex = 111;
            infoMsg.style.backgroundColor = 'RGBA(24, 131, 81, 0.8)';
            infoMsg.style.right = '0';
            infoMsg.style.bottom = '0';
            infoMsg.innerHTML = `Кількість елементів <br> в локальному сховищі: ${counter}`;
            let resDiv = document.querySelector('.resDiv');
            resDiv.appendChild(infoMsg);
            animateMoveIn(infoMsg, 300);
        }
        else { infoMsg.innerHTML = `Кількість елементів <br> в локальному сховищі: ${counter}` }
    }

    function search(data, parameter) {
        let search = document.createElement('input');
        let addBtn = document.querySelector('.addBtn');
        search.classList.add('col-6', 'm-auto');
        search.type = 'search';
        search.placeholder = "Введіть данні для пошуку";
        search.addEventListener('keyup', function () {
            let searchRegExp = new RegExp(this.value, 'ig');
            [...data].forEach(element => {
                let searchElements = [...element.children];
                for (let i = 0; i < 3; i++) {
                    if (searchElements[i].innerText == parameter) {
                        if (!searchRegExp.test(searchElements[i + 1].innerText)) {
                            searchElements[i + 1].parentElement.setAttribute('style', 'display:none');
                            searchElements[i + 1].parentElement.classList.remove('d-flex')
                        }
                        else {
                            searchElements[i + 1].parentElement.classList.add('d-flex')
                        }
                    }
                }

            });
        });
        addBtn.after(search);
    }

    function animate(element, interval) {
        element.animate([{ opacity: 0 },
        { opacity: 1 }], interval)
    }

    function animateMoveIn(element, interval) {
        element.animate([{ transform: `translateX(${window.getComputedStyle(element).width})` },
        { transform: 'translateX(0)' }], interval)
    }

    function animateMoveOut(element, interval) {
        element.animate([{ transform: 'translateX(0)' },
        { transform: `translateX(${window.getComputedStyle(element).width}` }], interval)
    }
}
