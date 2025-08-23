import React from "react";
import "../Styles/About.css";

export function About() {
  return (
    <div className="about-page">
      <h1>About WebSketch</h1>

      <div className="about-container">
        <div className="about-box">
          <h2>About</h2>
          <p>
            Creator: Jameson Brown <br/>
            Major(s): Game Art & Animation, Game Programming <br/>
            This page is soemthing I have been wanting to do for a while. 
            As an artist that knows what it's like to not be able to afford expensive drawing programs or have the computer space for them, 
            I wanted to create something for similar artists who are looking to express themselves but struggle with the same difficulties. 
            Websketch is a free-to-use online drawing program that uses Node.js, React.js, Rough.js, and perfect-freehand.
             As of right now, the functions are limited to a pencil tool, line tool, square tool, selection tool, and text tool. 
             There is color-changing, panning, zoom in and out, undo and redo, and saving. Im hoping to improve my programming skills so I can make this program even better!
          </p>
        </div>

        <div className="future-box">
          <h2>Future Plans</h2>
          <p>
            For the future of WebSketch, I'm hoping to add multiple more functions. These include, but are not limited to:<br/>
            <ul>
                <li>
                Fill Bucket
                </li> 
                <li>
                Lasso Tool 
                </li>
                <li>
                Pressure Sensitivity
                </li>
                <li>
                Erase Tool
                </li>
                <li>
                Better Layer System
                </li>
                <li> 
                More Dynamic Color System
                </li>
                <li>
                Recording
                </li>
                <li> 
                Suggestions from Users!
                </li>
                
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
