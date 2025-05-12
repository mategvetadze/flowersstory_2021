import React from 'react'
import './FlowerCard.css'

const FlowerCard = ({ name, image, description }) => {
  return (
    <div className="flower-card">
      <img src={image} alt={name} className="flower-image" />
      <div className="flower-content">
        <h2 className="flower-name">{name}</h2>
        <p className="flower-description">{description}</p>
      </div>
    </div>
  )
}


export default FlowerCard