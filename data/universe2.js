// Blue Universe data: utilities + recommended games, sorted by startYear
// Depends on utilities.js and recommended.js being loaded first
window.universe2Data = (window.utilities || []).concat(window.recommendedGames || []).sort(function (a, b) {
    return (a.startYear != null ? a.startYear : 9999) - (b.startYear != null ? b.startYear : 9999);
});
