export const emptyArray = (array: any[], ratio = 1/2) => {
    // Calculate the number of items to remove
    const itemsToRemove = Math.floor(array.length * ratio);
  
    // Remove items
    for (let i = 0; i < itemsToRemove; i++) {
      // You can remove items randomly
      const randomIndex = Math.floor(Math.random() * array.length);
      array.splice(randomIndex, 1);
    }
  
    return array;
  }