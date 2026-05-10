import React, { useState } from 'react'; 
import "./about.css";
import { teamMembers } from '../data/TeamInfo.js';
import MemberCard from "../components/MemberCard.jsx";

export default function AboutPage() {
  // * a fix to have a seamless carousel between both groups *
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (name) => {
    setFlippedCards((prev) => ({
      ...prev,
      [name] : !prev[name]
    }));
  };

  return (
    <div className = 'about-contents'> 
      {/* do we want an animation of the title?? */}
      <h1 className = 'about-header'>A<span className = 'lowercaseTitle'>bout</span> F<span className = 'lowercaseTitle'>ore</span>MT F<span className = 'lowercaseTitle'>ashion</span></h1>
      {/* *** about ForeMT Fashion description section *** */}
      <div className = 'about-description-section'>
        <p>ForeMT Fashion is an educational, AI-assisted platform designed to facilitate the rigorous and systematic study of fashion forecasting among
          students and emerging designers.<br /><br />
           The platform integrates a suite of analytical tools that support the examination of historical and contemporary fashion data, critical analysis
           of runway collections, evaluation of chromatic trends, and the development of prospective forecasts for forthcoming seasons. Through features 
           such as trend analysis modules, color palette exploration, runway critique, and AI-assisted research capabilities, ForeMT Fashion enables the 
           synthesis of creative exploration with data-driven methodologies.<br /><br />
           Developed by the ForeMT research and development team in collaboration with faculty at Middle Tennessee State University, the platform aims to
           operationalize theoretical constructs within fashion studies by translating them into applied forecasting practices. It advances methodological
           rigor while enhancing the accessibility, efficiency, and analytical depth of fashion research and pedagogy.
        </p>
      </div>

      {/* *** team animation section *** */}
      {/* <h2>Meet the team!</h2>  */}
      {/* ** team carousel ** */}
      <div className = 'team-carousel'>
        <div className = 'team-carousel-header'>Meet the Team!</div>
        <div className = 'team-carousel-content'>
          {/* * 1st group for continuous scrolling * */}
          <div className = 'team-carousel-group'>
            {teamMembers.map((member, index) => (
              <div key = {`team-a-${index}`} className = 'carousel-card-container'>
                <MemberCard member = {member}
                flipped = { !!flippedCards[member.name] }
                onToggle = {() => toggleFlip(member.name)}
                />
              </div>
            ))}
          </div>

          {/* * duplicate group for infinite scrolling * */}
          <div className = 'team-carousel-group'>
            {teamMembers.map((member, index) => (
              <div key = {`team-b-${index}`} className = 'carousel-card-container'>
                <MemberCard member = {member}
                flipped = { !!flippedCards[member.name] }
                onToggle = {() => toggleFlip(member.name)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}