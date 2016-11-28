/**
 * Created by IvanP on 27.10.2016.
 */

import variables from "./variables"
import RVRutils from "rvr-utils"
import PageFetch from "./page-fetch/page-fetch"

/*processor functions*/
import RVRprocessor from "./processors/rvr-processor"
require("./processors/pageTitle");


class RVRreport {
  constructor(){
    this.palette = RVRutils.getPalette(variables);

    document.addEventListener('rvr-source-loaded',()=>this.onSourceLoad(),false);
    this.page = new PageFetch();
  }

  /**
   * Is called every time the source iFrame is reloaded or refreshed.
   * */
  onSourceLoad(){
    let elements = RVRreport.queryElements(this.document);
    if(elements != null){
      elements.forEach(el=>RVRreport.elementDetection(el));
    }
  }

  /**
   * @returns {Window} Returns `window` object of the source iframe
   * */
  get window(){
    return this.page.sourceFrame.element.contentWindow;
  }
  /**
   * @returns {Document} Returns `document` object of the source iframe
   * */
  get document(){
    return this.page.sourceFrame.element.contentDocument;
  }


  /**
   * Function that queries iframe document for elements liable to be stripped and put in VR (with class `.rvr-`)
   * @param {Document} document - document object of the iframe
   * @returns {Array} Returns array of elements that matched class search
   * */
  static queryElements(document){
    let elements = [].slice.call(document.querySelectorAll('[class*="rvr-"]'));
    return elements.length>0?elements:null;
  }

  /**
   * Function that detects the element type and runs it through a dedicated processor
   * @param {HTMLElement} element - HTML element that will be inspected as a liable to be processed
   * */
  static elementDetection(element){
    let type = [].slice.call(element.classList).filter(cl=>cl.indexOf('rvr-')>=0)[0].substring(4),
        aux=[]; // auxiliary classes of RVR that shouldn't be considered as entities that require processing
    if(aux.indexOf(type)>=0)return;
    RVRprocessor.process(type,element);
  }
}

export default RVRreport
