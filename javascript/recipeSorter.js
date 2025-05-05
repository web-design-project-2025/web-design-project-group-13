// recipeSorter.js
export class RecipeSorter {
    static sortRecipes(recipes, sortBy, popularIds = []) {
      const sorted = [...recipes];
      
      switch(sortBy) {
        case 'rating':
          return sorted.sort((a, b) => b.rating - a.rating);
        case 'time':
          return sorted.sort((a, b) => a.time - b.time);
        case 'title':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'popular':
          return sorted.sort((a, b) => {
            const aIsPopular = popularIds.includes(a.id) ? 1 : 0;
            const bIsPopular = popularIds.includes(b.id) ? 1 : 0;
            return bIsPopular - aIsPopular || b.rating - a.rating;
          });
        default:
          return sorted;
      }
    }
  }