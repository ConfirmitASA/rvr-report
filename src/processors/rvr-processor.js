/**
 * Created by IvanP on 28.11.2016.
 */

class RVRprocessor{
  constructor(){
    this.processors=[];
  }

  /**
   * Takes `type` of the element and looks if there's a function able to process it in the prototype constructor
   * @param {String} type - type of element
   * @param {HTMLElement} el - element to be processed
   * */
  static process(type,el){
    if(RVRprocessor.hasOwnProperty(type)){
      RVRprocessor[type](el);
    } else {
      throw new TypeError(`RVRprocessor.${type} is not registered with the processor system`)
    }
  }

  /**
   * Allows to add a processor method and keep all methods in separate files/pluggable modules.
   * Add a method via:
   *
   * ```
   *    RVRprocessor.add({namedStaticMethod(args){}})
   * ```
   * */
  static add(func){
    Object.assign(RVRprocessor, func)
  }
}

export default RVRprocessor;
