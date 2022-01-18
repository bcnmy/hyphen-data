import { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { config } from '../../config';
import { updateSearchState, updateRootState } from '../../redux';
import { useSelector, useDispatch } from 'react-redux'

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
    borderRadius: "8px",
    width: "600px",
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
    const dispatch = useDispatch();
    const classes = useStyles();

    const [selectedNetwork, setSelectedNetwork] = useState(config.supportedChainsArray[0].chainId);
    const [_searchText, setSearchText] = useState("");

    const handleNetworkChange = (event) => {
        setSelectedNetwork(event.target.value);
        dispatch(updateSearchState({networkId: event.target.value}));
    }

    const onSearchTextChanged = (event) => {
        setSearchText(event.target.value);
    }

    const onSearchClicked = (event) => {
      if(_searchText && _searchText.length > 0) {
        dispatch(updateSearchState({searchText: _searchText}));
        setSearchText("");
        dispatch(updateRootState({currentPage: config.PAGE.TRANSFER_DETAILS}));
      }
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

                {config.supportedChainsArray.map((item, index) =>
                    <MenuItem key={`ChainMenuItem_${index}`} value={item.chainId}>{item.name}</MenuItem>
                )}
            </Select>


            <InputBase
                className={classes.input}
                placeholder="Search by Deposit Hash"
                inputProps={{ 'aria-label': 'Search by Deposit Hash' }}
                onChange={onSearchTextChanged}
                value={_searchText}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search"
                onClick={onSearchClicked}>
                <SearchIcon />
            </IconButton>
        </div>
    )
}