class rank {
  constructor(points) {
    this.points = points;
  }

  getRank() {
  }

  generateBar(per) {
    const filledLength = Math.floor(per * 10);
    const gauge = ':green_square:'.repeat(filledLength) + ':white_large_square:'.repeat(10 - 
    filledLength);
  }
}

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