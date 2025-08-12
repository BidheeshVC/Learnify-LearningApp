import React from 'react';
import { Star, Clock, Users, ChevronRight } from 'lucide-react';
import './Courses.css';
import Topbar from '../../topbar/Topbar';



const courses = [
    {
        name: "React for Beginners",
        title: "Learn the fundamentals of React.js from scratch",
        image: "https://ixorasolution.com/wp-content/uploads/React.js-for-beginners.jpg",
        price: 0,
        category: "Web Development",
        rating: 4.8,
        duration: "4 weeks",
        students: 3200,
    },
    {
        name: "Mastering Node.js",
        title: "Build scalable backend apps with Node.js and Express",
        image: "https://miro.medium.com/v2/resize:fit:1400/1*rC5I3G2F8PJcspg1nxdVTQ.png",
        price: 59.99,
        category: "Backend Development",
        rating: 4.7,
        duration: "6 weeks",
        students: 4100,
    },
    {
        name: "UI/UX Design Bootcamp",
        title: "Design stunning user interfaces and seamless user experiences",
        image: "https://sprintscdn-fnh2cugtb8a4deba.z02.azurefd.net/production/store/90058138/1737390237678e789d8b715.png",
        price: 39.99,
        category: "Design",
        rating: 4.6,
        duration: "5 weeks",
        students: 2750,
    },
    {
        name: "Python for Data Science",
        title: "Analyze data and build ML models with Python",
        image: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230318230239/Python-Data-Science-Tutorial.jpg",
        price: 0,
        category: "Data Science",
        rating: 4.9,
        duration: "8 weeks",
        students: 6800,
    },
    {
        name: "Full-Stack Web Dev",
        title: "Learn MERN stack and build full-stack applications",
        image: "https://www.mergesociety.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdhgjhspsp%2Fimage%2Fupload%2Fv1747557411%2Ffullstack_sioshn.png&w=1200&q=75",
        price: 79.99,
        category: "Web Development",
        rating: 4.8,
        duration: "10 weeks",
        students: 5300,
    },
    {
        name: "Intro to TypeScript",
        title: "Strongly-type your JavaScript with TypeScript",
        image: "https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ffau508bzl2884y83afj1.png",
        price: 19.99,
        category: "Web Development",
        rating: 4.5,
        duration: "3 weeks",
        students: 1500,
    },
    {
        name: "Advanced CSS Techniques",
        title: "Master Flexbox, Grid, animations, and responsive design",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/v1718110916/LearningPaths/oexupgyyuusnkigeifms.jpg",
        price: 24.99,
        category: "Design",
        rating: 4.7,
        duration: "4 weeks",
        students: 2800,
    },
    {
        name: "DevOps Fundamentals",
        title: "Learn CI/CD, Docker, Kubernetes, and cloud deployments",
        image: "https://media.geeksforgeeks.org/wp-content/uploads/20230410112114/DevOps.png",
        price: 69.99,
        category: "DevOps",
        rating: 4.6,
        duration: "7 weeks",
        students: 3400,
    },
    {
        name: "Mobile App Development with Flutter",
        title: "Build cross-platform apps with Flutter and Dart",
        image: "https://2softsoftware.com/wp-content/uploads/2025/04/flutter-Development-2Soft-Software.webp",
        price: 49.99,
        category: "Mobile Development",
        rating: 4.7,
        duration: "6 weeks",
        students: 2950,
    },
    {
        name: "Java Programming Mastery",
        title: "Complete guide to Java development from basics to advanced",
        image: "https://www.dicslaxminagar.com/blog/wp-content/uploads/2024/10/sale-301982-article-image-1630523474787.jpeg",
        price: 29.99,
        category: "Programming",
        rating: 4.5,
        duration: "8 weeks",
        students: 3700,
    },
    {
        name: "Database Design & SQL",
        title: "Learn relational databases and master SQL queries",
        image: "https://media.geeksforgeeks.org/wp-content/uploads/20240527162229/Database-Design-.webp",
        price: 34.99,
        category: "Database",
        rating: 4.6,
        duration: "5 weeks",
        students: 3100,
    },
    {
        name: "Machine Learning with TensorFlow",
        title: "Train and deploy machine learning models using TensorFlow",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAlCQdXFBzSlWjkIuW7DaIMZFhBf3vcOgk9A&s",
        price: 89.99,
        category: "Data Science",
        rating: 4.9,
        duration: "9 weeks",
        students: 6200,
    },
    {
        name: "Cybersecurity Essentials",
        title: "Understand the fundamentals of digital security",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoZqHUhXsp6dq1Dhj5CfuScq8dohDEZgDWHQ&s",
        price: 44.99,
        category: "Security",
        rating: 4.4,
        duration: "6 weeks",
        students: 2000,
    },
    {
        name: "Intro to Cloud Computing",
        title: "Understand the basics of AWS, Azure, and Google Cloud",
        image: "https://media.licdn.com/dms/image/v2/D4D12AQE-taKuq6JCew/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1691564771764?e=2147483647&v=beta&t=VeTrK2IkAX6kO0B-5C1NKdV_V7-oykMgeos8j_3EsVs",
        price: 29.99,
        category: "Cloud",
        rating: 4.5,
        duration: "5 weeks",
        students: 2500,
    },
    {
        name: "Digital Marketing 101",
        title: "Learn SEO, content marketing, PPC, and more",
        image: "https://www.atomicmkt.com/wp-content/uploads/2020/01/digital.jpg",
        price: 0,
        category: "Marketing",
        rating: 4.3,
        duration: "4 weeks",
        students: 1800,
    }
];


export default function Courses() {
    return (
        <>
            <Topbar />
            <div className="card-wrapper">
                {courses.map((item, index) => (
                    <div className="card" key={index}>
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
                                    <span>{item.rating}</span>
                                </div>
                            </div>

                            <h2 className="card-title">{item.name}</h2>
                            <p className="card-description">{item.title}</p>

                            <div className="card-meta">
                                <div className="meta-item">
                                    <Clock className="icon" />
                                    <span>{item.duration}</span>
                                </div>
                                <div className="meta-item">
                                    <Users className="icon" />
                                    <span>{item.students.toLocaleString()} students</span>
                                </div>
                            </div>

                            <button className="card-button">
                                {item.price === 0 ? "Enroll Now" : "Buy Now"}
                                <ChevronRight className="icon" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
