import "./App.css";
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HyphenIcon from "./assets/Hyphen_icon.png";
import Header from "./components/Header";
import Home from "./components/page/Home";
import App2 from "./App2";
import { useSelector, useDispatch } from 'react-redux'
import { updateSearchState, updateRootState } from './redux';
let { config } = require("./config");

const useStyles = makeStyles({
  root: {
      padding: "71px 0px 0px 0px",
      margin: "0px",      
      fontFamily: 'Roboto Mono!important',
  }
});

function App() {
    const classes = useStyles();

    const currentPage = useSelector(state => state.root.currentPage);

    const [currentComponent, setCurrentComponent] = useState();

    useEffect(()=>{
        if(currentPage) {
            switch(currentPage) {
                case config.PAGE.HOME:
                    setCurrentComponent(<Home />);
                    break;
                case config.PAGE.SEARCH:
                    setCurrentComponent(<App2 />);
                    break;
            }
        }
    }, [currentPage]);

    return (
        <div className={classes.root}>
            <Header title="Hyphen" logo={HyphenIcon}/>
            {currentComponent}
        </div>
    );
}

export default App;