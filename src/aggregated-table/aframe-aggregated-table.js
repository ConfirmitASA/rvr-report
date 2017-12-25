import RVRutils from "rvr-utils"
import RVRtext from "../aframe/rvr-text";

class AframeAggregatedTable extends RVRutils{
  constructor(){
    super();
  }

  static createRow(data,rowData,lengths){
    let row = RVRutils.createEntity(null,{
      'sticky-arch-layout': {
        margin: data.margin,
        radius: data.radius,
        turn:data.turn,
        turnTo:data.turnTo
      }
    });
    rowData.forEach((item,index)=>{
      let label = item.rawData,
        length = lengths[index],
        cell = AframeAggregatedTable.createCell({data,length,label});
      row.appendChild(cell);
      item.aframeCell = cell;
    });
    return row
  }

  static createCell({data,length=1,label,isLink=false,callback,context,isActive=false}={}){
    const CHAR_WIDTH_PX = 25;
    const CHAR_WIDTH_M = 0.1024;
    const CHAR_HEIGHT_M = 0.128;
    const bgWidth = (CHAR_WIDTH_M * length)+CHAR_WIDTH_M*2;
    const bgHeight = CHAR_HEIGHT_M*2;
    // item background
    let cellBackground = RVRtext.createBackgroundPlane({data:data, width:bgWidth, height:bgHeight, isLink:isLink, callback:callback, context:context});
    // item text
    let cellText = RVRtext.createText({
      data,
      width: length * CHAR_WIDTH_PX,
      text:  label,
      x:     0-(bgWidth/2)+CHAR_WIDTH_M,
      y:     0-(bgHeight/2 - CHAR_HEIGHT_M/2),
      isActive: isActive
    });
    cellBackground.appendChild(cellText);
    return cellBackground;
  }
}
export default AframeAggregatedTable;
