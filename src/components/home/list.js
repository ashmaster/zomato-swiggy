import {useSelector,useDispatch} from 'react-redux';
import {useEffect, useState, useRef} from 'react';
import loader from '../../assets/cooking_loader.gif'
import './list.css'
import ph from "../../assets/ph.png"
import axios from 'axios';
import {FaRegClock} from 'react-icons/fa'
export default function RestaurantList(){
    const redProps = useSelector(state => state);
    const dispatch = useDispatch();
    const [term, setTerm] = useState('');
    const [resList, setList] = useState(redProps.resList)
    const clickCard = (item) =>{
        dispatch({
            type: "UPDATE_SIDEBAR",
            payload:true
        });
        dispatch({
            type: "UPDATE_ITEM",
            payload: item
        })
    }

    useEffect(() => {
        if(term == ''){
            setList(redProps.resList)
        }
        else{
            let newlist = resList.filter((item)=>item.name.toLowerCase().includes(term));
            setList(newlist);
        }
    }, [term])
    
    return(
        <div className = "list">
            <link href="https://fonts.googleapis.com/css2?family=Jura:wght@300&display=swap" rel="stylesheet"></link>
            <p style = {{fontSize:"18px", fontWeight:'bold', fontFamily:'Jura'}}>Showing {redProps.resList.length} restaurants having {redProps.foodName} </p>
            <div style = {{width:'80%',height:'2px',backgroundColor:'#ccc'}}></div>
            <input className="searchRes" placeholder="Search for a restaurant" onChange={(t)=>setTerm(t.target.value)}/>
            <div style={{display:'flex',flexDirection:'row',width:'100%',height:'100%'}}>
                <div className = "resList">
                    {
                        resList.map((item,index)=>{
                            
                            return(
                                item.price!=="" ?
                                <div onClick={()=>clickCard(item)} className = "resCard">
                                    <img src = {item.source === "Zomato" ? "https://b.zmtcdn.com/images/logo/zomato_logo_2017.png" : "https://res.cloudinary.com/swiggy/image/upload/portal/c/favicon-96x96.png"} width="30px" height="30px" style={{borderRadius:'50%', marginTop:'5px', marginLeft:'20px'}}/>
                                    <img src={item.img.includes('jpg') || item.img.includes('swiggy') ? item.img : ph} className="resImg"/>
                                    <div className = "resDet">
                                        <div className="resName">
                                            <p style={{fontSize:'16px', fontWeight:'bold', fontFamily:'jura',margin:0}}>{item.name}</p>
                                            
                                            <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:'5px'}}>
                                                <p style={{fontSize:'18px', fontWeight:'bolder', fontFamily:'jura',margin:0}}>₹{item.price} <span style={{fontSize:'12px'}}>per person</span></p>
                                                <span className = "dot"></span>
                                                <FaRegClock style={{marginRight:'5px'}}/>
                                                <p style={{fontSize:'16px', fontWeight:'bold', fontFamily:'jura',margin:0}}>{item.time} <span style={{fontSize:'12px'}}>min</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div> : null
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}