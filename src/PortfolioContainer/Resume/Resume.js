import React, { useState } from "react";
import ScreenHeading from "../../utilities/ScreenHeading/ScreenHeading";
import Animations from "../../utilities/Animations";
import ScrollService from "../../utilities/ScrollService";
import "./Resume.css";

export default function Resume(props) {
   const [selectedBulletIndex, setSelectedBulletIndex] = useState(0);
   const [carousalOffSetStyle, setCarousalOffSetStyle] = useState({});

   let fadeInScreenHandler = (screen) => {
      if (screen.fadeInScreen !== props.id) return;
      Animations.animations.fadeInScreen(props.id);
   };

   const fadeInSubscription =
      ScrollService.currentScreenFadeIn.subscribe(fadeInScreenHandler);

   const ResumeHeading = (props) => {
      return (
         <div className="resume-heading">
            <div className="resume-main-heading">
               <div className="heading-bullet"></div>
               <span>{props.heading ? props.heading : ""}</span>
               {props.fromDate && props.toDate ? (
                  <div className="heading-date">
                     {props.fromDate + " - " + props.toDate}
                  </div>
               ) : (
                  <div></div>
               )}
            </div>
            <div className="resume-sub-heading">
               <span>{props.subHeading ? props.subHeading : ""}</span>
            </div>
            <div className="resume-heading-description">
               <span>{props.description ? props.description : ""}</span>
            </div>
         </div>
      );
   };

   const resumeBullets = [
      { label: "Education", logoSrc: "education.svg" },
      { label: "Work History", logoSrc: "work-history.svg" },
      { label: "Programming Skills", logoSrc: "programming-skills.svg" },
      { label: "Projects", logoSrc: "projects.svg" },
      { label: "Interests", logoSrc: "interests.svg" },
   ];

   const programmingSklisDetails = [
      { skill: "React JS", ratingPercentage: 80 },
      { skill: "HTML, CSS", ratingPercentage: 85 },
      // { skill: "CSS", ratingPercentage: 80 },
      { skill: "JavaScript", ratingPercentage: 70 },
      { skill: "TypeScript", ratingPercentage: 55 },
      { skill: "Tailwind", ratingPercentage: 85 },
      { skill: "Material UI", ratingPercentage: 75 },
      { skill: "Styled Component", ratingPercentage: 75 },
      { skill: "Next JS", ratingPercentage: 60 },
      { skill: "Figma", ratingPercentage: 70 },
   ];

   const projectDetails = [
      {
         title: "Jconnect Internet Banking",
         duration: {
            fromDate: "2023",
            toDate: "Present",
         },
         description:
            "A banking website for easy access to digital banking services.",
         subHeading:
            "Technologies Used: React JS, TypeScript, Styled Component, Tailwind CSS",
      },
      {
         title: "Skordigital Pencak Silat",
         duration: {
            fromDate: "2023",
            toDate: "Present",
         },
         description: "A website for a digital pencak silat scoring system.",
         subHeading: "Technologies Used: React JS, Tailwind CSS",
      },
      // {
      //    title: "Evil Corps",
      //    duration: {
      //       fromDate: "2022",
      //       toDate: "2022",
      //    },
      //    description:
      //       "A website generated from collective ideas about parenting.",
      //    subHeading: "Technologies Used: React JS, Material UI",
      // },
      {
         title: "EduFams",
         duration: {
            fromDate: "2022",
            toDate: "2022",
         },
         description:
            "A website generated from collective ideas about parenting.",
         subHeading: "Technologies Used: React JS, TypeScript, Vanilla CSS",
      },
   ];

   const resumeDetails = [
      <div className="resume-screen-container" key="education">
         <ResumeHeading
            heading={"University of Amikom Yogyakarta"}
            subHeading={"Associate's Degree of Informatics Engineering"}
            fromDate={"2019"}
            toDate={"2022"}
         />
         <ResumeHeading
            heading={"Vocational High School"}
            subHeading={
               "Students of Department Computer and Network Engineering"
            }
            fromDate={"2016"}
            toDate={"2018"}
         />
         <ResumeHeading
            heading={"Junior High School"}
            subHeading={"Student at SMPN 2 Jabung Lampung Timur"}
            fromDate={"2014"}
            toDate={"2016"}
         />
      </div>,

      <div className="resume-screen-container" key="work-experience">
         <div style={{ overflowY: "auto", marginLeft: -30 }}>
            <div className="resume-bullet-work">
               <ResumeHeading
                  heading={"PT. Infosys Solusi Terpadu"}
                  subHeading={"FRONTEND DEVELOPER"}
                  fromDate={"2023"}
                  toDate={"present"}
               />
               <div className="experience-description">
                  <span className="resume-description-text">
                     Currently, I'm working on developing banking websites for
                     clients based on the provided UI design and integrating
                     API's with the backend services.
                  </span>
               </div>

               <ResumeHeading
                  heading={"PT. Media Kreasi Abadi"}
                  subHeading={"INTERNSHIP (MBKM) FRONTEND DEVELOPER"}
                  fromDate={"2022"}
                  toDate={"2022"}
               />
               <div className="experience-description">
                  <span className="resume-description-text">
                     Making an app based on real-life issues. Here, my team and
                     I stepped up to the challenge by developing app centered
                     around parenting topics.
                  </span>
               </div>

               <ResumeHeading
                  heading={"Forum Asisten Amikom Yogyakarta University"}
                  subHeading={"Asisten Practicum Web Programming 1"}
                  fromDate={"2021"}
                  toDate={"2021"}
               />
               <div className="experience-description">
                  <span className="resume-description-text">
                     Assisting with a web programming practicum covering HTML,
                     CSS, and JavaScript basic.
                  </span>
               </div>

               {/* <ResumeHeading
                  heading={"Forum Asisten Amikom University"}
                  subHeading={"Asisten Practicum Web Programming 1"}
                  fromDate={"2023"}
                  toDate={"present"}
               />
               <div className="experience-description">
                  <span className="resume-description-text">
                     Assisting with a web programming practicum covering HTML,
                     CSS, and JavaScript basic.
                  </span>
               </div> */}
            </div>
         </div>
      </div>,

      <div
         className="resume-screen-container programming-skills-container"
         key="programming-skills"
      >
         {programmingSklisDetails.map((skill, index) => (
            <div className="skill-parent" key={index}>
               <div className="heading-bullet"></div>
               <span>{skill.skill}</span>
               <div className="skill-percentage">
                  <div
                     style={{ width: skill.ratingPercentage + "%" }}
                     className="active-percentage-bar"
                  ></div>
               </div>
            </div>
         ))}
      </div>,

      <div className="resume-screen-container" key="projects">
         {/* <div style={{ overflowY: "auto", marginLeft: -30 }}>
            <div className="resume-bullet-project"> */}
         {projectDetails.map((projectDetails, index) => (
            <ResumeHeading
               key={index}
               heading={projectDetails.title}
               subHeading={projectDetails.subHeading}
               description={projectDetails.description}
               fromDate={projectDetails.duration.fromDate}
               toDate={projectDetails.duration.toDate}
            />
         ))}
         {/* </div>
         </div> */}
      </div>,

      <div className="resume-screen-container" key="interests">
         <ResumeHeading
            heading="Drawing"
            description="I am interested in drawing and coloring pictures."
         />
         <ResumeHeading
            heading="Music"
            description="I also love music because it keeps loneliness away and brings me peace."
         />
         <ResumeHeading
            heading="Competitive Gaming"
            description="I enjoy playing competitive games because I like improving my skills in competition, strategy, and tactics within the game."
         />
         <ResumeHeading
            heading="Design UI/UX"
            description="I have a goal to level up my design skills."
         />
      </div>,
   ];

   const handleCarousal = (index) => {
      let offsetHeight = 360;
      let newCarousalOffset = {
         style: {
            transform: "translateY(" + index * offsetHeight * -1 + "px)",
         },
      };
      setCarousalOffSetStyle(newCarousalOffset);
      setSelectedBulletIndex(index);
   };

   const getBullets = () => {
      return resumeBullets.map((bullet, index) => (
         <div
            onClick={() => handleCarousal(index)}
            className={
               index === selectedBulletIndex
                  ? "bullet selected-bullet"
                  : "bullet"
            }
            key={index}
         >
            <img
               className="bullet-logo"
               src={require(`../../assets/Resume/${bullet.logoSrc}`)}
               alt="B"
            />
            <span className="bullet-label">{bullet.label}</span>
         </div>
      ));
   };

   const getResumeScreen = () => {
      return (
         <div
            style={carousalOffSetStyle.style}
            className="resume-details-carousal"
         >
            {resumeDetails.map((ResumeDetail) => ResumeDetail)}
         </div>
      );
   };

   return (
      <div
         className="resume-container screen-container fade-in"
         id={props.id || ""}
      >
         <div className="resume-content">
            <ScreenHeading
               title={"Resume"}
               subHeading={"My Formal Bio Details"}
            />
            <div className="resume-card">
               <div className="resume-bullets">
                  <div className="bullet-container">
                     <div className="bullet-icons"></div>
                     <div className="bullets">{getBullets()}</div>
                  </div>
               </div>
               <div className="resume-bullet-details">{getResumeScreen()}</div>
            </div>
         </div>
      </div>
   );
}
