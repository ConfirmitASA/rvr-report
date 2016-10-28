/**
 * Created by IvanP on 27.10.2016.
 */

import variables from "./variables"

class RVRutils {
  /**
   * Copies props from a source object to a target object.
   * @method mixin
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
   * Gets a color/opacity palette from variables.js
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
}

export default RVRutils
