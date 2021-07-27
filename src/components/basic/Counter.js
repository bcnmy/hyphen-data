import { makeStyles } from '@material-ui/core/styles';
import clsx from  'clsx';

const useStyles = makeStyles({
  root: {
      padding: "5px",
      width: "450px",
      fontFamily: 'Roboto Mono!important'
  },
  container: {
    //   border: "2px solid #454344",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      backgroundImage: "radial-gradient(farthest-side at 20% 10%,#615CCD,black)",
      color: "#fff"
  },
  row: {
      padding: "5px 10px",
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold"
  },
  valueRow: {
    textAlign: "center",      
    fontSize: "40px",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  logoIcon: {
      width: "15px",
      margin: "0px 5px"
  },
  percentageChange: {
      fontSize: "20px",
      marginLeft: "10px",
      fontWeight: "bold"
  },
  green: {
    color: "#50E2AE"
  },
  red: {
    color: "#D42A4A"
  },
  darkGreen: {
    color: "#0E8B5E"
  },
  darkRed: {
    color: "#D32E4B"
  }
});

export default function Counter(props) {
    const classes = useStyles();
    
    let percChangeComponent;
    if(props.previousCounter != undefined && props.counter != undefined) {
        let percentageChange = ((props.counter - props.previousCounter)/props.counter)*100;
        if(percentageChange) percentageChange = percentageChange.toFixed(0);
        if(percentageChange >= 0) {
            percChangeComponent = <div className={clsx(classes.percentageChange, props.lightBackground ? classes.darkGreen : classes.green)}>
                +{percentageChange}%
            </div>
        } else {
            percChangeComponent = <div className={clsx(classes.percentageChange, props.lightBackground ? classes.darkRed : classes.red)}>
                {percentageChange}%
            </div>
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.container} style={props.style}>
                <div className={clsx(classes.row, classes.headerRow)}>
                    <div className={classes.headerTitle}>
                        {props.title}
                    </div>
                    <div className={classes.chainLogoContainer}>
                        {props.chainInfo}
                    </div>
                </div>
                <div className={clsx(classes.row, classes.valueRow)}>
                    {props.label || "..."} {props.previousCounter && 
                        percChangeComponent
                    }
                </div>
            </div>
        </div>
    )
}