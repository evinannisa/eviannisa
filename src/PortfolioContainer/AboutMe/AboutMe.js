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
      description: `Hello, my name is Evi Nur Annisa. I'm Frontend Developer based in Yogyakarta with 2 years of experience. Currently, I'm focused on developing my portfolio as Frontend Developer and enhance my skills as a UI/UX Designer. I am also continuously seeking new projects and challenges to further my growth and expertise, striving to be a better Evi each day.<br><br>Take your time, check my resume, and see my skills. Thank you..`,
      highlights: {
         bullets: [
            "Frontend Developer",
            "Design UI/UX",
            "React JS, Typescript",
            "HTML CSS JavaScript",
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
