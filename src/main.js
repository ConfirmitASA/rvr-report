/**
 * Created by IvanP on 07.09.2016.
 */
//require('aframe/build/aframe.js');
let styles = require('./styles.css');
//require('aframe-event-set-component');
//require('aframe-animation-component');

import variables from "./variables";
import RVRutils from "./rvr-utils"
import RVRreport from "./rvr-report"

let RVR = window.RVR = window.RVR || {};
RVRutils.mixin(window.RVR,{
  variables,
  utils: RVRutils,
  report: RVRreport
});

export default RVR
