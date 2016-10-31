/**
 * Created by IvanP on 31.10.2016.
 */

//require('aframe');

import RVRutils from '../rvr-utils'

let palette = RVRutils.getPalette();


AFRAME.registerComponent('rvr-menu', {
  schema: {
    pageStateID: {type: 'string'},
    textColor: {type:'color', default: palette.primary.textColor || '#FFF'},
    linkOpacity: {type:'number', default: 1},
    activeColor: {type:'color', default: palette.accent.darkColor || '#2196f3'},
    backgroundColor: {type:'color', default: palette.background.defaultColor || '#FFF'},
    backgroundOpacity: {type:'number', default: palette.background.opacity || '0.3'},
    scale:{type:'number',default:0.3}
  },
  init: function(){
    const data = this.data;
    const parent = this.el;
    const menu = this.menuArray = RVR.state.page.menuItems;
    const CHAR_WIDTH_PX = 30;
    const CHAR_WIDTH_M = 0.1024;
    const CHAR_HEIGHT_M = 0.1280;
    const widths=[];

    //if(this.el.children.length==0){
    menu.forEach(function(item,index){
      const itemLabelLength = item.label.length * CHAR_WIDTH_PX;

      const bgWidth = (CHAR_WIDTH_M*item.label.length)+CHAR_WIDTH_M*2;
      const bgHeight = CHAR_HEIGHT_M*2;



      let menuItem = RVRutils.createEntity(null,true,{
        'bmfont-text':{
          text:item.label,
          color: data.textColor,
          align: 'left',
          width: itemLabelLength,
          opacity: data.linkOpacity
        },
        position: {
          x: 0-(bgWidth/2)+CHAR_WIDTH_M,
          y:0-(bgHeight/2 - CHAR_HEIGHT_M/2),
          z:0.01
        }
      });
      menuItem.id = `id_${item.pageID}`;

      let menuItemContainer = RVRutils.createEntity(null,true,{
        'update-raycaster':'#cursor',
        geometry:{
          primitive:'plane',
          width:bgWidth,
          height:bgHeight
        },
        material:{
          shader:'flat',
          color: data.backgroundColor,
          opacity: data.backgroundOpacity
        },
        'event-set__hover':{
          '_event': 'mouseenter',
          'material.color': data.activeColor,
          'material.opacity': 0.5
        },
        'event-set__out': {
          '_event': 'mouseleave',
          'material.color': data.backgroundColor,
          'material.opacity': data.backgroundOpacity
        }
      });
      menuItemContainer.classList.add('link');

      // add events
      menuItemContainer.addEventListener('loaded',(e)=>{
        let position = AFRAME.utils.entity.getComponentProperty(e.target,'position');
        e.target.setAttribute('animation__click',{property: 'position', startEvents: 'click', from:position, to: {x:position.x,y:position.y,z:position.z-0.1}, dur:300,dir:'alternate'});
      });

      menuItemContainer.appendChild(menuItem);
      parent.appendChild(menuItemContainer);
    });

    //parent.setAttribute('layout', {type: 'line', margin: '0.01'});
    parent.setAttribute('position', {x:0,y:1,z:-1});
    parent.setAttribute('scale', {x:this.data.scale, y:this.data.scale, z:this.data.scale});

    //}
  }
});
