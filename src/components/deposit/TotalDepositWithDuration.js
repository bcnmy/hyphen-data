import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { getTotalDepositWithDuration } from "../../service/deposit";
import { config } from "../../config";
import CounterAllNetworks from "../basic/CounterAllNetworks";
import { useSelector, useDispatch } from "react-redux";
let numeral = require("numeral"); //http://numeraljs.com/

const useStyles = makeStyles({});
const noOfSecondsInDay = 86400;

export default function TotalDepositWithDuration(props) {
    const classes = useStyles();

    const [totalDeposit, setTotalDeposit] = useState();
    const [previousDeposit, setPreviousDeposit] = useState();
    const [label, setLabel] = useState();
    const version = useSelector((state) => state.root.version);

    useEffect(() => {
        const now = Date.now();
        let chainIds = props.chainIds;
        let days = props.days || 1; // By default get 24hr volume

        if (chainIds) {
            const curTimeInSec = parseInt(now / 1000);
            let startTime = curTimeInSec - days * noOfSecondsInDay;
            let endTime = curTimeInSec;
            fetchTotalDeposit(chainIds, startTime, endTime);
            if (props.showComparision) {
                fetchPreviousDurationDeposit(
                    chainIds,
                    startTime - (endTime - startTime),
                    startTime
                );
            }
        }
    }, [version]);

    let fetchTotalDeposit = async (chainIds, startTime, endTime) => {
        try {
            let _totalDeposit = 0;
            for (let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                let currentChainDeposit = await getTotalDepositWithDuration(
                    item,
                    startTime,
                    endTime,
                    version
                );
                _totalDeposit = _totalDeposit + currentChainDeposit;
            }

            if (_totalDeposit != undefined) {
                // Format Data here
                setTotalDeposit(_totalDeposit);
                _totalDeposit = numeral(_totalDeposit).format(
                    config.counterFormat
                );
                setLabel(_totalDeposit);
            }
        } catch (error) {
            console.error(error);
            setTotalDeposit("Error");
        }
    };

    let fetchPreviousDurationDeposit = async (chainIds, startTime, endTime) => {
        try {
            let _totalDeposit = 0;
            for (let index = 0; index < chainIds.length; index++) {
                let item = chainIds[index];
                _totalDeposit += await getTotalDepositWithDuration(
                    item,
                    startTime,
                    endTime,
                    version
                );
            }

            if (_totalDeposit != undefined) {
                setPreviousDeposit(_totalDeposit);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CounterAllNetworks
            title={props.title}
            chainIds={props.chainIds}
            counter={totalDeposit}
            previousCounter={previousDeposit}
            label={label}
            {...props}
        />
    );
}
