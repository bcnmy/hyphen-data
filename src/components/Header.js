import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import SearchBar from './search/SearchBar';

const useStyles = makeStyles({
  root: {
      padding: "15px 15px 15px 15px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#fff",
      boxShadow: "0 1px 10px rgb(0 0 0 / 10%)",
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "71px"
  },
  heading: {
    padding: "2px",
    fontWeight: "bold",
    fontSize: "25px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "fit-content"
  },
  logo: {
    width: "24px",
    marginRight: "5px"
}
});

export default function Header(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <img src={props.logo} alt={props.title} className={classes.logo}/>
                {props.title}
            </div>
            <SearchBar />
        </div>
    )
}