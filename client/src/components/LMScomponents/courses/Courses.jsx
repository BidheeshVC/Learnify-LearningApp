import React from 'react';
import { Star, Clock, Users, ChevronRight } from 'lucide-react';
import './Courses.css';
import Topbar from '../../topbar/Topbar';



const courses = [
    {
        name: "React for Beginners",
        title: "Learn the fundamentals of React.js from scratch",
        image: "https://source.unsplash.com/featured/?react,code",
        price: 0,
        category: "Web Development",
        rating: 4.8,
        duration: "4 weeks",
        students: 3200,
    },
    {
        name: "Mastering Node.js",
        title: "Build scalable backend apps with Node.js and Express",
        image: "https://source.unsplash.com/featured/?nodejs,backend",
        price: 59.99,
        category: "Backend Development",
        rating: 4.7,
        duration: "6 weeks",
        students: 4100,
    },
    {
        name: "UI/UX Design Bootcamp",
        title: "Design stunning user interfaces and seamless user experiences",
        image: "https://source.unsplash.com/featured/?design,uiux",
        price: 39.99,
        category: "Design",
        rating: 4.6,
        duration: "5 weeks",
        students: 2750,
    },
    {
        name: "Python for Data Science",
        title: "Analyze data and build ML models with Python",
        image: "https://source.unsplash.com/featured/?python,data",
        price: 0,
        category: "Data Science",
        rating: 4.9,
        duration: "8 weeks",
        students: 6800,
    },
    {
        name: "Full-Stack Web Dev",
        title: "Learn MERN stack and build full-stack applications",
        image: "https://source.unsplash.com/featured/?fullstack,developer",
        price: 79.99,
        category: "Web Development",
        rating: 4.8,
        duration: "10 weeks",
        students: 5300,
    },
    {
        name: "Intro to TypeScript",
        title: "Strongly-type your JavaScript with TypeScript",
        image: "https://source.unsplash.com/featured/?typescript,code",
        price: 19.99,
        category: "Web Development",
        rating: 4.5,
        duration: "3 weeks",
        students: 1500,
    },
    {
        name: "Advanced CSS Techniques",
        title: "Master Flexbox, Grid, animations, and responsive design",
        image: "https://source.unsplash.com/featured/?css,design",
        price: 24.99,
        category: "Design",
        rating: 4.7,
        duration: "4 weeks",
        students: 2800,
    },
    {
        name: "DevOps Fundamentals",
        title: "Learn CI/CD, Docker, Kubernetes, and cloud deployments",
        image: "https://source.unsplash.com/featured/?devops,docker",
        price: 69.99,
        category: "DevOps",
        rating: 4.6,
        duration: "7 weeks",
        students: 3400,
    },
    {
        name: "Mobile App Development with Flutter",
        title: "Build cross-platform apps with Flutter and Dart",
        image: "https://source.unsplash.com/featured/?flutter,mobile",
        price: 49.99,
        category: "Mobile Development",
        rating: 4.7,
        duration: "6 weeks",
        students: 2950,
    },
    {
        name: "Java Programming Mastery",
        title: "Complete guide to Java development from basics to advanced",
        image: "https://source.unsplash.com/featured/?java,programming",
        price: 29.99,
        category: "Programming",
        rating: 4.5,
        duration: "8 weeks",
        students: 3700,
    },
    {
        name: "Database Design & SQL",
        title: "Learn relational databases and master SQL queries",
        image: "https://source.unsplash.com/featured/?sql,database",
        price: 34.99,
        category: "Database",
        rating: 4.6,
        duration: "5 weeks",
        students: 3100,
    },
    {
        name: "Machine Learning with TensorFlow",
        title: "Train and deploy machine learning models using TensorFlow",
        image: "https://source.unsplash.com/featured/?tensorflow,ml",
        price: 89.99,
        category: "Data Science",
        rating: 4.9,
        duration: "9 weeks",
        students: 6200,
    },
    {
        name: "Cybersecurity Essentials",
        title: "Understand the fundamentals of digital security",
        image: "https://source.unsplash.com/featured/?cybersecurity,network",
        price: 44.99,
        category: "Security",
        rating: 4.4,
        duration: "6 weeks",
        students: 2000,
    },
    {
        name: "Intro to Cloud Computing",
        title: "Understand the basics of AWS, Azure, and Google Cloud",
        image: "https://source.unsplash.com/featured/?cloud,computing",
        price: 29.99,
        category: "Cloud",
        rating: 4.5,
        duration: "5 weeks",
        students: 2500,
    },
    {
        name: "Digital Marketing 101",
        title: "Learn SEO, content marketing, PPC, and more",
        image: "https://source.unsplash.com/featured/?marketing,digital",
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
