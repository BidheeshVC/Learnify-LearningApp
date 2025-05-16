import React from 'react';
import { Star, Clock, Users, ChevronRight } from 'lucide-react';
import './Cards.css';

const Cards = () => {
  const item = {
    name: "React for Beginners",
    title: "Learn the fundamentals of React.js from scratch",
    image: "https://source.unsplash.com/featured/?react,code",
    price: 0,
    category: "Web Development",
    rating: 4.8,
    duration: "4 weeks",
    students: 3200,
  };

  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="card-image-container">
          <img
            src={item.image}
            alt={item.name}
            className="card-image"
          />
          {item.price === 0 ? (
            <div className="price-tag free">Free</div>
          ) : (
            <div className="price-tag paid">${item.price}</div>
          )}
        </div>

        <div className="card-content">
          <div className="card-header">
            <span className="category">{item.category}</span>
            <div className="rating">
              <Star className="icon star" />
              <span>{item.rating || "4.5"}</span>
            </div>
          </div>

          <h2 className="card-title">{item.name}</h2>
          <p className="card-description">{item.title}</p>

          <div className="card-meta">
            <div className="meta-item">
              <Clock className="icon" />
              <span>{item.duration || "6 weeks"}</span>
            </div>
            <div className="meta-item">
              <Users className="icon" />
              <span>{item.students || "1,234"} students</span>
            </div>
          </div>

          <button className="card-button">
            {item.price === 0 ? "Enroll Now" : "Buy Now"}
            <ChevronRight className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
