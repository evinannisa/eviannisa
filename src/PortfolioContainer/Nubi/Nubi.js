import React, { useEffect } from "react";
import "./Nubi.css";

export default function Nubi() {
   useEffect(() => {
      const newTab = window.open("", "_blank");
      if (newTab) {
         const content = `
            <html>
               <head>
                  <title>Hello World!</title>
               </head>
               <body>
                  <h1>Hello World!</h1>
                  <p>Evi's Blog Coming Soon</p>
               </body>
            </html>
         `;
         newTab.document.write(content);
      }
   }, []);
   return (
      <div className="body">
         <h1 className="title">Hello World!</h1>
         <h2 className="title" style={{ fontSize: 36 }}>
            Evi's Blog Coming Soon
         </h2>
      </div>
   );
}
