import { RecipePaginator } from "/javascript/paginator.js";

export class AllRecipesView {
    constructor(containerId, loadMoreBtnId) {
        this.container = document.getElementById(containerId);
        this.loadMoreBtn = document.getElementById(loadMoreBtnId);
        this.paginator = null;
    }

    initialize(recipes) {
        if (!this.container || !this.loadMoreBtn) return;

        this.paginator = new RecipePaginator(recipes, this.container.id);
        this.paginator.displayPage(0);

        this.loadMoreBtn.addEventListener('click', () => {
            const hasMore = this.paginator.nextPage();
            if (!hasMore) {
                this.loadMoreBtn.style.display = 'none';
            }
        });

        // Hide button if no pagination needed
        if (recipes.length <= this.paginator.itemsPerPage) {
            this.loadMoreBtn.style.display = 'none';
        }
    }
}