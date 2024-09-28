import React, { useState } from "react";
import imgBack from "../../images/mailz.jpeg";
import load1 from "../../images/load2.gif";
import Animations from "../../utilities/Animations";
import ScrollService from "../../utilities/ScrollService";
import ScreenHeading from "../../utilities/ScreenHeading/ScreenHeading";
import Typical from "react-typical";
import "./ContactMe.css";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";
import InstagramIcon from "../../assets/Home/instagram.svg";
import FacebookIcon from "../../assets/Home/facebook.svg";
import WhatsAppIcon from "../../assets/Home/whatsapp.svg";
import TelegramIcon from "../../assets/Home/telegram-plane.svg";

export default function Contact(props) {
   let fadeInScreenHandler = (screen) => {
      if (screen.fadeInScreen !== props.id) return;
      Animations.animations.fadeInScreen(props.id);
   };

   const fadeInSubscription =
      ScrollService.currentScreenFadeIn.subscribe(fadeInScreenHandler);

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [banner, setBanner] = useState("");
   const [bool, setBool] = useState(false);

   const handleName = (e) => {
      setName(e.target.value);
   };

   const handleEmail = (e) => {
      setEmail(e.target.value);
   };

   const handleMessage = (e) => {
      setMessage(e.target.value);
   };

   const submitForm = async (e) => {
      e.preventDefault();
      if (name.length === 0 || email.length === 0 || message.length === 0) {
         setBool(false);
         toast.error("please fill all the fields");
         return;
      }

      setBool(true);

      try {
         let data = {
            name,
            email,
            message,
         };
         // setBool(true);
         const res = await axios.post(`/contact`, data);
         if (name.length === 0 || email.length === 0 || message.length === 0) {
            setBanner(res.data.msg);
            toast.error(res.data.msg);
            setBool(false);
         } else if (res.status === 200) {
            setBanner(res.data.msg);
            toast.success(res.data.msg);
            setBool(false);
         }

         // setName("");
         // setEmail("");
         // setMessage("");
      } catch (error) {
         setTimeout(() => {
            setBool(false);
            toast.error("email sending failed");
         }, 3000);

         setTimeout(() => {
            toast.info("Please contact via WhatsApp");
         }, 5000);
      }

      setName("");
      setEmail("");
      setMessage("");
   };

   return (
      <div className="main-container fade-in" id={props.id || ""}>
         <ScreenHeading
            subHeading={"Lets Keep In Touch"}
            title={"Contact Me"}
         />
         <div className="central-form">
            <div className="col">
               <h2 className="">
                  <Typical loop={Infinity} steps={["Get In Touch 📧", 1000]} />
               </h2>
               <a href="https://www.instagram.com/eviannisa_">
                  <img src={InstagramIcon} alt="" />
               </a>
               <a href="https://www.facebook.com/eviannisa00">
                  <img src={FacebookIcon} alt="" />
               </a>
               <a href="https://wa.me/6282138854442">
                  <img src={WhatsAppIcon} alt="" />
               </a>
               <a href="https://t.me/eviannisa">
                  <img src={TelegramIcon} alt="" />
               </a>
            </div>

            <div className="back-form">
               <div className="img-back">
                  <h4>Send Your Email Here!</h4>
                  <img src={imgBack} alt="not found" />
               </div>
               <form action="" onSubmit={submitForm}>
                  <p>{banner}</p>
                  <label htmlFor="name">Name</label>
                  <input type="text" onChange={handleName} value={name} />

                  <label htmlFor="email">Email</label>
                  <input type="email" onChange={handleEmail} value={email} />

                  <label htmlFor="message">Message</label>
                  <textarea
                     type="text"
                     onChange={handleMessage}
                     value={message}
                  />

                  <div className="send-btn">
                     <button type="submit">
                        {bool ? (
                           <b className="load">
                              <img src={load1} alt="not responding" />
                           </b>
                        ) : (
                           <>
                              Send <i className="fa fa-paper-plane" />
                           </>
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
         <Footer />
      </div>
   );
}
