function extractGridCounts(grid) {
  const counts = [];
  for (let [k, v] of Object.entries(grid.features)) {
    counts.push(grid.features[k].properties.count);
  }
  return counts;
}

export { extractGridCounts };
