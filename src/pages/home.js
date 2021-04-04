import Search from '../components/home/search'
import "./home.css"
import RestaurantList from '../components/home/list'
import ResDetails from '../components/home/resdet'
import { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
export default function Home(){  
    const [width, setWidth] = useState('0%')  
    const redState = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        if(redState.sideBar){
            setWidth('40%')
        }
        else{
            setWidth('0%')
        }
    }, [redState.sideBar])
    return(
        <div className="home-container">
            <Search/>
            <div className = "sideBar" style={{width:width}}>
                <ResDetails/>
            </div>
        </div>
    )
}