import React from 'react'
import { MdOutlineArrowOutward } from 'react-icons/md'
import './Home.css'
import image1 from '../pics/pngtree-flower-bucket-for-decoration-png-image_9034845.png'
import FlowerCard from '../Dangs/FlowerCard'
import imame2 from '../pics/image.png'
import imame3 from '../pics/image1.png'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='textsCont'>
        <h1 className='h1h'><span className='sp1'>Oder </span> <span className='sp2'>Flower Very Fast</span></h1>
        <p className='p1'>
            <span>Send magnificient flowers to your loved ones in a for all ocasions.</span>
            <br />
            <span> We have a wide variety of flowers to choose from.</span>
        </p>

        <div className='btncontainer'>
          <Link to="/products" className='bsb'>
        <button className='b1 b2'>
            <span>View Products</span>
            <MdOutlineArrowOutward />
        </button>
        </Link>
        </div>
        </div>
        <div className='d1 dd'></div>
        <div className='d2 dd'></div>
        <div className='d3 dd'></div>
        <div className='imgcontainer'>
            <img src={image1} alt="Flower" className='img1' />
        </div>

        <div className='card-wrapper'>
      <FlowerCard
        id="flower001"
        name="Ragaca yvavili"
        image={imame2}
        description="Classic red roses perfect for any romantic occasion."
      />
      <FlowerCard
        id="flower002"
        name="Rose Bouquet"
        image={imame3}
        description="Bright and cheerful sunflowers to light up your day."
      />
        </div>
    </div>
  )
}

export default Home