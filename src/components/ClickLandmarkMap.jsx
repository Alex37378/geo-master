import { useEffect, useRef } from "react";
import { select, pointer } from "d3-selection";
import { zoom } from "d3-zoom";

export default function ClickLandmarkMap({
    svgRef,
    countriesGeo,
    path,
    projection,
    gameOver,
    selectedPoint,
    setSelectedPoint,
    wrongLandmarks
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

        return () => svg.on(".zoom", null);
    }, []);

    function handleMapClick(event) {
        if (gameOver) return;

        const group = svgRef.current.querySelector(".map-group");

        const pt = svgRef.current.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;

        // Convert directly into the map-group's coordinates
        const mapPoint = pt.matrixTransform(
            group.getScreenCTM().inverse()
        );

        const coordinates = projection.invert([mapPoint.x, mapPoint.y]);

        if (!coordinates) return;

        setSelectedPoint(coordinates);
    }

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 800 500"
            className="bg-sky-50 w-full max-h-[45vh] h-auto border border-[#10B981] rounded-lg mx-auto"
            onClick={handleMapClick}
        >
            <g className="map-group">

                {countriesGeo.features.map(country => (
                    <path
                        key={country.id}
                        d={path(country)}
                        fill="#D3D3D3"
                        stroke="white"
                        strokeWidth={0.5}
                    />
                ))}

                {!gameOver && selectedPoint && (
                    <circle
                        cx={projection(selectedPoint)[0]}
                        cy={projection(selectedPoint)[1]}
                        r={4}
                        fill="#10B981"
                        stroke="white"
                        strokeWidth={1}
                    />
                )}

                {gameOver && wrongLandmarks.map(landmark => (
                    <g key={landmark.name}>
                        <circle
                            cx={projection(landmark.coordinates)[0]}
                            cy={projection(landmark.coordinates)[1]}
                            r={4}
                            fill="#EF4444"
                            stroke="white"
                            strokeWidth={1}
                            className="cursor-pointer hover:opacity-70"
                        />
                        <title>
                            {landmark.name}
                        </title>
                    </g>
                ))}

            </g>
        </svg>
    );
}