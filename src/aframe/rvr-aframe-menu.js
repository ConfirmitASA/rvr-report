/**
 * Created by IvanP on 31.10.2016.
 */

require('./arch-layout');

import RVRutils from '../rvr-utils'

let palette = RVRutils.getPalette();


AFRAME.registerComponent('rvr-menu', {
  //dependencies:['sticky-arch-layout'],
  schema: {
    pageStateID: {type: 'string'},
    textColor: {type:'color', default: palette.primary.textColor || '#FFF'},
    linkOpacity: {type:'number', default: 1},
    activeColor: {type:'color', default: palette.accent.darkColor || '#2196f3'},
    backgroundColor: {type:'color', default: palette.background.defaultColor || '#FFF'},
    backgroundOpacity: {type:'number', default: palette.background.opacity || '0.3'},
    scale:{type:'number',default:0.3},
    layout: {type:'string',default:'sticky-arch-layout'},
    turn:{type:'boolean', default:false},
    turnTo:{type:'vec3'},
    margin: {default: 0.5, min: 0}, // in meters
    radius: {default: 1, min: 0}, // in meters
  },
  init: function(){
    const data = this.data;
    const parent = this.el;
    const menu = this.menuArray = RVR.state.page.menuItems;
    const CHAR_WIDTH_PX = 30;
    const CHAR_WIDTH_M = 0.1024;
    const CHAR_HEIGHT_M = 0.1280;
    const widths=[];
    this.children = [];
    this.lengths = [];

    menu.forEach((item,index)=>{
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
          y: 0-(bgHeight/2 - CHAR_HEIGHT_M/2),
          z: 0.01
        }
      });
      menuItem.id = `id_${item.pageID}`;

      let menuItemContainer = RVRutils.createEntity(null,true,{
        geometry:{
          primitive:'plane',
          width:bgWidth,
          height:bgHeight
        },
        material:{
          shader:'flat',
          opacity: 0
        },
        position:'0 0 0',

      });

      let menuItemBackground = RVRutils.createEntity(null,true,{
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
        },
        position:'0 0 0.05',
        scale:{x:data.scale, y:data.scale, z:data.scale},
        'animation__click': {
          property: 'position',
          startEvents: 'click',
          from: '0 0 0.05',
          to: '0 0 0',
          dur:300,
          dir:'alternate'
        }
      });
      if(data.turn){
        let target = data.turnTo;
      }

      menuItemBackground.classList.add('link');
      this.lengths.push(bgWidth*data.scale);
      this.children.push(menuItemContainer);

      // add events
      menuItemContainer.addEventListener('loaded',this.update);

      menuItemBackground.appendChild(menuItem);
      menuItemContainer.appendChild(menuItemBackground);
      parent.appendChild(menuItemContainer);
    });

  },
  update:function(oldData){
    if(this.el && this.el.sceneEl){
      let layoutSystem = this.el.sceneEl.systems['sticky-arch-layout'];
      if(layoutSystem){
        let positions = layoutSystem.getSeparatedCirclePositions(this.data, this.lengths, {x:0, y:0, z:0});
        layoutSystem.setPositions(this.children, positions);
        positions.forEach((position,index)=>{
          //this.children[index].getChildEntities[0].setAttribute('animation__click',{property: 'position', startEvents: 'click', from:positions[index], to: {x:positions[index].x,y:positions[index].y,z:positions[index].z-0.1}, dur:300,dir:'alternate'});
          if(this.data.turn){
            let target = this.data.turnTo;
            setTimeout(()=>this.children[index].object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z)),0);
          }
        });
          this.el.setAttribute('rotation',`0 ${layoutSystem.centerArch(this.data,this.lengths)} 0`);
      }

      // look at position
      /*if(this.data.turn){

        console.log(this.children);
        this.children.forEach(child=>{
          console.log(new THREE.Vector3(target.x, target.y, target.z));
          child.object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z))
        });
      }*/
    }

    //this.children = this.el.getChildEntities();
  }
});
