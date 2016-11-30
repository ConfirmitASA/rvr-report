


import variables from "../variables";
import RVRutils from 'rvr-utils';
import RVRtext from './rvr-text';
import AframeAggregatedTable from "../aggregated-table/aframe-aggregated-table"


require('./arch-layout');
//require('./rvr-text');

let palette = RVRutils.getPalette(variables);

AFRAME.registerSystem('rvr-aggregatedtable',{
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
  'rvr-aggregatedtable', {
  //dependencies:['sticky-arch-layout'],
  schema: AFRAME.utils.extend({ // we extend schema from link
    id:{type:'string'},
    layout: {type:'string',default:'sticky-arch-layout'},
    turn:{type:'boolean', default:false},
    turnTo:{type:'vec3'},
    margin: {default: 0.5, min: 0}, // in meters
    radius: {default: 1, min: 0}, // in meters
  }, RVRtext.schema()),

  init: function(){
    const data = this.data;
    const parent = this.el;
    const entry = RVR.state._componentRegistry[data.id].meta;
    const rows = entry.result.data;

    /**
     * child entities of the menu entity
     * @memberOf module:rvr-menu
     * */
    this.children = []; // child entities of the menu entity
    this.lengths = [];
    let table = RVRutils.createEntity(null,{});
    rows.forEach((rowData,i)=>{
      let tr = AframeAggregatedTable.createRow(data,rowData,entry.dataCharLength);
      let rowOffset = 0.2+ (0.256*(rows.length-1-i))*data.scale;
      tr.setAttribute('position',{x:0,y:rowOffset,z:0});
      // attach to parent
      table.appendChild(tr);
      this.el.appendChild(table);
    });
  },

  update:function(oldData){
    if(this.el && this.el.sceneEl){
      let layoutSystem = this.el.sceneEl.systems[this.data.layout];
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
