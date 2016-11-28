


import variables from "../variables";
import RVRutils from 'rvr-utils'
require('./arch-layout');
require('./rvr-text');

let palette = RVRutils.getPalette(variables);

AFRAME.registerSystem('rvr-menu',{
  callback:function(e){
    let target, previous;
    target = e.detail.target && e.detail.target.classList.contains('link')? e.detail.target : e.path.find(el=>el.classList.contains('link'));
    previous = this.children.find(child=>child.firstElementChild.classList.contains('active'));
    if(previous){
      previous.firstElementChild.firstElementChild.setAttribute('bmfont-text','color',this.data.textColor);
      previous = previous.firstElementChild;
    }
    target.firstElementChild.setAttribute('bmfont-text','color',this.data.activeColor);
    RVRutils.classFollows('active',target,previous);
    RVR.state.page.sourceWindow = RVR.state.page.fetch({pageid:target.id.substr(3)});
  },
});

AFRAME.registerComponent(
  /**
   * @module rvr-menu
   *
   *
   * @constructor
   * @param {String} pageStateID - page state ID
   * @param {Boolean} turn - whether the menu item should face some vec3
   * @param {Vec3} turnTo - Coordinates to turn to
   * @param {Number} [margin=0.5] - margin between items in meters
   * @param {Number} [radius=1] - arch radius in meters
   * @param {Color} [textColor= palette.primary.textColor || '#FFF'] - arch radius in meters
   * @param {Number} [textOpacity=1] - opacity of the text
   * @param {Color} [activeColor= palette.primary.defaultColor || '#2196f3'] - color of the background for label when it's active
   * @param {Color} [hoverColor= palette.accent.darkColor || '#35f32a'] - color of the background for label when it's hovered
   * @param {Color} [backgroundColor= palette.background.defaultColor || '#FFF'] - color of the background for label
   * @param {Color} [backgroundOpacity= palette.background.opacity || '0.3'] - opacity of the background for label
   * @param {Number} [scale=0.3] - scale of the text component (it's quite large, so it has to be scaled down)
   * */
  'rvr-menu', {
  //dependencies:['sticky-arch-layout'],
  schema: AFRAME.utils.extend({ // we extend schema from link
    pageStateID: {type: 'string'},
    layout: {type:'string',default:'sticky-arch-layout'},
    turn:{type:'boolean', default:false},
    turnTo:{type:'vec3'},
    margin: {default: 0.5, min: 0}, // in meters
    radius: {default: 1, min: 0}, // in meters
  }, AFRAME.systems['rvr-text'].prototype.schema),

  init: function(){
    const data = this.data;
    const parent = this.el;
    const menu = this.menuArray = RVR.state.page.menuItems;
    const CHAR_WIDTH_PX = 30;
    const CHAR_WIDTH_M = 0.1024;
    const CHAR_HEIGHT_M = 0.1280;
    const textSystem = this.el.sceneEl.systems['rvr-text'];
    const location = RVR.state.page.location;

    /**
     * child entities of the menu entity
     * @memberOf module:rvr-menu
     * */
    this.children = []; // child entities of the menu entity
    this.lengths = [];

    menu.forEach(item=>{
      const bgWidth = (CHAR_WIDTH_M * item.label.length)+CHAR_WIDTH_M*2;
      const bgHeight = CHAR_HEIGHT_M*2;
      const isActive = location.query.pageid==item.pageID;

      // the container is needed to layout the items properly, so that if they are clickable, they have a local coordinate system
      let menuItemContainer = RVRutils.createEntity(null,{
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
      // add events
      menuItemContainer.addEventListener('loaded',this.update);

      // background for item
      let menuItemBackground = textSystem.createBackgroundPlane({data, width:bgWidth, height:bgHeight, isLink:true, callback:this.system.callback, context:this});

      menuItemBackground.id = `id_${item.pageID}`;
      if(isActive)menuItemBackground.classList.add('active');

      // item text
      let menuItem = textSystem.createText({
        data,
        width: item.label.length * CHAR_WIDTH_PX,
        text:  item.label,
        x:     0-(bgWidth/2)+CHAR_WIDTH_M,
        y:     0-(bgHeight/2 - CHAR_HEIGHT_M/2),
        isActive: isActive
      });

      this.lengths.push(bgWidth*data.scale);
      this.children.push(menuItemContainer);


      // attach to parent
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
          if(this.data.turn){
            let target = this.data.turnTo;
            setTimeout(()=>this.children[index].object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z)),0);
          }
        });
          this.el.setAttribute('rotation',`0 ${layoutSystem.centerArch(this.data,this.lengths)} 0`);
      }
    }
  }
});
