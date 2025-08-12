import React from 'react';
import Topbar from '../../components/topbar/Topbar';
import './Groups.css';

const groups = [
  {
    name: "World Football Fans",
    description: "Discuss leagues, match predictions, transfers, and highlights.",
    category: "Sports",
    members: 5800,
    image: "https://i.pinimg.com/736x/aa/ed/a4/aaeda4c12d45559ac1b201b08cdcaa6c.jpg"
  },
  {
    name: "Movie Buffs United",
    description: "Talk about the latest releases, classics, and film theories.",
    category: "Entertainment",
    members: 4200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSriBj9iubpz2SFkoiVsmE4Tqzid7b3zoEpBA&s"
  },
  {
    name: "Travel Around the World",
    description: "Share travel experiences, tips, and dream destinations.",
    category: "Travel",
    members: 3400,
    image: "https://static.vecteezy.com/system/resources/previews/004/929/357/non_2x/travel-around-the-world-tourism-design-travel-the-world-text-famous-tourism-landmarks-and-world-attractions-elements-for-holiday-vacation-trip-illustration-vector.jpg"
  },
  {
    name: "Photography & Editing",
    description: "Tips on photography, gear, and post-processing techniques.",
    category: "Photography",
    members: 2800,
    image: "https://www.techdee.com/wp-content/uploads/2020/06/How-to-Edit-Photos-for-Beginners.jpg"
  },
  {
    name: "Foodies & Home Cooks",
    description: "Share recipes, food pics, and cooking tips.",
    category: "Food",
    members: 3900,
    image: "https://www.thespruceeats.com/thmb/sLkcu8KzpoUr1u1sqXOLGjDPTx0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/309291-001-56a510423df78cf772862aea.jpg"
  },
  {
    name: "Fitness & Workout Motivation",
    description: "Post workouts, meal plans, and stay motivated.",
    category: "Health",
    members: 3100,
    image: "https://e0.pxfuel.com/wallpapers/63/653/desktop-wallpaper-fitness-background-gym-black.jpg"
  },
  {
    name: "Anime & Manga Central",
    description: "Discuss your favorite anime shows and manga series.",
    category: "Entertainment",
    members: 5000,
    image: "https://japancraft.co.uk/wordpress/wp-content/uploads/2017/03/Difference-between-anime-and-manga.jpg"
  },
  {
    name: "Music Lovers Society",
    description: "Share playlists, music news, and instrument tips.",
    category: "Music",
    members: 3200,
    image: "https://i.ytimg.com/vi/5SRmLKZdyto/maxresdefault.jpg"
  },
  {
    name: "Gadget & Tech News",
    description: "Stay up-to-date with the latest in gadgets and tech.",
    category: "Technology",
    members: 2900,
    image: "https://theunitedindian.com/images/gadgets-20-05-24-E-Hero.webp"
  },
  {
    name: "Bookworms & Readers",
    description: "Book recommendations, reviews, and reading goals.",
    category: "Literature",
    members: 2600,
    image: "https://youthincmag.com/wp-content/uploads/2018/06/bookworm-min-1280x720.jpg"
  },
  {
    name: "Art & Illustration Zone",
    description: "Showcase and discuss traditional or digital artwork.",
    category: "Art",
    members: 1800,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8a17bDSzm7_74OvN-C6fditaYM9XNlO4hOA&s"
  },
  {
    name: "Pet Lovers Community",
    description: "Post pet pics, care tips, and stories.",
    category: "Lifestyle",
    members: 2500,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_LIF6Wc5dr5pNrcggxh0CY5dS_UtXSOvd6g&s"
  },
  {
    name: "Fashion & Style Hub",
    description: "Discuss trends, DIY fashion, and outfit inspiration.",
    category: "Fashion",
    members: 2000,
    image: "https://stylecaster.com/wp-content/uploads/2020/08/fashion-trends-by-decade.jpg"
  },
  {
    name: "Car Enthusiasts Garage",
    description: "Car mods, news, and supercar discussions.",
    category: "Automotive",
    members: 2700,
    image: "https://www.secretentourage.com/wp-content/uploads/2011/01/10/45-lv%20eric/18-2_001.jpg"
  },
  {
    name: "Minimalist Living",
    description: "Declutter your life and embrace simplicity.",
    category: "Lifestyle",
    members: 1900,
    image: "https://media.designcafe.com/wp-content/uploads/2024/01/26123710/minimalistic-living-room-ideas.jpg"
  },
  {
    name: "Skincare & Beauty Lounge",
    description: "Routines, products, and skin positivity.",
    category: "Beauty",
    members: 1600,
    image: "https://images.squarespace-cdn.com/content/v1/629faa468cbdb56e047eaa31/dbcd040f-9856-40c2-b1a4-247bb5d7943f/Screenshot+2025-07-08+at+3.42.20%E2%80%AFPM.png?format=2500w"
  },
  {
    name: "Board Games & Tabletop RPGs",
    description: "Play and discuss D&D, Catan, and more.",
    category: "Gaming",
    members: 1100,
    image: "https://steamforged.com/cdn/shop/files/AASS-Photo03.jpg?v=1704302085&width=3000"
  },
  {
    name: "Mental Health Support",
    description: "Safe space to talk and support one another.",
    category: "Wellbeing",
    members: 2300,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1G265P3Op00e-1uCdM48R8Pxuu3KBJjCuQ&s"
  },
  {
    name: "Crypto & Blockchain Chat",
    description: "Talk crypto trends, coins, and web3 projects.",
    category: "Finance",
    members: 3100,
    image: "https://exchange.blockchain.com/static/img/mercury/landing/ex-landing_dashboard-img.png"
  },
  {
    name: "PC Builders & Gamers",
    description: "Builds, upgrades, and gaming setups.",
    category: "Gaming",
    members: 3500,
    image: "https://in.aorus.com/upload/Product/F_202303281146788WF11152.JPG"
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
