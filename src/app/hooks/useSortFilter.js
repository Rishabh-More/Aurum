import { useStore } from "../config/Store";

export default function useSortFilter() {
  const { state, dispatch } = useStore();

  async function SortBy(sort) {
    let data = [];
    //TODO sorting flow
    //Step 1. if sort by sku & filter is active,
    //gets the filtered items and simply return filtered items
    if (sort == "item" && state.indicators.isFilterApplied) {
      data = state.data.filter;
    }
    //Step 2. if sort by sku & no filters are applied,
    //simply return the catalogue array from store
    else if (sort == "item") {
      console.log("sort kook sku if executed");
      data = state.data.catalogue;
    }
    //Step 3. if sort by design
    else if (sort == "group") {
      // 3.a: first check if filter is active or not
      //***** If it is active then take the filter array and apply the group logic */
      //***** or take the original catalogue array and apply the group logic */
      const container = state.indicators.isFilterApplied ? state.data.filter : state.data.catalogue;

      // 3.b: Apply the grouping logic and return back the sorted array
      var count = container.reduce((k, v) => {
        var designNumber = v.designNumber;
        if (v.imageUrl != "") {
          var imageUrl = v.imageUrl;
        } else {
          imageUrl = require("../res/assets/broken-image.png");
        }

        if (!k.hasOwnProperty(designNumber)) {
          k[designNumber] = [0, imageUrl];
        }
        k[designNumber][0] = k[designNumber][0] + 1;

        return k;
      }, {});

      data = Object.keys(count).map((k) => {
        return { designNumber: k, count: count[k][0], imageUrl: count[k][1] };
      });
    }
    await dispatch({ type: "UPDATE_DESIGNS", payload: data });
  }

  //Return whichever items you want to return from the hook.
  //These can be values, arrays and even functions as well
  return { SortBy };
}
