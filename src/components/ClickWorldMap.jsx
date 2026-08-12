import { useEffect } from "react";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";

export default function ClickWorldMap({
    svgRef,
    countriesGeo,
    path,
    gameOver,
    selectedCountry,
    setSelectedCountry,
    wrongCountries
}) {

    useEffect(() => {
        const svg = select(svgRef.current);

        const zoomBehavior = zoom()
            .scaleExtent([1, 5])
            .on("zoom", (event) => {
                svg.select(".map-group")
                    .attr("transform", event.transform);
            });

        svg.call(zoomBehavior);

        return () => {
            svg.on(".zoom", null);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 800 500"
            className="bg-sky-50 w-[calc(100%-2rem)] max-w-[600px] max-h-[45vh] h-auto border border-[#10B981] mx-auto rounded-lg"
        >
            <g className="map-group">

                {countriesGeo.features.map(country => {

                    const selected =
                        selectedCountry !== null &&
                        selectedCountry?.toString() === country.id?.toString();

                    const wrong =
                        wrongCountries.some(
                            item => item.id?.toString() === country.id?.toString()
                        );

                    return (
                        <path
                            key={country.id}
                            d={path(country)}
                            fill={
                                gameOver
                                    ? wrong
                                        ? "#EF4444"
                                        : "#D3D3D3"
                                    : selected
                                        ? "#10B981"
                                        : "#D3D3D3"
                            }
                            stroke="white"
                            strokeWidth={0.5}
                            className={
                                gameOver
                                    ? wrong
                                        ? "cursor-pointer hover:opacity-70"
                                        : ""
                                    : "cursor-pointer hover:opacity-70"
                            }
                            onClick={() => {
                                if (!gameOver) {
                                    setSelectedCountry(country.id);
                                }
                            }}
                        >
                            {gameOver && wrong && (
                                <title>
                                    {country.properties.name}
                                </title>
                            )}
                        </path>
                    );

                })}

            </g>
        </svg>
    );
}