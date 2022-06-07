import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function SortTable() {

    const [crypto, setCrypto] = useState([]);

    //fetch api
    const getCryptoDetails = async () => {
        await axios.get("https://api.coinstats.app/public/v1/coins?skip=0&limit=30")
            .then(response => {
                setCrypto(response.data.coins);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getCryptoDetails();
    }, []);

    //getting saved fav items
    const getLocalItems = () => {
        let localFavouriteList = localStorage.getItem('favourites');

        if (localFavouriteList) {
            return JSON.parse(localStorage.getItem('favourites'));
        } else {
            return [];
        }
    }

    const getLocalItemsTemp = () => {
        let localFavouriteListTemp = localStorage.getItem('favouritesTemp');

        if (localFavouriteListTemp) {
            return JSON.parse(localStorage.getItem('favouritesTemp'));
        } else {
            return [];
        }
    }


    const [order, setOrder] = useState("asc");
    const sorting = (col) => {
        if (order === "asc") {
            const sorted = [...crypto].sort((a, b) => a[col] > b[col] ? 1 : -1);
            setCrypto(sorted);
            setOrder("dsc");
        } else {
            const sorted = [...crypto].sort((a, b) => a[col] < b[col] ? 1 : -1);
            setCrypto(sorted);
            setOrder("asc");
        }
    }

    const [favouriteList, setFavouriteList] = useState(getLocalItems());
    const [favourite, setFavourite] = useState(getLocalItemsTemp);
    const addToFavouriteList = (id) => {
        if (favourite.length < 3 && !favourite.includes(id)) {
            favourite.push(id);

            const favList = favourite.map((item) => {
                return crypto.filter((cId) => cId.id === item)[0]
            })

            setFavouriteList(favList);

            //Updating the temp favlist
            const tempFavList = favourite.map((item) => {
                return item;
            })
            setFavourite(tempFavList);
        }
    }

    const removeFavourite = (id) => {
        //Removing the items from main array
        favouriteList.filter((items, idx) => {
            if (items.id === id) {
                favouriteList.splice(idx, 1);
            }
        })

        //Removing the items from temp array
        favourite.filter((items, j) => {
            if (items === id) {
                favourite.splice(j, 1);
            }
        })

        //updating main favlist
        const removedFavList = favouriteList.map((item) => {
            return item;
        })
        setFavouriteList(removedFavList);

        //updating temp favlist
        const removedTempFavList = favouriteList.map((item) => {
            return item.id;
        })
        setFavourite(removedTempFavList);
    }

    //Save to localStorage
    useEffect(() => {
        localStorage.setItem('favourites', JSON.stringify(favouriteList));
    }, [favouriteList])

    useEffect(() => {
        localStorage.setItem('favouritesTemp', JSON.stringify(favourite));
    }, [favourite])


    return (
        <div className='containerr'>
            <div className='innerWrapper'>

            </div>
            <div className='contentWrapper'>
                <div className='parentfavWrapper'>
                    <p className='heading'>Click on currency name to add to Favourite</p>
                    <div className='favouriteWrapper'>
                        {favouriteList.map((cID) => {
                            return (
                                <div key={cID.id} className='favCrypto'>
                                    <div className='wrapper favWrapper'>
                                        <div className='nameImgContainer'>
                                            <img src={cID.icon}></img>
                                            <div className='nameContainer'>
                                                <p className='name'>{cID.name}</p>
                                                <p className='symbol'>{cID.symbol}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='priceChangeWrapper'>
                                        <div className='price'>
                                            <p className='label'>Price</p>
                                            <p className='text'>${cID.price.toFixed(2)}</p>
                                        </div>
                                        <div className='change'>
                                            <p className='label'>Change(1Hr)</p>
                                            {
                                                cID.priceChange1h < 0 ?
                                                    (<p className='text red'>{cID.priceChange1h}</p>) :
                                                    <p className='text green'>{cID.priceChange1h}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className='removeFavourite' onClick={() => removeFavourite(cID.id)}>
                                        <p>Remove</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <table className='table border custom-table-width'>
                    <thead>
                        <tr className='header'>
                            <th className='left custom-hide' onClick={() => sorting("rank")}>Rank</th>
                            <th className='left' onClick={() => sorting("name")}>Name</th>
                            <th className='right' onClick={() => sorting("price")}>Price</th>
                            <th className='right custom-hide' onClick={() => sorting("marketCap")}>Market Cap</th>
                            <th className='right custom-hide' onClick={() => sorting("volume")}>Volume</th>
                            <th className='right custom-hide' onClick={() => sorting("totalSupply")}>Supply</th>
                            <th className='right' onClick={() => sorting("priceChange1h")}>Change(1Hr)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crypto.map((d) => {
                            return (
                                <tr className='brow' key={d.id}>
                                    <td className='center custom-hide'>{d.rank}</td>
                                    <td>
                                        <div className='wrapper'>
                                            <div className='nameImgContainer'>
                                                <img src={d.icon}></img>
                                                <div className='nameContainer'>
                                                    <p title='Add to favourite' onClick={() => addToFavouriteList(d.id)} className='name'>{d.name}</p>
                                                    <p className='symbol'>{d.symbol}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='right'>${d.price.toFixed(2)}</td>

                                    <td className='right custom-hide'>
                                        ${Number(d.marketCap) >= 1.0e9 ? (Number(d.marketCap) / 1.0e9).toFixed(2) + "b" :
                                            Number(d.marketCap) >= 1.0e6 ? (Number(d.marketCap) / 1.0e6).toFixed(2) + "m" :
                                                Number(d.marketCap) >= 1.0e3 ? (Number(d.marketCap) / 1.0e3).toFixed(2) + "k" :
                                                    Number(d.marketCap).toFixed(2)}</td>

                                    <td className='right custom-hide'>
                                        ${Number(d.volume) >= 1.0e9 ? (Number(d.volume) / 1.0e9).toFixed(2) + "b" :
                                            Number(d.volume) >= 1.0e6 ? (Number(d.volume) / 1.0e6).toFixed(2) + "m" :
                                                Number(d.volume) >= 1.0e3 ? (Number(d.volume) / 1.0e3).toFixed(2) + "k" :
                                                    Number(d.volume).toFixed(2)}
                                    </td>

                                    <td className='right custom-hide'>
                                        ${Number(d.totalSupply) >= 1.0e9 ? (Number(d.totalSupply) / 1.0e9).toFixed(2) + "b" :
                                            Number(d.totalSupply) >= 1.0e6 ? (Number(d.totalSupply) / 1.0e6).toFixed(2) + "m" :
                                                Number(d.totalSupply) >= 1.0e3 ? (Number(d.totalSupply) / 1.0e3).toFixed(2) + "k" :
                                                    Number(d.totalSupply).toFixed(2)}
                                    </td>
                                    {
                                        d.priceChange1h < 0 ?
                                            (<td className='right red'>{d.priceChange1h}</td>) :
                                            (<td className='right green'>{d.priceChange1h}</td>)
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
