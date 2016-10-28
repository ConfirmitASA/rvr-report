/**
 * Created by IvanP on 28.10.2016.
 */

import GetMenu from './get-menu';
import SourceFrame from './source-frame';

class PageFetch {
  /**
   * Fetaches a reportal report page and loads it in an iframe
   * @param {HTMLElement} [menu] - a UL element that contains a reportal menu on the page
   * */
  constructor(menu){
    /**
     * an array with menu items. See {@link GetMenu} for details
     * @type {GetMenu}
     * @memberOf PageFetch
     * */
    this.menuItems= new GetMenu(menu);
    /**
     * an object containing the iframe and utility methods to load a document into it. See {@link SourceFrame} for details
     * @type {SourceFrame}
     * @memberOf PageFetch
     * */
     this.sourceFrame = new SourceFrame();
    /**
     * a promise that contains Window object of the iframe
     * @type {Promise.<Window>}
     * @memberOf PageFetch
     * */
     this.sourceWindow = PageFetch.pageInitializer.call(this);
  }

  /**
   * Function that initializes to the first page in report if the VR mode is launched with no `location.query.frompage` parameter in URL, otherwise launches with the pageid specified in `frompage` parameter
   * @returns {Promise.<Window>} Returns a promise with a contentWindow of the iFrame
   * */
  static pageInitializer(){
    let pagelocation = PageFetch.locationDeserialize();
    return this.fetch({
      pageid: !pagelocation.query.frompage ? this.menuItems[0].pageID : pagelocation.query.frompage
    });
  }


  /**
   * Fetches a document from the iframe and returns a Promise received when document is loaded.
   * @param {Object} swapObject - an object containing the key-value pairs of properties that need changing when loading the new page.
   * @param {Boolean} [fromFrame=false] - whether the `window.location` must be taken from the host page or the previously loaded iframe (PageStateId might be different)
   * @returns {Promise.<Window>} Returns a promise with a contentWindow of the iFrame
   * */
  fetch(swapObject, fromFrame=this.sourceFrame.initialized){
    if(swapObject){
      let location;
      if(fromFrame){
        location = PageFetch.locationDeserialize(this.sourceFrame.element.contentWindow.location);
        if(!swapObject.state){// add a correct state from a loaded page if not overriden
          swapObject['state']=this.sourceFrame.element.contentWindow.document.getElementById('PageStateId').value;
        }
      } else {
        location = PageFetch.locationDeserialize(window.location);
      }
      for(let key in swapObject){
        location.query[key] = swapObject[key];
      }
      let src = PageFetch.locationSerialize(location);
      if(src){
        return this.sourceFrame.load(src);
      } else {
        throw new Error('src can\'t be calculated');
      }
    } else {
      throw new TypeError('swapObject must be specified to load a page')
    }
  }

  /**
   * turns `window.location` object into an object with params as named keys necessary to reconstruct the URL
   * @param {Object=} [location = window.location] - a window.location object, by default of the host window where the script is executed
   * @returns {{path:String, query:Object}} a `location` object
   * */
  static locationDeserialize(location = window.location){
    let o = {
      path: location.origin + location.pathname,
      query:{}
    };
    location.search.substring(1).split(/&/).forEach(pair=>{
      let aPair= pair.split(/=/);
      o.query[aPair[0].toLowerCase()] = aPair[1]
    });
    return o
  }

  /**
   * Turns a `location` object (result of `locationDeserialize`) into a URL
   * @param {{path:String, query:Object}} location - an object with params and a url
   * @returns {String} - a URL string
   * */
  static locationSerialize(location){
    let query=[];
    for(let key in location.query){
      query.push([key,location.query[key]].join('='));
    }
    return location.path + '?' + query.join('&');
  }
}

export default PageFetch
