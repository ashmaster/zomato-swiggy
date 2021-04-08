import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState} from 'react';
import axios from 'axios';
import loading from '../../assets/zom_loader.gif'
import './zomdets.css'

export default function ZomatoDets(){
    const redProps = useSelector(state => state);
    const dispatch = useDispatch();
    const [menu, setMenu] = useState([])
    const [loader, setLoader] = useState(false)
    useEffect(async ()=>{
        setLoader(true)
        let url = redProps.item.url.replace('https://www.zomato.com','')
        const res = await axios.get(`http://localhost:5001/getZomDets?url=${url}`);
        setMenu(res.data.data.page_data.order.menuList.menus[0].menu.categories[0].category.items)
        setLoader(false)
    },[redProps.item])
    return(
        <div style={{display:'flex', flexDirection:'column',paddingBottom:'100px'}}>
            {
                loader ? <img src={loading} style={{alignSelf:'center',display: 'block',marginLeft: 'auto', marginRight: 'auto',width: '90%'}}/> : (
                    menu.map((i,index)=>{
                        return(
                            <div className="itemCard">
                                <div className="itemDets">
                                <p>{i.item.name}</p>
                                <p style={{fontWeight:'bold'}}>₹{i.item.display_price}</p>
                                </div>
                                {
                                    (typeof i.item.groups !== "undefined")?
                                        <div>
                                            <div style={{width:'100%',height:'1px',backgroundColor:'#ccc'}}/>
                                            <p style={{fontWeight:'bold'}}>{i.item.groups[0].group.name}</p>
                                            {
                                                i.item.groups[0].group.items.map((variants,index)=>{
                                                                    return(
                                                                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                                            <p>{variants.item.name}</p>
                                                                            <p style={{fontWeight:'bold'}}>₹{variants.item.price}</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                        </div>
                                        :null
                                }
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}