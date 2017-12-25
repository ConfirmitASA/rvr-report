/**
 * Created by IvanP on 31.10.2016.
 */

AFRAME.registerSystem('sticky-arch-layout', {
  /**
   * Function that does calculation of distribution of elements in a circulra fashoin on a semi-circle
   * @param {{direction:Number, margin:Number, radius:Number}} data - object containing `direction (-1:right| 1:left)` in which positioning elements will take place, `margin` in rad which defines distance between elements and `radius` in meters
   * @param {Array} mLength - Array of widths of elements starting with the one on 12 o'clock and going clockwise fo `data.direction ==-1` ar anticlockwise for `data.direction==1`
   * @param {{x:Number, y:Number, z:Number}} startPosition - initial coordinates of the center point of the circle on which arch elements are placed
   * */
  getSeparatedCirclePositions: function(data, mLength, startPosition){
    let positions=[];

    let startPointOnCircle = Math.PI/2,
      fromStart=0,
      radius = data.radius || 2,
      margin = data.margin/data.radius,
      direction = data.direction || -1;


    for(let i=0; i<mLength.length; i++)
    {
      fromStart = direction * margin/2 + direction * Math.abs(Math.atan(mLength[i]/(2*radius)));
      startPointOnCircle = startPointOnCircle+fromStart;

      positions.push({
        x: startPosition.x + radius*Math.cos(startPointOnCircle),
        y: startPosition.y,
        z: -startPosition.z - radius*Math.sin(startPointOnCircle)
      });

      startPointOnCircle = startPointOnCircle+fromStart;

    }

    return positions;

  },

  centerArch:function(data,mLengths){
    return 180*(mLengths.reduce((a, b) => a + b, data.margin*mLengths.length)/data.radius)/(Math.PI*2);
  },

  /**
   * Set position on child entities.
   *
   * @param {array} els - Child entities to set.
   * @param {array} positions - Array of coordinates.
   */
  setPositions: (els, positions)=> {
    els.forEach(function (el, i) {
      el.setAttribute('position', positions[i]);
    });
  },

  /**
   * Multiply all coordinates by a scale factor and add translate.
   *
   * @params {array} positions - Array of coordinates in array form.
   * @returns {array} positions
   */
  transform: (positions, translate, scale) => {
    translate = [translate.x, translate.y, translate.z];
    return positions.map(function (position) {
      return position.map(function (point, i) {
        return point * scale + translate[i];
      });
    });
  }

});

/**
 * Layout component for A-Frame.
 */
AFRAME.registerComponent('sticky-arch-layout', {
  schema: {
    margin: {default: 0.05, min: 0}, // in meters
    radius: {default: 1, min: 0}, // in meters
    turn:{type:'boolean', default:false},
    turnTo:{type:'vec3'},
    lockAxis:{type:'string'}
  },

  /**
   * Store initial positions in case need to reset on component removal.
   */
  init: function () {
    let self = this;
    let el = this.el;

    this.children = el.getChildEntities();
    this.lengths=[];
    this.initialPositions = [];

    this.children.forEach(function getInitialPositions (childEl) {
      if (childEl.hasLoaded) { return _getPositions(); }
      childEl.addEventListener('loaded', _getPositions);
      function _getPositions (e) {
        let position = childEl.getComputedAttribute('position');
        self.initialPositions.push(position);
        let scale = AFRAME.utils.entity.getComponentProperty(childEl,'scale').x || 1;
        self.lengths.push(AFRAME.utils.entity.getComponentProperty(childEl,'geometry.width')*scale);
        self.update();
      }
    });

    el.addEventListener('child-attached',  (evt)=>{
      console.log('child-attached',evt.detail.el, evt);
      // Only update if direct child attached.
      if (evt.detail.el.parentNode !== el) { return; }
      this.children.push(evt.detail.el);
      this.update();
    });
  },


  /**
   * Update child entity positions.
   */
  update:function(oldData){
    let startPosition = this.el.getAttribute('position') || {x:0, y:0, z:0};
    let positions = this.system.getSeparatedCirclePositions(this.data, this.lengths, startPosition);
    this.system.setPositions(this.children, positions);
    positions.forEach((position,index)=>{
      if(this.data.turn){
        let target = this.data.turnTo;
        if(this.data.lockAxis!=''){target[this.data.lockAxis]=position[this.data.lockAxis]}
        setTimeout(()=>this.children[index].object3D.lookAt(new THREE.Vector3(target.x, target.y, target.z)),0);
      }
    });

  },

  /**
   * Reset positions.
   */
  remove: function () {
    this.el.removeEventListener('child-attached', this.childAttachedCallback);
    this.system.setPositions(this.children, this.initialPositions);
  }
});



