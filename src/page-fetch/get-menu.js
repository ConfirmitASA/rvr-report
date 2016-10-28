/**
 * Created by IvanP on 28.10.2016.
 */

/**
 * Retrieves a menu from the page, passed as a parameter. If left blank, takes the menu from the page where it was called.
 * @param {HTMLElement} [source=document.querySelector('div.yui3-menu ul')] - the first UL that contains the menu
 * @returns {{label:String, pageID:string}}
 * */
class GetMenu{
  constructor(source=document.querySelector('div.yui3-menu ul')){
    let mArray = [];
    if(source){
      GetMenu.iteration(source,mArray);
    }
    return mArray;
  }

  /**
   * iterates through all menu items of a Reportal Menu and creates an object
   * @param {NodeCollection} items - UL items in the menu
   * @param {NodeCollection} obj - menu array
   * */
  static iteration(items, obj){
    if(items){
      let liLength = items.children.length;
      while(liLength--){//li items iteration
        let item = {}, curLi = items.children[liLength], curLiLength = curLi.children.length;
        //item.id = window._UUID() || curLi.id; //assign a unique id to each element
        if(curLi.classList.contains('css-menu-child-selected') || curLi.classList.contains('css-menu-selected')){item.selected = true;}
        while(curLiLength--){ // li children iteration (a|div)
          const currentChild = curLi.children[curLiLength];
          if(currentChild.localName === 'a'){
            item.label = currentChild.textContent.trim(); //set up label
            if(currentChild.href.indexOf('#')<0){
              let splitter = currentChild.href.split(/'/);
              //item.pageState = splitter[1];
              item.pageID = splitter[3];
            } // set up page link
          }
          if(currentChild.localName === 'div'){
            item.submenu=[]; GetMenu.iteration(currentChild.querySelector('ul'), item.submenu); //iterate over submenu
          }
        }
        obj.unshift(item);
      }
    }
  }
}
 export default GetMenu
