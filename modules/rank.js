module.exports = {
  getRank: async(points) => {
    let rank = 1;
    let requiredPoints = 30;

    while (points >= requiredPoints) {
      rank++;
      requiredPoints = Math.floor(requiredPoints * 1.3);
    }

    const next = requiredPoints - points;

    return { rank, next };
  }
}