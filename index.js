const search = document.querySelector(".search");
const container = document.querySelector(".container")
/*создание 5 карточек поисковых запросов*/
function createCard(names, id) {
    const card = document.createElement('div');
    card.classList.add('card');
    const name = document.createElement('p');
    name.dataset.id = id;
    name.textContent = names;
    card.appendChild(name);
    container.appendChild(card);
}
/*удаление элементов*/
/*всех узлов выпадающего списка*/
function remove([...nods]) {
    nods.forEach((node) => {
        node.remove();
    })
}
/*debounce функция*/
const debounce = (fn, ms) => {
    let timeout;
    return function () {
        const fnCall = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms)
    };
}
/*получение данных для заполнения карт*/
async function searchRepositories(str) {
    let request = str.target.value;
    let elem = document.getElementsByClassName('card');
    if (!request.trim()) {
        remove(elem)
        return;
    }
    let searchResult = await fetch(`https://api.github.com/search/repositories?q=${request}&per_page=5`);
    searchResult = await searchResult.json();
    remove(elem);
    localStorage.clear();
    searchResult.items.forEach(element => {
        localStorage.setItem(element.id, JSON.stringify(element));
        createCard(element.name, element.id);
    });
}
/*созлание карточки по клику на поисковой результат*/
container.addEventListener('click', function (event) {
    let target = event.target;
    if (target.tagName != 'P') {
        return;
    }
    let searchElem = JSON.parse(localStorage.getItem(target.dataset.id));
    createSaveCard(searchElem);
})

/* функция для слушателя, создание карточки */
function createSaveCard(searchElem) {
    const saveCard = document.querySelector('.saveCard');
    const card = document.createElement('div');
    card.classList.add('savecard');
    const name = document.createElement('p');
    name.textContent = `Name: ${searchElem.name}`;
    const owner = document.createElement('p');
    owner.textContent = `Owner: ${searchElem.owner.login}`;
    const stars = document.createElement('p');
    stars.textContent = `Stars: ${searchElem.stargazers_count}`;
    const pic = document.createElement("IMG");
    pic.src = "img/Group1.png";
    pic.classList.add('pic');
    pic.addEventListener("click", () => card.remove());
    saveCard.appendChild(card);
    card.appendChild(name);
    card.appendChild(owner);
    card.appendChild(stars);
    card.appendChild(pic);
}

search.addEventListener("keyup", debounce(searchRepositories, 350));