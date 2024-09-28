import React from "react";
import ScreenHeading from "../../utilities/ScreenHeading/ScreenHeading";
import Animations from "../../utilities/Animations";
import ScrollService from "../../utilities/ScrollService";
import "./AboutMe.css";

export default function AboutMe(props) {
   let fadeInScreenHandler = (screen) => {
      if (screen.fadeInScreen !== props.id) return;
      Animations.animations.fadeInScreen(props.id);
   };

   const fadeInSubscription =
      ScrollService.currentScreenFadeIn.subscribe(fadeInScreenHandler);

   const SCREEN_CONSTANTS = {
      description: `
      Hello, my name is Evi Nur Annisa. I am a dedicated and creative Frontend Developer with a strong focus on designing and developing responsive web applications. With expertise in HTML, CSS, JavaScript and frameworks like React and Next, I strive to build user-centered interfaces that deliver great user experiences. My approach blends innovation and attention to detail, resulting in visually appealing and well-performing solutions. I enjoy working in close collaboration and am always interested in exploring and applying the latest technologies to improve web development. Also, I am still growing and striving to be a better Evi each day. Take your time, check my resume and see my skills. Thank you.
      `,
      highlights: {
         bullets: [
            "Frontend Developer",
            "Design UI/UX",
            "React JS, Micro Frontend",
            "HTML CSS JavaScript/Typescript",
         ],
         heading: "Here are a few Highlights",
      },
   };

   const renderHighlight = () => {
      return SCREEN_CONSTANTS.highlights.bullets.map((value, i) => (
         <div className="highlight" key={i}>
            <div className="highlight-blob"></div>
            <span>{value}</span>
         </div>
      ));
   };

   return (
      <div
         className="about-me-container screen-container fade-in"
         id={props.id || ""}
      >
         <div className="about-me-parent">
            <ScreenHeading title={"About Me"} subHeading={"My Intro"} />
            <div className="about-me-card">
               {/* <div className="about-me-profile"></div> */}
               <div className="about-me-details">
                  <span
                     className="about-me-description"
                     dangerouslySetInnerHTML={{
                        __html: SCREEN_CONSTANTS.description,
                     }}
                  />
                  {/* {SCREEN_CONSTANTS.description}
                  </span> */}
                  <div className="about-me-highlights">
                     <div className="highlight-heading">
                        <span>{SCREEN_CONSTANTS.highlights.heading}</span>
                     </div>
                     {renderHighlight()}
                  </div>
                  {/* <div className="about-me-options">
                     <button
                        className="btn primary-btn"
                        onClick={() =>
                           ScrollService.scrollHandler.scrollToHireMe()
                        }
                     >
                        Hire Me
                     </button>
                     <a href="" download="">
                        <button className="btn highlighted-btn">
                           Get Resume
                        </button>
                     </a>
                  </div> */}
               </div>
            </div>
         </div>
      </div>
   );
}
