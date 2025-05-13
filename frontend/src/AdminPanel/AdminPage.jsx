import React, { useState } from 'react'
import "./AdminPage.css"
import toast from "react-hot-toast"

const AdminPage = () => {

    const [flower, setFlower] = useState({
        name: "Name",
        price: "0",
        img: "https://i5.walmartimages.com/asr/9cbb58cb-3ee0-4933-a727-821f33366a7e_1.c82fd30fc23cc09eb3700de9372fbc40.png",
        desc: "Small Description"
    })

    function handleErrors(){
        if(!flower.name){
            return toast.error("Name is required")
        }
        if(!flower.desc){
            return toast.error("Small Description is required")
        }
        if(!flower.price){
            return toast.error("Price is required")
        }
        if(!flower.img){
            return toast.error("Image is required")
        }

        return true
    }

    const validateForm = (e) => {
        e.preventDefault()
        const success = handleErrors()
        if(success === true){
            toast.success("Product Created Succesfully")
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFlower({
                    ...flower,
                    img: reader.result 
                });
            }
            reader.readAsDataURL(file); 
        }
    }

  return (
    <div className='fullCont'>
        <form className='container' onSubmit={validateForm}>
            <h1>Upload Flower</h1>
            <input
                type='text'
                placeholder='Name of the flower'
                onChange={(e) => setFlower({...flower, name:e.target.value})}
                defaultValue={""}   />

            <input 
                type='number' 
                placeholder='price ' 
                onChange={(e) => setFlower({...flower, price:e.target.value})}
                defaultValue={""} />

            <input
                type='text'
                placeholder='Small description of the flower' 
                onChange={(e) => setFlower({...flower, desc:e.target.value})} 
                defaultValue={""} />

            

            <label htmlFor="file-upload" className="custom-file-label">
                Choose File
            </label>
            <input
                id="file-upload" 
                type="file" 
                onChange={handleFileChange}
                defaultValue={""} />

            <input 
                type='text' 
                placeholder='url for online flower image' 
                onChange={(e) => setFlower({...flower, img:e.target.value})}
                defaultValue={""} />
            <button className='btn'>Create</button>
        </form>

        
            <div className='FlowerCard'>
            <img src={flower.img} alt='Image Placeholder' />
            <div className='flCont'>
                <label><span>{flower.name}</span></label>
                <label><span>{flower.price} ₾</span></label>
                <label><span>{flower.desc}</span></label>
            </div>
            
        </div>
    </div>
  )
}

export default AdminPage