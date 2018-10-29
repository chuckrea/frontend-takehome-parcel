import APIController from './api-controller.js';

export default class DOMController {
    constructor() {
        this.buildList = this.buildList.bind(this);
        this.buildResultDiv = this.buildResultDiv.bind(this);
        this.showSearch = this.showSearch.bind(this);
        this.showFavorites = this.showFavorites.bind(this);
    }

    static buildList(data) {
        const list = document.querySelector('.list');
        list.innerHTML = '';
        list.classList.add('display-list');

        document.querySelector('.loading').classList.add('hidden');

        data.forEach((item, index) => {
            list.appendChild(this.buildResultDiv(item, index));
        });
    
    }

    static buildResultDiv(item, index) {
        const div = document.createElement('div');

        div.id = index;
        div.appendChild(this.buildResultLink(item.project_uri, item.name));
        div.appendChild(this.buildFavoriteButton(item));
        
        return div;
    }

    static buildResultLink(uri, name) {
        const link = document.createElement('a');
        
        link.href = uri;
        link.innerText = name;
        link.target = '_blank';

        return link;
    }

    static buildFavoriteButton(item) {
        const button = document.createElement('div');
        const favorites = localStorage.getItem('favoriteGems');

        button.classList.add('favorite-button');

        if (favorites) {
            const favoritesArray = JSON.parse(favorites);

            if (favoritesArray.map(favorite => favorite.name).indexOf(item.name) > -1) {
                button.classList.add('favorite');
            }
        }

        button.onclick = (event) => {
            if (button.classList.contains('favorite')) {
                button.classList.remove('favorite');
                this.removeFavorite(item.name);
                if (document.querySelector('.tab--favorites').classList.contains('active')) {
                    setTimeout(() => {
                        this.animateFavorite(button);
                    }, 400);
                }
            } else {
                button.classList.add('favorite');
                this.addFavorite(item);
            }

        }

        return button;
    }

    static addFavorite(item) {
        const favorites = localStorage.getItem('favoriteGems');

        if (!favorites) {
            const initialArray = [item];
            localStorage.setItem('favoriteGems', JSON.stringify(initialArray));
            return;
        }

        const favoritesJson = JSON.parse(favorites);

        favoritesJson.unshift(item);

        localStorage.setItem('favoriteGems', JSON.stringify(favoritesJson));
    }

    static removeFavorite(name) {
        const favorites = JSON.parse(localStorage.getItem('favoriteGems'));
        const removeIndex = favorites.map(favorite => favorite.name).indexOf(name);

        favorites.splice(removeIndex, 1);
        localStorage.setItem('favoriteGems', JSON.stringify(favorites));
    }

    static animateFavorite(el) {
        const parent = el.parentElement;
        const direction = Math.floor(Math.random() * Math.floor(2)) > 0 ? 1 : -1;
        const heightToMakeUp = parent.getBoundingClientRect().height + 10;
        const remainingListDivs = Array.from(document.querySelectorAll('.list > div')).slice(parseInt(parent.id));

        parent.style.left = `${3000 * direction}px`;

        setTimeout(() => {
            remainingListDivs.forEach((div) => {
                div.style.top = `-${heightToMakeUp}px`;
            });
        }, 300);

        setTimeout(() => {
            parent.style.display = 'none';

            remainingListDivs.forEach((div) => {
                div.classList.add('transitioned');
                div.style.top = `0px`;
            });
        }, 600);

        setTimeout(() => {
            remainingListDivs.forEach((div) => {
                div.classList.remove('transitioned');
            });
        }, 900)
    }

    static showFavorites(el) {
        if (el.classList.contains('active')) {
            return;
        }

        const favorites = localStorage.getItem('favoriteGems') || '[]';
        this.toggleActiveTabs();

        const favoritesJson = JSON.parse(favorites);

        this.buildList(favoritesJson);
    }

    static showSearch(el) {
        if (el.classList.contains('active')) {
            return;
        }

        const data = this.searchData || [];

        this.toggleActiveTabs();
        this.buildList(data);
    }

    static toggleActiveTabs() {
        const activeTab = document.querySelector('.active');
        const nextActiveTab = activeTab.classList.contains('tab--search') ? 'favorites' : 'search';

        activeTab.classList.remove('active');
        document.querySelector(`.tab--${nextActiveTab}`).classList.add('active');
    }
    
    static onInputChange() {
        var queryText = document.querySelector('input').value;
        
        if (!document.querySelector('.tab--search').classList.contains('active')) {
            this.toggleActiveTabs();
        }

        if (queryText.length > 3) {
            document.querySelector('.loading').classList.remove('hidden');
            APIController.getGems(queryText);
        } else {
            var list = document.querySelector('.list');
            list.classList.remove('display-list');
            list.innerHTML = '';
        }
    }
}

window.domController = DOMController;
