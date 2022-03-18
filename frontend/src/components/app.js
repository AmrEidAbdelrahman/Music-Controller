import React from 'react';
import {render} from 'react-dom';
import Home from "./Home";




const App = () => {
    return (

        <Home />

    );
}
 
export default App;

const appDiv = document.getElementById("app");
render(<App />, appDiv);