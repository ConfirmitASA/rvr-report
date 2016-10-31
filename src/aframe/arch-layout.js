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

    console.log(mLength);

    for(let i=0; i<mLength.length; i++)
    {
      fromStart = direction * margin/2 + direction * Math.abs(Math.atan(mLength[i]/(2*radius)));
      console.log(fromStart)
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
    margin: {default: 0.5, min: 0}, // in meters
    radius: {default: 1, min: 0} // in meters
  },

  /**
   * Store initial positions in case need to reset on component removal.
   */
  update: function () {
    let self = this;
    let el = this.el;

    this.children = el.getChildEntities();
    this.lengths=[];
    this.initialPositions = [];

    this.children.forEach(function getInitialPositions (childEl) {
      if (childEl.hasLoaded) { return _getPositions(); }
      childEl.addEventListener('loaded', _getPositions);
      function _getPositions () {
        let position = childEl.getComputedAttribute('position');
        self.initialPositions.push(position);
        self.lengths.push(AFRAME.utils.entity.getComponentProperty(childEl,'geometry.width'));
      }
    });

    el.addEventListener('child-attached',  (evt)=>{
      // Only update if direct child attached.
      if (evt.detail.el.parentNode !== el) { return; }
      this.children.push(evt.detail.el);
      //this.update();
    });
    let startPosition = this.el.getAttribute('position');
    console.log(this.lengths);
    let positions = this.system.getSeparatedCirclePositions(this.data, this.lengths, startPosition);
    console.log(positions);
    this.system.setPositions(this.children, positions);

  },

  /**
   * Update child entity positions.
   */

  /**
   * Reset positions.
   */
  remove: function () {
    this.el.removeEventListener('child-attached', this.childAttachedCallback);
    this.system.setPositions(this.children, this.initialPositions);
  }
});



