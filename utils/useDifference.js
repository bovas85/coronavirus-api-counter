const useDifference = (stats, yStats, twoStats, threeStats) => {
  const { confirmed, recovered, deaths } = stats;

  console.log(yStats, twoStats);
  let deathDifference = 0,
    recDifference = 0,
    confirmedDifference = 0;
  let isDeathIncreased = true;
  let isRecIncreased = true;
  let isConfirmedIncreased = true;
  let deathDiffFromYesterday;
  let deathDiffFromToday;
  let recDiffFromYesterday;
  let recDiffFromToday;
  let confirmedDiffFromYesterday;
  let confirmedDiffFromToday;

  if (yStats && twoStats) {
    deathDiffFromYesterday = Number(twoStats?.deaths) - Number(yStats?.deaths);
    deathDiffFromToday = Number(twoStats?.deaths) - Number(deaths?.value);
    isDeathIncreased = deathDiffFromToday < deathDiffFromYesterday;
    deathDifference = deathDiffFromToday - deathDiffFromYesterday;

    recDiffFromYesterday =
      Number(yStats?.recovered) - Number(twoStats?.recovered);
    recDiffFromToday = Number(recovered?.value) - Number(twoStats?.recovered);
    isRecIncreased = recDiffFromYesterday > recDiffFromToday;
    recDifference = recDiffFromYesterday - recDiffFromToday;

    confirmedDiffFromYesterday =
      Number(yStats?.confirmed) - Number(twoStats?.confirmed);
    confirmedDiffFromToday =
      Number(confirmed?.value) - Number(twoStats?.confirmed);
    isConfirmedIncreased = confirmedDiffFromYesterday > confirmedDiffFromToday;
    confirmedDifference = confirmedDiffFromYesterday - confirmedDiffFromToday;

    if (Number(yStats?.deaths) === Number(deaths?.value)) {
      deathDiffFromYesterday =
        Number(threeStats?.deaths) - Number(twoStats?.deaths);
      deathDiffFromToday = Number(twoStats?.deaths) - Number(deaths?.value);
      isDeathIncreased = deathDiffFromToday < deathDiffFromYesterday;
      deathDifference = deathDiffFromToday - deathDiffFromYesterday;

      recDiffFromYesterday =
        Number(threeStats?.recovered) - Number(twoStats?.recovered);
      recDiffFromToday = Number(twoStats?.recovered) - Number(recovered?.value);
      isRecIncreased = recDiffFromYesterday < recDiffFromToday;
      recDifference = recDiffFromToday - recDiffFromYesterday;

      confirmedDiffFromYesterday =
        Number(threeStats?.confirmed) - Number(twoStats?.confirmed);
      confirmedDiffFromToday =
        Number(twoStats?.confirmed) - Number(confirmed?.value);
      isConfirmedIncreased =
        confirmedDiffFromYesterday < confirmedDiffFromToday;
      confirmedDifference = confirmedDiffFromToday - confirmedDiffFromYesterday;
    }
  }

  return {
    deathDifference,
    recDifference,
    confirmedDifference,
    isDeathIncreased,
    isRecIncreased,
    isConfirmedIncreased,
    deathDiffFromToday,
    recDiffFromToday,
    confirmedDiffFromToday,
  };
};

export default useDifference;
