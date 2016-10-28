/**
 * Created by IvanP on 28.10.2016.
 */

class SourceFrame{
  constructor(){
    this.element = SourceFrame.createIframe();
    this._lastListener = null;
    this.initialized = false;
  }

  /**
   * Creates an iframe that will be responsible for all communications with the report
   * @return {HTMLFrameElement}
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
   * @return {Promise} A Promise containing the window object of the iframe when it loads
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
