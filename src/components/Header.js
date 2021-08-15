import { makeStyles } from '@material-ui/core/styles';
import SearchBar from './search/SearchBar';
import { useDispatch } from 'react-redux'
import { config } from '../config';
import { updateRootState } from '../redux';

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
    cursor: "pointer",
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
    const dispatch = useDispatch();

    const showHomePage = () => {
        dispatch(updateRootState({currentPage: config.PAGE.HOME}));
    }
    return (
        <div className={classes.root}>
            <div className={classes.heading} onClick={showHomePage}>
                <img src={props.logo} alt={props.title} className={classes.logo}/>
                {props.title}
            </div>
            <SearchBar />
        </div>
    )
}