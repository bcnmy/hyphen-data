import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import positiveChangeArrow from "../../assets/positive-change-arrow.svg";
import negativeChangeArrow from "../../assets/negative-change-arrow.svg";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        height: "auto",
        minHeight: "184px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        padding: "24px 16px 24px 16px",
        color: "#fff",
    },
    ethBg: {
        background: "linear-gradient(239.66deg, #8B92AF 0%, #000000 68.46%)",
    },
    maticBg: {
        background: "linear-gradient(239.66deg, #8247E5 0%, #000000 68.46%)",
    },
    avaxBg: {
        background: "linear-gradient(239.66deg, #E84142 0%, #000000 68.46%)",
    },
    headerRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "8px",
        fontWeight: "bold",
    },
    headerTitle: {
        fontSize: "18px",
        color: "#00000080",
    },
    headerTitleWhite: {
        fontSize: "18px",
        color: "#ffffff80",
    },
    headerChainImage: {
        height: "28px",
        width: "auto",
        backgroundColor: "rgba(97, 92, 205, 0.1)",
    },
    headerChainName: {
        fontSize: "10px",
        color: "#ffffff",
    },
    valueRow: {
        marginBottom: "8px",
        fontSize: "32px",
        fontWeight: "500",
    },
    percentageChangeArrow: {
        height: "14px",
        width: "auto",
        marginRight: "6px",
    },
    percentageChangeText: {
        fontSize: "18px",
        fontVariantNumeric: "tabular-nums",
    },
    positivePercentageChangeColor: {
        color: "#50af95",
    },
    negativePercentageChangeColor: {
        color: "#ea4335",
    },
});

function getContainerBgName(chainName) {
    switch (chainName) {
        case "Ethereum":
            return "ethBg";
        case "Polygon":
            return "maticBg";
        case "Avalanche":
            return "avaxBg";
        default:
            return "";
    }
}

function PositivePercentageChange({ percentageChange }) {
    const classes = useStyles();

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
                alt="Positive change"
                className={classes.percentageChangeArrow}
                src={positiveChangeArrow}
            />
            <span
                className={clsx(
                    classes.percentageChangeText,
                    classes.positivePercentageChangeColor
                )}
            >
                {percentageChange}%
            </span>
        </Box>
    );
}

function NegativePercentageChange({ percentageChange }) {
    const classes = useStyles();

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
                alt="Negative change"
                className={classes.percentageChangeArrow}
                src={negativeChangeArrow}
            />
            <span
                className={clsx(
                    classes.percentageChangeText,
                    classes.negativePercentageChangeColor
                )}
            >
                {Math.abs(percentageChange)}%
            </span>
        </Box>
    );
}

export default function Counter(props) {
    const classes = useStyles();
    const percentageChange =
        props.previousCounter !== undefined &&
        props.counter !== undefined &&
        props.counter !== 0
            ? (
                  ((props.counter - props.previousCounter) / props.counter) *
                  100
              ).toFixed(0)
            : 0;

    return (
        <div
            className={clsx(
                classes.container,
                classes[getContainerBgName(props.chainName)]
            )}
            style={props.style}
        >
            <div className={clsx(classes.row, classes.headerRow)}>
                <span
                    className={clsx(
                        props.chainName ? null : classes.headerTitle,
                        props.chainName ? classes.headerTitleWhite : null
                    )}
                >
                    {props.title}
                </span>
                {props.chainImage ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            className={classes.headerChainImage}
                            src={props.chainImage}
                            alt="Chain type"
                        />
                        <span className={classes.headerChainName}>
                            {props.chainName}
                        </span>
                    </Box>
                ) : null}
            </div>
            <div
                className={clsx(classes.row, classes.valueRow)}
                style={props.labelContainerStyle}
            >
                {props.label || "..."}
            </div>
            {props.previousCounter !== undefined && percentageChange >= 0 ? (
                <PositivePercentageChange percentageChange={percentageChange} />
            ) : null}
            {props.previousCounter !== undefined && percentageChange < 0 ? (
                <NegativePercentageChange percentageChange={percentageChange} />
            ) : null}
        </div>
    );
}
