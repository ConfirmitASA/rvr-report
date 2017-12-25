import RVRprocessor from "./rvr-processor";
import RVRutils from "rvr-utils"
import RVRAggregatedTable from "../aggregated-table/rvr-aggregated-table"

RVRprocessor.add({
  aggregatedTable(element){
    console.time('aggregatedTable');
    [].slice.call(element.classList).forEach(cls=>{if(cls.indexOf('rvr-')==-1){element.classList.remove(cls)}}); //remove all classes from table to avoid unnecessary styling and collision

    let table = new RVRAggregatedTable({source:element,sorting:{}});

    let width = element.offsetWidth,
      height = element.offsetHeight,
      dataCharLength=RVRAggregatedTable.maxCharLengths(table.data),
      header = [].slice.call(element.querySelector('thead').children),
      guid =  RVRutils.guid(),
      aTable = RVRutils.createEntity(null,{
        'rvr-aggregatedtable':{
          id:guid,
          scale:0.4,
          radius:3,
          margin:0.05,
          turn:true,
          turnTo: {x:0,y:1.6, z:0},
          lockAxis:'y'
        }
      });

    RVR.state.registerComponent('aggregatedTable',{result:table,width,height,dataCharLength,aframeElement:aTable},guid);
    document.querySelector('a-scene').appendChild(aTable);
    console.timeEnd('aggregatedTable');
  }
});

