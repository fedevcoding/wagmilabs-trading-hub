import React, { useState, useEffect, useMemo, useRef} from 'react'
import {useDebounce} from "use-debounce"
import "./search.css"
import verified from "../../assets/verified.png"
import question from "../../assets/question.png"
import baseUrl from "../../variables/baseUrl"

import useFirstRender from "../../custom-hooks/useFirstRender"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const EthereumSearch = () => {

    const firstRender = useFirstRender()

    const [text, setText] = useState("")
    const [value] = useDebounce(text, 500)
    const [loadingCollections, setLoadingCollections] = useState(false)
    const [collections, setCollections] = useState([])

    useEffect(()=>{

        function removeCollections(e){
            if(collections.length > 0){
                
                const collectionsContainer = document.querySelector(".container")
                const searchbar = document.querySelector(".search-bar")

                const path = e.composedPath()
                if(path.includes(collectionsContainer) || path.includes(searchbar)) return
                
                setCollections([])
            }
        }

        window.addEventListener("click", removeCollections)


        return () => {
            window.removeEventListener("click", removeCollections)
        }
    }, [collections])

    useEffect(()=>{
        if(value === "" && !firstRender){
            loadCollections(false)
        }
        else if(value.startsWith("0x") && value.length === 42){
            fetchCollections("contract")
        }
        else if(value){
            fetchCollections("name")
        }
    }, [value])
    
    async function fetchCollections(type){

        setLoadingCollections(true)

        let collections = await fetch(`${baseUrl}/searchCollection/${value}/${type}`, {
            headers: {
                "x-auth-token": localStorage.jsonwebtoken
            }
        })
        collections = (await collections.json()).collections


        setLoadingCollections(false)
        setCollections(collections)
    }


    const memoList = useMemo(()=> collections.map((collection, index) => {

        const {image, collectionId, name, openseaVerificationStatus} = collection
        const link = `/collection/${collectionId}`

        return (
            <a className='container-div' href={link} target="_blank" key={index} onClick={() => addToLocalStorage(image, collectionId, name, openseaVerificationStatus)}>
                <img className='collection-image' src={image || question}/>
                <div className="searchbar-collection-infos">
                    <div className='name-verified-container'>
                        <p className='searchbar-collection-name'>{name || "-------"}</p>
                        {openseaVerificationStatus === "verified" && <img className='verified' src={verified}/>}
                    </div>
                    <p className='searchbar-collection-address'>{collectionId}</p>
                </div>
            </a>
        )
    
    }), [collections])
    

    // function removeFromLocalStorage(image, collectionId, name, openseaVerificationStatus){

    // }

    function addToLocalStorage(image, collectionId, name, openseaVerificationStatus){
        let clickedCollections = localStorage.getItem("clickedCollections") || false
        let collectionObject;

        const time = new Date().getTime()
        
        if(clickedCollections){
            clickedCollections = JSON.parse(clickedCollections)
            clickedCollections = clickedCollections.filter(collection => collection.collectionId !== collectionId)
            collectionObject = JSON.stringify([...clickedCollections, {image, collectionId, name, openseaVerificationStatus, time}])
        }
        else{
            collectionObject = JSON.stringify([{image, collectionId, name, openseaVerificationStatus, time}])
        }

        localStorage.setItem("clickedCollections", collectionObject) 
    }
    function loadCollections(check){
        if(collections.length === 0 && text.length === 0 || !check){
            let collections = localStorage.clickedCollections || false

            if(collections){
                collections = JSON.parse(collections)

                collections.sort((a, b) => b.time - a.time)
                setCollections(collections)
            }
            else{
                setCollections([])
            }
        }
    }

    return (
    <>
    <div className='input-lens-container'>

        <i className="fa-solid fa-magnifying-glass lens"></i>
        <input type="text" className='search-bar' placeholder='Search collections' onChange={({target}) => setText(target.value)} onClick={() => loadCollections(true)}></input>


        {   
        loadingCollections ?

            <div className="container">
                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <div className="search-skeleton-row">
                        <Skeleton circle={true} width={30} height={30} count={5}/>
                        <Skeleton height={30} count={5}/>
                    </div>
                </SkeletonTheme>
            </div>

            :
            collections.length > 0 &&
            <div className="container">
                {memoList}
            </div>
        }


    </div>
    </>
  )
}



export default EthereumSearch