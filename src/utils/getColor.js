import chroma from "chroma-js";

// getColor :: [Number] -> Number -> String
const getColor = rampValues => {
  const colors = chroma.brewer.Blues;
  const rampDomain = chroma.limits(rampValues, "q");
  const colourScale = chroma.scale(colors).domain(rampDomain);
  return value => colourScale(value).hex();
};

export { getColor };
