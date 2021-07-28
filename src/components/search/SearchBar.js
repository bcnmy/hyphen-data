import { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    position: 'relative',
    fontSize: 16,
    padding: '10px 20px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
        'Roboto-Mono',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  icon: {
      right: "35px"
  }
}))(InputBase);

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #D5DAE2",
    borderRadius: "5px",
    width: "500px",
    height: "40px"
  },
  input: {
      flexGrow: "1",
      padding: "0px 10px"
  },
  networkSelect: {
      width: "120px",
      borderRight: "1px solid #D5DAE2",
      padding: "0px 5px"
  }
});

export default function SearchBar(props) {
    const classes = useStyles();

    const [selectedNetwork, setSelectedNetwork] = useState(80001);


    const handleNetworkChange = (event) => {

    }

    return (
        <div className={classes.root}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedNetwork}
                className={classes.networkSelect}
                input={<BootstrapInput />}
                onChange={handleNetworkChange}>

                <MenuItem value={80001}>Mumbai</MenuItem>
                <MenuItem value={5}>Goerli</MenuItem>

            </Select>


            <InputBase
                className={classes.input}
                placeholder="Search by Address / Deposit Hash"
                inputProps={{ 'aria-label': 'Search by Address / Deposit Hash' }}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
        </div>
    )
}