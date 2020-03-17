//MAIN MODULES
import React, { Component } from "react";
import { connect } from "react-redux";
//COMPONENTS
import DeviceDataTableItem from "./DeviceDataTableItem";

class DeviceTaskPage extends Component {

  render() {
    return (
      <div className="container">

        <table className="borderless-table">
        <tbody>
          <tr>
            <th className="borderless-table--th device--date">
              תאריך
            </th>
            <th className="borderless-table--th device--action">
              פעולה
            </th>
            <th className="borderless-table--th device--create">
              נוצר ע"י
            </th>
          </tr>
          </tbody>
        </table>

        {this.props.futureActions &&
        this.props.futureActions.map((timer, index) => <div key={index}><DeviceDataTableItem {...timer}  actionType /></div>)}
        <div className="-n-mb-20"></div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  futureActions: state.deviceData.futureAction
});

export default connect(mapStateToProps)(DeviceTaskPage);






/* FILE__END */







import React from "react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default props => {  
  return (
    <div className="ltr graph-panel--graph">
      <LineChart width={880} height={260} data={props.data} className="ltr">
        <Line
          name={props.currentYear}
          type="monotone"
          dataKey="newUsage"
          stroke="#44C8F5"
          activeDot={{r: 8}}
        />
        <Line
          name={props.lastYear}
          type="monotone"
          dataKey="oldUsage"
          stroke="#0061AF"
          activeDot={{r: 8}}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 1" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};






/* FILE__END */






import React, { Component } from "react";
import { withRouter } from "react-router";
import DeviceListItemData from "./DeviceListItemData";
import DeviceListItemAlert from "./DeviceListItemAlert";

class DeviceListItem extends Component {
  state = {
    showAlerts: false
  };

  onAlertClick = () => {
    this.setState(prevState => ({ showAlerts: !prevState.showAlerts }));
  };

  onDeviceUsageClick = () =>
    this.props.history.push(`/device-data/${this.props.device.id}`);

  render() {   
    return (
      <div>
        {!this.state.showAlerts ? (
          <DeviceListItemData
            {...this.state}
            device={this.props.device}
            onDeviceUsageClick={this.onDeviceUsageClick}
            onAlertClick={this.onAlertClick}
          />
        ) : (
          <DeviceListItemAlert
            {...this.props}
            onAlertClick={this.onAlertClick}
            canErase
          />
        )}
      </div>
    );
  }
}

export default withRouter(DeviceListItem);





/*      END      */





import   {FETCH_SITES,POST_SITE,PUT_SITE,DELETE_SITE} from "../constants/actionConstants"


const defaultState = [];

export default (state = defaultState, action) => {
  switch (action.type) {    
    case FETCH_SITES:
      return [...action.sites];
      case POST_SITE:     
      return [...state, action.site]
      case PUT_SITE:
      const newStateP= state.map(site=>site.id===action.site.id?action.site:site)
      return [...newStateP]
      case DELETE_SITE:
      const newStateD=state.filter(site=>site.id!==action.id)
      return [...newStateD]
    default: 
      return state;
  }
};





/* FILE__END */




const MAX_MILLISECONDS_PER_ITERATION = 100;

function iterate( arr, curIndex, callback, context, resolveFn ){
    const curStamp = performance.now();
    for( let i = curIndex; i < arr.length; ){
        callback.call( context, arr[ i ], i, arr );
        i++;
        if( performance.now() - curStamp > MAX_MILLISECONDS_PER_ITERATION ){
            return setTimeout(
                iterate,
                0,
                arr,
                i,
                callback,
                context,
                resolveFn
            );
        }
    }

    resolveFn();
}

const forEachAsync = ( arr, callback, context = window ) => new Promise( resolve => iterate(
    arr,
    0,
    callback,
    context,
    resolve
));

export default forEachAsync;






/* FILE__END */








//MAIN MODULES 
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { reducer as formReducer } from "redux-form"
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

//AXIOS
import axios from "axios"

//REDUCERS
import alertsReducer from "../reducers/alerts";
import devicesReducer from "../reducers/devices";
import devicesUsageFiltersReducer from "../reducers/devicesUsageFilters";
import loginReducer from "../reducers/login";
import sitesReducer from "../reducers/sites";
import tasksReducer from "../reducers/tasks";
import deviceFiltersReducer from "../reducers/deviceFilters";
import usersReducer from "../reducers/users";
import currentSiteReducer from "../reducers/currentSite";
import deviceDataReducer from "../reducers/deviceData";
import taskDevicesReducer from "../reducers/taskDevices";


//FOR REDUX DEVTOOLS
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


  const rootReducer = 
    combineReducers({
      alerts: alertsReducer,
      devices: devicesReducer,
      devicesUsageFilters: devicesUsageFiltersReducer,
      login: loginReducer,
      sites: sitesReducer,
      tasks: tasksReducer,
      deviceFilters: deviceFiltersReducer,
      users: usersReducer,
      currentSite: currentSiteReducer,
      deviceData: deviceDataReducer,
      taskDevices: taskDevicesReducer,
      form: formReducer
    })
   
 


const persistConfig = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const configureStore = () => {
  let store = createStore(persistedReducer,composeEnhancers(applyMiddleware(thunk.withExtraArgument(axios))))
  let persistor = persistStore(store)
  return { store, persistor }
}
