import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import countries from "../data/countries.json";

export default function CapitalMap({
  svgRef,
  countriesGeo,
  path,
  projection,
  currentCapital,
  currentFeature,
  gameOver,
  wrongCapitals
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
      className="bg-sky-50 w-[calc(100%-2rem)] max-w-[800px] h-auto border border-[#10B981] mx-auto rounded-lg"
    >
      <g className="map-group">

        {countriesGeo.features.map((country) => (
          <path
            key={country.id}
            d={path(country)}
            fill="#D3D3D3"
            stroke="white"
            strokeWidth={0.5}
          />
        ))}

        {!gameOver && currentFeature && (
          <path
              d={path(currentFeature)}
              fill="#D3D3D3"
              stroke="#10B981"
              strokeWidth={1}
          />
        )}

        {!gameOver && currentCapital && (
            <text
                x={projection(currentCapital.coordinates)[0]}
                y={projection(currentCapital.coordinates)[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill="#047857"
                className="cursor-default"
            >
                ★
            </text>
        )}

        {gameOver && wrongCapitals?.map(capital => {

          return (
              <text
                  key={capital.id}
                  x={projection(capital.coordinates)[0]}
                  y={projection(capital.coordinates)[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="#EF4444"
                  className="cursor-pointer hover:text-[18px]"
              >
                  ★
                  <title>
                    {capital.capital}, {capital.name}
                  </title>
              </text>
          );
        })}

      </g>
    </svg>
  );
}