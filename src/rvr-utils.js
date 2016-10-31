/**
 * Created by IvanP on 27.10.2016.
 */

import variables from "./variables"

/** class with utilities for RVR */
class RVRutils {
  /**
   * Copies props from a source object to a target object.
   * @param {Object} target Target object to copy properties to.
   * @param {Object} source Source object to copy properties from.
   * @return {Object} Target object that was passed as first argument.
   */
  static mixin(target, source) {
    for (let i in source) {
      target[i] = source[i];
    }
    return target;
  }

  /**
   * Gets a color/opacity palette from variables.js If no palette `name` is passed, it gets he default userPalette
   * @param {String} [name] - palette name
   * */
  static getPalette(name){
    if(variables && typeof variables == 'object'){
      if(variables.palettes && typeof variables.palettes == 'object'){
        // if palette name is specified explicitly
        if(name){
          if(variables.palettes[name] && typeof variables.palettes[name] == 'object'){
            return variables.palettes[name]
          } else {
            console.error(`Palette "${name}" doesn't exist, will use a default one instead`);
            return variables.palettes.default;
          }
        }
        // if there are user settings for a palette
        if(variables.userPalette && variables.palettes[variables.userPalette]){
          return variables.palettes[variables.userPalette]
        } else {
          console.warn(`User palette is not defined, will use a default one instead`);
          return variables.palettes.default;
        }
      } else {
        throw new TypeError('palettes is undefined in variables, or is not an object')
      }
    } else {
      throw new TypeError('variables are empty')
    }
  }

  static createEntity(name,batch,properties){
    let entity;
    if(typeof name == 'string' && name.indexOf('a-')==0 && name!=null){ // name for entity is specified
      entity = document.createElement(name);
    } else {
      entity = document.createElement('a-entity');
    }
    if(typeof properties == 'object'){
      RVRutils.setProperties(entity, batch, properties);
    }
    return entity
  }

  static setProperties(entity, batch, props, parentProp){
    for(let key in props){
      let prop;
      /*if(typeof props[key] == 'object' && props[key].x){ //it value is a string, or object
        prop = AFRAME.utils.coordinates.stringify(props[key]);
      }*/
      if(batch) {
        entity.setAttribute(key , props[key])
      } else {
        if(!(typeof props[key] == 'object' && !props[key].x)){
          typeof parentProp == 'string'?entity.setAttribute(parentProp, key , props[key]): entity.setAttribute(key , props[key]);
        } else if(typeof props[key] == 'object'){
          RVRutils.setProperties(entity, props[key], key);
        }
      }
    }
  }
}

export default RVRutils
