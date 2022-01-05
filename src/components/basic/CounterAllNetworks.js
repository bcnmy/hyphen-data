import { config } from "../../config";
import Counter from "./Counter";

export default function CounterAllNetworks(props) {
    const chainName =
        props.chainIds.length === 1
            ? config.chainIdMap[props.chainIds[0]].name
            : null;
    const chainImage =
        props.chainIds.length === 1
            ? config.chainLogoMap[props.chainIds[0]]
            : null;

    return <Counter {...props} chainName={chainName} chainImage={chainImage} />;
}
