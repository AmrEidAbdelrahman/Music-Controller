import { Container, makeStyles } from '@material-ui/core';
import React from 'react';
import {render} from 'react-dom';
import Home from "./Home";


const useStyle = makeStyles({
    main: {
      marginTop: 170,
    }
  })

const App = () => {
    const classes = useStyle();

    return (
        <Container className={classes.main}>
            <Home />
        </Container>

    );
}
 
export default App;

const appDiv = document.getElementById("app");
render(<App />, appDiv);