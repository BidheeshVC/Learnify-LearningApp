import React from 'react';
import Topbar from '../../components/topbar/Topbar';
import './Groups.css';

const groups = [
  {
    name: "World Football Fans",
    description: "Discuss leagues, match predictions, transfers, and highlights.",
    category: "Sports",
    members: 5800,
    image: "https://source.unsplash.com/featured/?football,soccer"
  },
  {
    name: "Movie Buffs United",
    description: "Talk about the latest releases, classics, and film theories.",
    category: "Entertainment",
    members: 4200,
    image: "https://source.unsplash.com/featured/?cinema,movies"
  },
  {
    name: "Travel Around the World",
    description: "Share travel experiences, tips, and dream destinations.",
    category: "Travel",
    members: 3400,
    image: "https://source.unsplash.com/featured/?travel,landscape"
  },
  {
    name: "Photography & Editing",
    description: "Tips on photography, gear, and post-processing techniques.",
    category: "Photography",
    members: 2800,
    image: "https://source.unsplash.com/featured/?photography,camera"
  },
  {
    name: "Foodies & Home Cooks",
    description: "Share recipes, food pics, and cooking tips.",
    category: "Food",
    members: 3900,
    image: "https://source.unsplash.com/featured/?food,recipe"
  },
  {
    name: "Fitness & Workout Motivation",
    description: "Post workouts, meal plans, and stay motivated.",
    category: "Health",
    members: 3100,
    image: "https://source.unsplash.com/featured/?fitness,workout"
  },
  {
    name: "Anime & Manga Central",
    description: "Discuss your favorite anime shows and manga series.",
    category: "Entertainment",
    members: 5000,
    image: "https://source.unsplash.com/featured/?anime,manga"
  },
  {
    name: "Music Lovers Society",
    description: "Share playlists, music news, and instrument tips.",
    category: "Music",
    members: 3200,
    image: "https://source.unsplash.com/featured/?music,instruments"
  },
  {
    name: "Gadget & Tech News",
    description: "Stay up-to-date with the latest in gadgets and tech.",
    category: "Technology",
    members: 2900,
    image: "https://source.unsplash.com/featured/?gadgets,technology"
  },
  {
    name: "Bookworms & Readers",
    description: "Book recommendations, reviews, and reading goals.",
    category: "Literature",
    members: 2600,
    image: "https://source.unsplash.com/featured/?books,reading"
  },
  {
    name: "Art & Illustration Zone",
    description: "Showcase and discuss traditional or digital artwork.",
    category: "Art",
    members: 1800,
    image: "https://source.unsplash.com/featured/?art,illustration"
  },
  {
    name: "Pet Lovers Community",
    description: "Post pet pics, care tips, and stories.",
    category: "Lifestyle",
    members: 2500,
    image: "https://source.unsplash.com/featured/?pets,dogs"
  },
  {
    name: "Fashion & Style Hub",
    description: "Discuss trends, DIY fashion, and outfit inspiration.",
    category: "Fashion",
    members: 2000,
    image: "https://source.unsplash.com/featured/?fashion,style"
  },
  {
    name: "Car Enthusiasts Garage",
    description: "Car mods, news, and supercar discussions.",
    category: "Automotive",
    members: 2700,
    image: "https://source.unsplash.com/featured/?cars,automobile"
  },
  {
    name: "Minimalist Living",
    description: "Declutter your life and embrace simplicity.",
    category: "Lifestyle",
    members: 1900,
    image: "https://source.unsplash.com/featured/?minimalist,lifestyle"
  },
  {
    name: "Skincare & Beauty Lounge",
    description: "Routines, products, and skin positivity.",
    category: "Beauty",
    members: 1600,
    image: "https://source.unsplash.com/featured/?skincare,beauty"
  },
  {
    name: "Board Games & Tabletop RPGs",
    description: "Play and discuss D&D, Catan, and more.",
    category: "Gaming",
    members: 1100,
    image: "https://source.unsplash.com/featured/?boardgame,dnd"
  },
  {
    name: "Mental Health Support",
    description: "Safe space to talk and support one another.",
    category: "Wellbeing",
    members: 2300,
    image: "https://source.unsplash.com/featured/?mentalhealth,support"
  },
  {
    name: "Crypto & Blockchain Chat",
    description: "Talk crypto trends, coins, and web3 projects.",
    category: "Finance",
    members: 3100,
    image: "https://source.unsplash.com/featured/?crypto,blockchain"
  },
  {
    name: "PC Builders & Gamers",
    description: "Builds, upgrades, and gaming setups.",
    category: "Gaming",
    members: 3500,
    image: "https://source.unsplash.com/featured/?pcbuild,gaming"
  }

  // ... add more groups here as needed
];

function Groups() {
  return (
    <>
      <Topbar />
      {/* <div className="card-wrapper">
        {groups.map((group, index) => (
          <div className="card" key={index}>
            <div className="card-image-container">
              <img
                src={group.image}
                alt={group.name}
                className="card-image"
              />
            </div>

            <div className="card-content">
              <div className="card-header">
                <span className="category">{group.category}</span>
              </div>

              <h2 className="card-title">{group.name}</h2>
              <p className="card-description">{group.description}</p>

              <div className="card-meta">
                <div className="meta-item">
                  <span>👥 {group.members.toLocaleString()} members</span>
                </div>
              </div>

              <button className="card-button">Join Group</button>
            </div>
          </div>
        ))}
      </div> */}
      <div className="card-wrapper">
        {groups.map((group, index) => (
          <div className="card" key={index}>
            <div className="card-image-container">
              <img
                src={group.image}
                alt={group.name}
                className="card-image"
              />
            </div>

            <div className="card-content">
              <span className="category">{group.category}</span>
              <h2 className="card-title">{group.name}</h2>
              <p className="card-description">{group.description}</p>

              <div className="card-meta">
                👥 {group.members.toLocaleString()} members
              </div>

              <button className="card-button">Join Group</button>
            </div>
          </div>
        ))}
      </div>

    </>
  );
}

export default Groups;
