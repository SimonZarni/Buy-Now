import React from 'react';
import { useSpring, animated } from 'react-spring';
import { FaRegHandshake, FaStore, FaUsers, FaHistory, FaBullseye, FaHandsHelping } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const sectionStyles = "py-16 px-6 text-center";
const headingStyles = "text-4xl font-bold mb-10";
const paragraphStyles = "text-lg mb-6";
const iconStyles = "text-6xl mb-4";
const gridContainerStyles = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
const imageStyles = "w-full h-64 object-cover rounded-lg mb-4";

const AboutUs = () => {
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1200 } });
  const slideUp = useSpring({ transform: 'translateY(0)', from: { transform: 'translateY(30px)' }, config: { duration: 1200 } });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="breadcrumbs text-sm mx-8 mt-4">
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li>About us</li>
        </ul>
      </div>
      <animated.div style={fadeIn} className={sectionStyles}>
        <h2 className="text-xl font-bold uppercase mx-5">About Us</h2>
        <div className={gridContainerStyles}>
          <animated.div style={slideUp} className="p-6 bg-white shadow-lg rounded-lg">
            <img src="images/img1.png" alt="Our Mission" className={imageStyles} />
            <FaStore className={iconStyles} />
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className={paragraphStyles}>
              At Buy Now, we strive to provide a seamless and enjoyable shopping experience. Our mission is to offer a wide variety of high-quality products at competitive prices while ensuring exceptional customer service.
            </p>
          </animated.div>
          <animated.div style={slideUp} className="p-6 bg-white shadow-lg rounded-lg">
            <img src="images/img3.png" alt="Our Team" className={imageStyles} />
            <FaUsers className={iconStyles} />
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className={paragraphStyles}>
              Our team is composed of dedicated professionals who are passionate about ecommerce and customer satisfaction. From our support staff to our developers, we work together to bring you the best shopping experience.
            </p>
          </animated.div>
          <animated.div style={slideUp} className="p-6 bg-white shadow-lg rounded-lg">
            <img src="images/img2.jpg" alt="Our Values" className={imageStyles} />
            <FaRegHandshake className={iconStyles} />
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <p className={paragraphStyles}>
              Integrity, innovation, and customer satisfaction are the core values that drive us. We believe in transparent practices and continuous improvement to meet and exceed our customers' expectations.
            </p>
          </animated.div>
        </div>

        <div className="py-16 px-6">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <animated.div style={slideUp} className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <FaHistory className={iconStyles} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Our History</h3>
            <p className={paragraphStyles}>
              Founded in [Year], Buy Now started as a small startup with a vision to revolutionize the ecommerce experience. Over the years, we have grown into a leading online retailer, thanks to our commitment to quality and customer satisfaction.
            </p>
          </animated.div>
        </div>

        <div className="py-16 px-6">
          <h2 className="text-3xl font-bold mb-8">Our Goals</h2>
          <animated.div style={slideUp} className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <FaBullseye className={iconStyles} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Our Goals</h3>
            <p className={paragraphStyles}>
              Our primary goal is to expand our product offerings and enhance our customer service to ensure that every shopping experience is exceptional. We aim to integrate cutting-edge technology and innovative solutions to stay ahead in the ecommerce industry.
            </p>
          </animated.div>
        </div>

        <div className="py-16 px-6">
          <h2 className="text-3xl font-bold mb-8">Community Involvement</h2>
          <animated.div style={slideUp} className="bg-white p-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <FaHandsHelping className={iconStyles} />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Community Involvement</h3>
            <p className={paragraphStyles}>
              We are committed to giving back to the community. Through various initiatives and partnerships, we support local organizations and contribute to causes that align with our values. Our goal is to make a positive impact and foster a sense of community.
            </p>
          </animated.div>
        </div>
      </animated.div>
      <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
      <div className="flex justify-center w-full">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Downloads</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat">
            <div className="stat-title">New Users</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-title">New Registers</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
