import { createStore } from 'redux';



const initialState = {
    loc:{
        lat :'',
        long :'',
    },
    cityName:'',
    cityId:'',
    entityId: '',
    deliveryId: '',
    foodId:'',
    foodName:'',
    url:'',
    loading:false,
    resList: [],
    sideBar: false,
    item: {}
}

function reducer(state = initialState,action){
    switch(action.type){
        case "UPDATE_LOCATION" : {
            const { loc } = state;
            const newloc = action.payload

            return{
                ...state, loc:newloc
            }
        }
        case "UPDATE_CITY" :{
            const {cityId, cityName, entityId, deliveryId, loc } = state;
            const newcityid = action.payload.cityId;
            const newcityName = action.payload.cityName;
            const newentityId = action.payload.entityId;
            const newdeliveryId = action.payload.deliveryId;
            const newloc = action.payload.loc


            return{
                ...state, cityId:newcityid, cityName: newcityName, entityId: newentityId, deliveryId: newdeliveryId, loc: newloc
            }
        }

        case "UPDATE_FOOD" : {
            const {foodId, foodName} = state;
            const newfoodid = action.payload.foodId;
            const newfoodname = action.payload.foodName;

            return{
                ...state, foodId:newfoodid, foodName: newfoodname
            }
        }
        case "UPDATE_LOADING" : {
            const {loading} = state;
            var newloading = loading ? false : true;
            return{
                ...state, loading:newloading
            }
        }
        case "UPDATE_LIST" : {
            var newlist = action.payload;
            return{
                ...state, resList:newlist
            }
        }
        case "UPDATE_SIDEBAR": {
            var newsidebar = action.payload
            return{
                ...state, sideBar: newsidebar
            }
        }
        case "UPDATE_ITEM": {
            var newitem = action.payload;
            return{
                ...state, item: newitem
            }
        }
        default :{
            return state
        }
         

    }

}
export const store = createStore(reducer);