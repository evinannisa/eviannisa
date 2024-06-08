import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Animations from "../../utilities/Animations";
import ScrollService from "../../utilities/ScrollService";
import ScreenHeading from "../../utilities/ScreenHeading/ScreenHeading";
import "./Project.css";

export default function Project(props) {
   let fadeInScreenHandler = (screen) => {
      if (screen.fadeInScreen !== props.id) return;
      Animations.animations.fadeInScreen(props.id);
   };

   const fadeInSubscription =
      ScrollService.currentScreenFadeIn.subscribe(fadeInScreenHandler);

   const options = {
      loop: true,
      margin: 0,
      nav: true,
      animateIn: "bounceInRight",
      animateOut: "bounceOutRight",
      dots: true,
      autoplay: true,
      smartSpeed: 1000,
      responsive: {
         0: {
            items: 1,
         },
         768: {
            items: 1,
         },
         1000: {
            items: 3,
         },
      },
   };

   return (
      <div id={props.id || ""}>
         <ScreenHeading title={"Project"} subHeading={"My Latest Project"} />
         <section className="testimonial-section fade-in">
            <div className="container">
               <div className="row">
                  <OwlCarousel
                     className="owl-carousel"
                     id="testimonial-carousel"
                     {...options}
                  >
                     <div className="col-lg-12">
                        <div className="testi-item">
                           <div className="testi-comment edufams">
                              {/* <img src="img/Testimonial/edufams.png" alt="" /> */}
                           </div>
                           <div className="client-info">
                              <ul className="stars list-unstyled">
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li className="title">
                                    &nbsp; EduFams &nbsp;
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star-half-alt" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>

                     <div className="col-lg-12">
                        <div className="testi-item">
                           <div className="testi-comment skordigital"></div>
                           <div className="client-info">
                              <ul className="stars list-unstyled">
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li className="title">
                                    &nbsp; Skordigital Pencak Silat &nbsp;
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star-half-alt" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>

                     <div className="col-lg-12">
                        <div className="testi-item">
                           <div className="testi-comment evilcorps">
                              {/* <img src="img/Testimonial/evilcorps.png" alt="" /> */}
                           </div>
                           <div className="client-info">
                              <ul className="stars list-unstyled">
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li className="title">
                                    &nbsp; Evil Corps &nbsp;
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star-half-alt" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>

                     <div className="col-lg-12">
                        <div className="testi-item">
                           <div className="testi-comment jconnect"></div>
                           <div className="client-info">
                              <ul className="stars list-unstyled">
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li className="title">
                                    &nbsp; JConnect &nbsp;
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star-half-alt" />
                                 </li>
                                 <li>
                                    <i className="fa fa-star" />
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </OwlCarousel>
               </div>
            </div>
         </section>

         <div className="footer-image">
            <img src="img/Testimonial/shape-bg.png" alt="gambar footer" />
         </div>
      </div>
   );
}
