import "./search.css";
import { FaSearch, FaMapPin, FaArrowRight } from "react-icons/fa"
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import loader from '../../assets/cooking_loader.gif'
import RestaurantList from '../home/list'
export default function Search() {


  const redProps = useSelector((state) => state);
  const dispatch = useDispatch();

  const [location, setLocation] = useState("Location");
  const [barFocus, setBarFocus] = useState(false)
  const [focus, setfocus] = useState(false);
  const [locInput, setLocInput] = useState("");
  const [cityList, setCityList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [food, setFood] = useState("");
  const [foodList, setfoodList] = useState([])
  const [searchDisabled, setsearchDisabled] = useState(true)
  const [width, setWidth] = useState('100%')
  const searchBar = useRef(null)
  const foodSearch = useRef(null)
  const locSearch = useRef(null)
  useEffect(() => {
    console.log(redProps)
  }, [redProps])
 /* const getCity = async (lat, long, fromZom) => {
    const res = await axios.get(
      `http://localhost:5001/getLocInfo?lat=${lat}&long=${long}&pid=0`
    );
    console.log(res.data.data);
    if (fromZom) setLocation(res.data.data.locationDetails.cityName);
    dispatch({
      type: "UPDATE_CITY",
      payload: {
        cityId: res.data.data.locationDetails.cityId,
        cityName: res.data.data.locationDetails.cityName,
        loc: {
          lat: lat,
          long: long,
        },
        entityId: res.data.data.locationDetails.entityId,
        deliveryId: res.data.data.locationDetails.deliverySubzoneId,
      },
    });
    const params = {
      cityId: res.data.data.locationDetails.cityId,
      cityName: res.data.data.locationDetails.cityName,
      lat: lat,
      long: long,
      entityId: res.data.data.locationDetails.entityId,
      deliveryId: res.data.data.locationDetails.deliverySubzoneId,
    };
    setSearchParams(params);
  };*/

  useEffect(()=>{
    !redProps.sideBar ? setWidth('100%') : setWidth('60%');
  },[redProps.sideBar])

  useEffect(()=>{
    var userLocation = localStorage.getItem("user_location");
    var locationName = localStorage.getItem("user_location_name");
    if(userLocation != null && locationName != null){
      userLocation = JSON.parse(userLocation);
      console.log(userLocation)
      setLocation(locationName)
      setSearchParams(userLocation);
      setsearchDisabled(false)
      setfocus(false);
      setCityList([]);
      setLocInput("");
      dispatch({
        type: "UPDATE_CITY",
        payload: {
          cityId: userLocation.cityId,
          cityName: userLocation.cityName,
          loc: {
            lat: userLocation.lat,
            long: userLocation.long,
          },
          entityId: userLocation.entityId,
          deliveryId: userLocation.deliveryId,
        },
      });
    }
  },[])

  const citySuggestion = async () => {
    const res = await axios.get(
      `http://localhost:5001/citySuggest/${locInput}`
    );

    setCityList(res.data.data.locationSuggestions);
  };
  useEffect(() => {
    citySuggestion()
  }, [locInput])

  const changeHandler = (p) => {
    p.preventDefault();
    setLocInput(p.target.value);
  };

  const focusEve = () => {
    setfocus(true);
  };


  const blurEve = () => {
    setfocus(false);
  }


  const suggestionClick = (item) => {
    const lat = item.place.latitude;
    const lon = item.place.longitude;
    const name = item.display_title;
    const place_id = item.place.place_id;
    console.log(name)
    dispatch({
      type: "UPDATE_LOCATION",
      payload: {
        lat: lat,
        long: lon,
      },
    });
    localStorage.setItem("user_location_name",name)
    setLocation(name);
    
    
    setLocInput("");
    
    getLocInfo(item.place.latitude, item.place.longitude, item.place.place_id);
    setCityList([]);
    setfocus(false);
  };

  const getLocInfo = async (lat, lon, pid) => {

    await axios
      .get(`http://localhost:5001/getLocInfo?lat=${lat}&long=${lon}&pid=${pid}`)
      .then((res) => {
        var params = {
          cityId: res.data.data.locationDetails.cityId,
          cityName: res.data.data.locationDetails.cityName,
          lat: lat,
          long: lon,
          entityId: res.data.data.locationDetails.entityId,
          deliveryId: res.data.data.locationDetails.deliverySubzoneId,
        };
        setSearchParams(params);
        setsearchDisabled(false)
        dispatch({
          type: "UPDATE_CITY",
          payload: {
            cityId: res.data.data.locationDetails.cityId,
            cityName: res.data.data.locationDetails.cityName,
            loc: {
              lat: lat,
              long: lon,
            },
            entityId: res.data.data.locationDetails.entityId,
            deliveryId: res.data.data.locationDetails.deliverySubzoneId,
          },
        });
        params = JSON.stringify(params)
        localStorage.setItem("user_location",params)
      });
  };


  useEffect(async () => {
    //console.log(searchParams.entityId, searchParams.cityId, searchParams.lat, searchParams.long, searchParams.cityName)
    if(food.length>3){
    const res = await axios.get(`http://localhost:5001/getFoodSuggestion?entityId=${searchParams.entityId}&cityId=${searchParams.cityId}&lat=${searchParams.lat}&long=${searchParams.long}&deliveryId=${searchParams.deliveryId}&food=${food}&cityName=${searchParams.cityName}`)
    setfoodList(res.data.data.results)
    }
    else{
      setfoodList([])
    }
  }, [food]);


  const handleFoodChange = (p) => {
    p.preventDefault();
    setFood(p.target.value);
  };

  const foodClick = async (item) => {
    dispatch({
      type: "UPDATE_FOOD",
      payload: {
        foodId: item.entityId,
        foodName: item.name
      },
    });
    dispatch({
      type: "UPDATE_LOADING"
    })
    setfoodList([])
    setFood(item.name)  
    searchBar.current.style.top = "10%";
    foodSearch.current.style.display = "none";
    locSearch.current.style.display = "none";
    const res = await axios.get(`http://localhost:5001/getFood/v2?cityname=${redProps.cityName}&foodid=${item.entityId}&lat=${redProps.loc.lat}&long=${redProps.loc.long}&food=${item.name}`)
    res.data.data.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
    dispatch({
      type: "UPDATE_LIST",
      payload: res.data.data
    })
    dispatch({
        type:"UPDATE_LOADING"
    })
  }



  useEffect(() => {
    setTimeout(() => {
      if(barFocus==true){
        foodSearch.current.style.display = "flex";
      }
      else{
        foodSearch.current.style.display = "none";
      }
    }, 500);
    
  }, [barFocus])



  useEffect(() => {
    setTimeout(() => {
      if(focus==true){
        locSearch.current.style.display = "flex";
      }
      else{
        locSearch.current.style.display = "none";
      }
    }, 500);
    
  }, [focus])

  return (
    <div className="search-container" style={{width:width}} ref={searchBar}>
      <form className="form">
        <div className="locationbar">
          <FaMapPin
            size={16}
            style={{
              marginRight: "20px",
              marginLeft: "20px",
              color: location === "Location" ? "#ccc" : "#000",
            }}
          />
          <div style={{ lineHeight: 0 }}>
            <input
              
              className="loc-input"
              onFocus={() => focusEve()}
              onBlur={() => blurEve()}
              value={!focus ? `${location.substring(0, 10)}...` : locInput}
              placeholder={
                !focus
                  ? `${location.substring(0, 10)}...`
                  : "Type your locality"
              }
              onChange={(p) => {
                changeHandler(p);
              }}
            />
            <p style={{ fontSize: "8px", marginTop: 0, textAlign: "left" }}>
              {!focus ? "(Press to change location)" : null}
            </p>
          </div>
        </div>
        <hr className="hr" />
        <FaSearch style={{
              color: searchDisabled ? "#ccc" : "#000",
            }}/>
        <input
          
          onFocus = {()=>setBarFocus(true)}
          onBlur = {()=> setTimeout(()=>setBarFocus(false),1000)}
          onChange={(p) => handleFoodChange(p)}
          className="searchbar"
          value = {food}
          placeholder={
            location === "Location"
              ? "Please select location"
              : "Search for dishes"
          }
        />
      </form>
      <div className="suggestionbar">
        <div className="citysuggestion" ref={locSearch}>
          {cityList.map((item, index) => {
            return (
              <button
                style={{
                  width: "100%",
                  paddingLeft: "10px",
                  textAlign: "left",
                  cursor:'pointer'
                }}
                onClick={() => suggestionClick(item)}
              >
                <p style={{ fontWeight: "bold" }}>{item.display_title}</p>
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    color: "#9D959F",
                  }}
                >
                  {item.display_subtitle}
                </p>
              </button>
            );
          })}
        </div>
        <div className="foodSuggestion" ref={foodSearch}>

        {foodList.map((item, index) => {
          if(item.entityType == "universal_dish")
            return (
              <div
                className="foodList"
                onClick={() => foodClick(item)}
              ><div style = {{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <img width="60px" height="60px" style={{borderRadius:'50%', marginRight:'10px'}} src = {item.info.image.url}/>
                <p style={{ fontWeight: "bold" }}>{item.info.name}</p>
              </div>
                <div style = {{display:"flex",width:'30px',height:'30px',borderRadius:'50%',alignItems:'center',justifyContent:'center',marginRight:'20px'}}>
                  <FaArrowRight color="#000"/>
                </div>
              </div>
            );
          })}

        </div>
        
      </div>
        {
          redProps.loading ? <img src={loader} width = "30%"/> : redProps.foodName !== "" ? <RestaurantList/> : null
        }
    </div>
  );
}