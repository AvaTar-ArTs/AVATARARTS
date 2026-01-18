import React, { useState } from "react";

import ImageGenerator from "./components/ImageGenerator";
import NavBar from "./templates/NavBar";
import Header from "./templates/Header";
import Footer from "./templates/Footer";

function App() {
  return(
    <div>
      <Header />
      <NavBar />
      <h1>OpenAI Image Generator</h1>
      <ImageGenerator />
      <Footer />
    </div>
  );

}

export default App;