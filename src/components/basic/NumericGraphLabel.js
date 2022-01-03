import { ValueAxis } from "@devexpress/dx-react-chart-material-ui";

export default function NumericGraphLabel({ text, ...restProps }) {
    const formattedText = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
    }).format(text.replace(/,/g, ""));

    return <ValueAxis.Label {...restProps} text={formattedText} />;
}
