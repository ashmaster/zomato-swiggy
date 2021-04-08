import { useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './resdet.css'
import {IoMdClose} from 'react-icons/io'
import ZomatoDets from '../../components/home/zomdets'

export default function ResDetails(){

    const redProps = useSelector(state => state)
    const dispatch = useDispatch();
    const closeClick = () =>{
        dispatch({
            type:"UPDATE_SIDEBAR",
            payload:false
        })
    }
    if(redProps.sideBar){
    return(
        <div className = "resDet-container">

            {redProps.item.source=="Zomato" ? <a target="_blank" href={`https://www.zomato.com/${redProps.item.url}`}><div className="gotoButton" style={{backgroundColor:"rgb(245,67,75)"}}>
                    <p>Go to {redProps.item.source}</p>
            </div></a> : 
            
            <a target="_blank" href={redProps.item.url}><div className="gotoButton" style={{backgroundColor:"rgb(243,132,33)"}}>
                    <p>Go to {redProps.item.source}</p>
            </div></a>}
            <link href="https://fonts.googleapis.com/css2?family=Jura:wght@300&display=swap" rel="stylesheet"></link>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:'40px'}}>
            <IoMdClose size = {32} style={{cursor:'pointer'}} onClick={()=>closeClick()} />
            <p style = {{margin:0, fontSize:'24px', fontWeight:'bold',fontFamily:'Jura',textAlign:'center'}}>{redProps.item.name}</p>
            <img src={redProps.item.source == "Zomato" ? "https://b.zmtcdn.com/images/logo/zomato_logo_2017.png" : "https://res.cloudinary.com/swiggy/image/upload/portal/c/favicon-96x96.png"} style={{width:'32px',height:'32px',borderRadius:'50%'}}/>
            </div>

            {redProps.item.source === "Swiggy" ? 
            (<div>
                <div className="message">
                    <p>{redProps.item.charge.message}</p>
                </div>
                <div className="message">
                    <p>{redProps.item.time} min delivery time</p>
                </div>
               
            </div>) : 
            (
                <div>
                <div className="message">
                    <p>{redProps.item.time} min delivery time</p>
                </div>
                
            </div>
            )}
            {
            <div className="resDets">
                <p style={{fontFamily:'Jura', fontWeight:'bold', fontSize:'18px'}}>Menu</p>
                {
                    redProps.item.source === "Swiggy" ? redProps.item.menu.map((item,index)=>{
                        return(
                            <div className="foodCard">
                            <div className = "foodDets">
                                <p>{item.name}</p>
                                <p style={{fontWeight:'bold'}}>₹{item.price/100}</p>
                                
                            </div>
                                {
                                    item.variants_new.variant_groups.length != 0 ?
                                        <div>
                                            <div style={{width:'100%',height:'1px',backgroundColor:'#ccc'}}/>
                                            {
                                                item.variants_new.variant_groups.map((variantgrp,index)=>{
                                                    return(
                                                        <div>
                                                            <p style={{fontWeight:'bold'}}>{variantgrp.name}</p>
                                                            {
                                                                variantgrp.variations.map((variants,index)=>{
                                                                    return(
                                                                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                                            <p>{variants.name}</p>
                                                                            <p style={{fontWeight:'bold'}}>+₹{variants.price/100}</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        :null
                                }
                            </div>
                        )
                    }) : <ZomatoDets/>
                }
            </div> 
            }
            
        </div>
    )}
    else{
        return(
            <div/>
        )
    }
}