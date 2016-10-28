/**
 * Created by IvanP on 28.10.2016.
 */

class SourceFrame{
  /**
   * Creates an iframe and provides a `load` method to load content into it
   * */
  constructor(){
    /**
     * the iframe element
     * @type {HTMLFrameElement}
     * @memberOf SourceFrame
     * */
    this.element = SourceFrame.createIframe();
    this._lastListener = null;
    /**
     * initialized status of the iframe speaks whether the content has been loaded into it
     * @type {Boolean}
     * @memberOf SourceFrame
     * */
    this.initialized = false;
  }

  /**
   * Creates an iframe that will be responsible for all communications with the report
   * @returns {HTMLFrameElement}
   * */
  static createIframe(){
      let iframe = document.createElement('iframe');
      iframe.id = 'sourceFrame';
      document.querySelector('body').appendChild(iframe);
      return iframe
  }

  /**
   * loads a document into the iframe by an `src`
   * @param {String} src - a URL to load document from
   * @returns {Promise} A Promise containing the window object of the iframe when it loads
   * */
  load(src){
    this.element.removeEventListener('load',this._lastListener);
    let promise = new Promise((resolve,reject)=>{
      this._lastListener = ()=>{
        this.initialized = true;
        resolve(this.element.contentWindow);
      };
      this.element.addEventListener('load',this._lastListener);
    });
    this.element.src = src;
    return promise
  }

}

export default SourceFrame
