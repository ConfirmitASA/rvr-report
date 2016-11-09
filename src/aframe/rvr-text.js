/**
 * Created by IvanP on 07.11.2016.
 */
import variables from "../variables";
import RVRutils from 'rvr-utils'
let palette = RVRutils.getPalette(variables);

AFRAME.registerSystem('rvr-text', {
  schema: {
    textColor: {type:'color', default: palette.primary.textColor || '#FFF'},
    textOpacity: {type:'number', default: 1},
    activeColor: {type:'color', default: palette.primary.defaultColor || '#2196f3'},
    hoverColor: {type:'color', default: palette.accent.darkColor || '#35f32a'},
    backgroundColor: {type:'color', default: palette.background.defaultColor || '#FFF'},
    backgroundOpacity: {type:'number', default: palette.background.opacity || '0.3'},
    scale:{type:'number',default:0.3}
  },
  /**
   * Creates a background plane for the text label
   * @param {Object} options
   * @param {Object} options.data - data object
   * @param {Number} options.width - item width
   * @param {Number} options.height - item height
   * @param {Boolean} [options.isLink=false] - whether the item is a link (meaning hover state and click animations will be applied)
   * @param {Boolean} options.callback - click callback
   * @param {Boolean} options.context - what `this` would mean in the callback
   * */
  createBackgroundPlane: (options)=>{
    let {data,width,height,isLink=false,callback,context}=options;

    let bgOptions = {
      geometry:{
        primitive:'plane',
        width,
        height
      },
      material:{
        shader:'flat',
        color: data.backgroundColor,
        opacity: data.backgroundOpacity
      },
      position:'0 0 0.05',
      scale:{
        x:data.scale,
        y:data.scale,
        z:data.scale
      },
    };
    if(isLink){
      bgOptions = RVRutils.mixin(bgOptions,{
        'update-raycaster':'#cursor',
        'event-set__hover':{
          '_event': 'mouseenter',
          'material.color': data.hoverColor,
          'material.opacity': 0.5
        },
        'event-set__out': {
          '_event': 'mouseleave',
          'material.color': data.backgroundColor,
          'material.opacity': data.backgroundOpacity
        },
        'animation__click': {
          property: 'position',
          startEvents: 'click',
          from: '0 0 0.05',
          to: '0 0 0',
          dur:300,
          dir:'alternate'
        }
      })
    }
    let bg = RVRutils.createEntity(null,bgOptions);
    if(isLink){
      bg.classList.add('link');
      bg.addEventListener('click',callback.bind(context),true);
    }
    return bg;
  },
  /**
   * Creates a background plane for the text label
   * @param {Object} options
   * @param {Object} options.data - data object
   * @param {String} options.text - text content
   * @param {Number} options.width - item width in pixels
   * @param {Number} options.x - x position of the label (calculated against background width)
   * @param {Number} options.y - y position of the label (calculated against background height)
   * @param {Boolean} [options.isActive=false] - whether the link is selected
   * */
  createText: (options)=>{
    let {data,text,x,y,width,isActive=false}=options;

    return RVRutils.createEntity(null,{
      'bmfont-text':{
        text,
        color: isActive? data.activeColor : data.textColor,
        align: 'left',
        width,
        opacity: data.textOpacity
      },
      position: {
        x,
        y,
        z: 0.01
      }
    });
  }
});
