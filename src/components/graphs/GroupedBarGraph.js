import { ResponsiveBar } from "@nivo/bar";

function GroupedBarGraph({
    ariaLabel,
    axisBottomName,
    axisLeftName,
    data,
    indexBy,
    keys,
}) {
    console.log({ data, keys });

    return data.length > 0 && keys.length > 0 ? (
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={indexBy}
            groupMode="grouped"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            valueFormat=" >-d"
            colors={{ scheme: "nivo" }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            height={288}
            axisTop={null}
            axisRight={null}
            enableLabel={false}
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
                tickRotation: 45,
                legend: axisLeftName,
                legendPosition: "middle",
                legendOffset: -48,
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

export { GroupedBarGraph };