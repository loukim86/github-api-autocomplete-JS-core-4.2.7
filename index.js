const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'text');
searchInput.classList.add('searchInput');

const autocompleteResults = document.createElement('div');
autocompleteResults.classList.add('autocompleteResults');

const repoList = document.createElement('ul');
repoList.classList.add('repoList');

document.body.appendChild(searchInput);
document.body.appendChild(autocompleteResults);
document.body.appendChild(repoList);


function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

searchInput.addEventListener('input', debounce(onSearch, 300));

async function onSearch() {
    const searchText = searchInput.value.trim();

    if (searchText === '') {
        autocompleteResults.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${searchText}&per_page=5`);
        const data = await response.json();
        const repos = data.items.map(item => item.full_name);

        displayAutocomplete(repos);
    } catch (error) {
        console.error('Ошибка при запросе репозиториев:', error);
    }
}

function displayAutocomplete(repos) {
    autocompleteResults.innerHTML = '';

    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.textContent = repo;
        repoElement.classList.add('autocomplete-item');

        repoElement.addEventListener('click', () => addToRepoList(repo));
        autocompleteResults.appendChild(repoElement);

    });
}

async function addToRepoList(repoName) {
    try {
        const responseName = await fetch(`https://api.github.com/repos/${repoName}`);
        const data = await responseName.json();

        const { name, owner, stargazers_count } = data;

        const listItem = document.createElement('li');
        listItem.classList.add('repo-item');
        listItem.innerHTML = `Name: ${name} <br>Owner: ${owner.login} <br>Stars: ${stargazers_count}`;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.classList.add('close-btn')
        closeButton.addEventListener('click', () => {
        listItem.remove();
    });

        listItem.appendChild(closeButton);
        repoList.appendChild(listItem);
        document.body.appendChild(repoList);
        
        searchInput.value = '';
  } catch (error) {
    console.error('Ошибка при запросе репозиториев:', error);
  }
}

      
       

       

