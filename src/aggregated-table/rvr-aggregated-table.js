import AggregatedTable from 'r-aggregated-table';
import ReportalBase from 'r-reportal-base';

class RVRAggregatedTable extends AggregatedTable{
  constructor(options){
    super(options);
  }
  /**
   * Extracts data from a given cell. Override in an inherited class if you need to add any metadata to it.
   * @param {HTMLTableCellElement} cell - cell element to have data stripped off it
   * @param {HTMLTableCellElement} rowIndex - index of the row it's in
   * @param {HTMLTableCellElement} columnIndex - index of the column it's in
   * @returns {{cell:HTMLTableCellElement, ?data:String|Number, columnIndex:Number}} Returns an object `{cell:HTMLTableCellElement, data:?String|?Number, columnIndex:Number}` (if data is absent in the cell or its text content boils down to an empty string - i.e. there are no characters in the cell, only HTML tags) it returns null in `data`
   * @override
   * */
  static prepareDataCell(cell, rowIndex, columnIndex){
    return {
      cell,
      data: ReportalBase.isNumber(cell.textContent.trim()),
      rawData: cell.textContent.trim(),
      columnIndex,
      rowIndex
    }
  }
  static maxCharLengths(arr){
    let lengths=[];
    let len = arr.length;
    while (len--) {
      let colLength = arr[len].length;
      while(colLength--){
        if(!lengths[colLength]){lengths[colLength]=-Infinity}
        if (arr[len][colLength].rawData.length > lengths[colLength]) {
          lengths[colLength] = arr[len][colLength].rawData.length;
        }
      }
    }
    return lengths;
  }
}

export default RVRAggregatedTable;
