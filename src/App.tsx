import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { Component } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Primary from "./Primary";
import Home from "./routes/Home";
import Products from "./routes/Products";
import Reports from "./routes/Reports";
import Secondary from "./Secondary";

function App(){

   
 return (
<>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/'  element={<Reports/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/products' element={<Products/>} />
        </Routes>
      </BrowserRouter>
    </>


     
    );

}

export default App;