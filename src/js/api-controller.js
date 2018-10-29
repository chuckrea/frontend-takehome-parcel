import DOMController from './dom-controller';

export default class APIController {
    static getGems(query) {
        fetch(`http://localhost:3000/api/v1/search.json?query=${query}`)
            .then(response => response.json())
            .then((data) => {
                DOMController.searchData = data;
                DOMController.buildList(data);
            });
    }
}
