/**
 * Created by IvanP on 27.10.2016.
 */

import variables from "./variables"
import RVRutils from "rvr-utils"
import PageFetch from "./page-fetch/page-fetch"


class RVRreport {
  constructor(){
    this.palette = RVRutils.getPalette(variables);
    this.page = new PageFetch();
  }

}

export default RVRreport
