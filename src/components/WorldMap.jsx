export default function WorldMap({
    svgRef, 
    countriesGeo, 
    path,
    gameOver, 
    currentCountry,
    currentFeature,
    isSmallCountry,
    wrongCountries
}){
    return (
    <svg
            ref={svgRef}
            viewBox="0 0 800 500"
            className="w-[calc(100%-2rem)] max-w-[800px] h-auto bg-sky-50 border border-[#10B981] mx-auto rounded-lg"
          >
            <g className="map-group">
              {countriesGeo.features.map((country) => (
                <path
                  key={country.id}
                  d={path(country)}
                  fill={
                    gameOver
                      ? wrongCountries.some(item => item.id?.toString() === country.id?.toString())
                        ? "#EF4444"
                        : "#D3D3D3"
                      : country.id?.toString() === currentCountry?.id?.toString()
                        ? "#10B981"
                        : "#D3D3D3"
                  }
                  className={
                    gameOver && wrongCountries.some(item => item.id?.toString() === country.id?.toString())
                      ? "hover:opacity-70 cursor-pointer"
                      : ""
                  }
                  stroke="white"
                  strokeWidth={0.5}
                >
                  {gameOver && wrongCountries.some(item => item.id?.toString() === country.id?.toString()) && (
                    <title>{country.properties.name}</title>
                  )}
                </path>
              ))}

              {!gameOver && currentFeature && isSmallCountry(currentFeature) && (
                <circle
                  cx={path.centroid(currentFeature)[0]}
                  cy={path.centroid(currentFeature)[1]}
                  r={10}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              )}
            </g>
    </svg>
    )
}