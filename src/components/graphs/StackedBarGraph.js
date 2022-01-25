import { ResponsiveBar } from "@nivo/bar";
import { makeNumberCompact } from "../../utils/makeNumberCompact";

function StackedBarGraph({
    ariaLabel,
    axisBottomName,
    axisLeftName,
    data,
    indexBy,
    keys,
}) {
    return data.length > 0 && keys.length > 0 ? (
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={indexBy}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={({ id, data }) => data[`${id}Color`]}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            height={288}
            axisTop={null}
            axisRight={null}
            enableLabel={false}
            valueFormat={(value) => makeNumberCompact(value)}
            axisBottom={{
                tickSize: 8,
                tickPadding: 4,
                tickRotation: 45,
                legend: axisBottomName,
                legendPosition: "middle",
                legendOffset: 40,
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 0,
                tickRotation: 0,
                legend: axisLeftName,
                legendPosition: "middle",
                legendOffset: -48,
                format: (value) => makeNumberCompact(value),
            }}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
                {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            role="application"
            ariaLabel={ariaLabel}
            barAriaLabel={function (e) {
                return (
                    e.id + ": " + e.formattedValue + " in date: " + e.indexValue
                );
            }}
        />
    ) : null;
}

export { StackedBarGraph };
