/**
 * Created by IvanP on 28.10.2016.
 */

import GetMenu from 'rvr-get-menu';
import SourceFrame from './source-frame';
import RVRutils from 'rvr-utils';

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
    let pagelocation = RVRutils.locationDeserialize();
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
        location = RVRutils.locationDeserialize(this.sourceFrame.element.contentWindow.location);
        if(!swapObject.state){// add a correct state from a loaded page if not overriden
          let psi = this.sourceFrame.element.contentWindow.document.querySelector('#PageStateId');
          if(psi)swapObject['state']=psi.value;
        }
      } else {
        location = RVRutils.locationDeserialize(window.location);
      }
      for(let key in swapObject){
        location.query[key] = swapObject[key];
      }
      /**
       * the location Object
       * @type {Object}
       * @memberOf PageFetch
       * */
      this.location = location;
      let src = RVRutils.locationSerialize(location);
      if(src){
        return this.sourceFrame.load(src);
      } else {
        throw new Error('src can\'t be calculated');
      }
    } else {
      throw new TypeError('swapObject must be specified to load a page')
    }
  }

}

export default PageFetch
