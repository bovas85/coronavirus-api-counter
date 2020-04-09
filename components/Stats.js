import { useState, useMemo, useCallback, useEffect } from "react";

import useStats from "../utils/useStats";
import styled from "styled-components";

/* local styles ---------- */
const StatBlock = styled.div`
  background: #fafafa;
  box-shadow: 1px 1px 6px 1px grey;
  font-size: 1.6rem;
  padding: 20px;
  grid-gap: 1rem;
`;

const Difference = styled.p`
  font-size: 0.9rem;
  color: ${({ color = "crimson" }) => color};
`;
// ------------------------------------------

// date - 1/2 days
const yesterday = new Date(Date.now() - 864e5);
const twoAgo = new Date(Date.now() - 864e5 * 2);

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dtfPretty = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
// dates for API
const [{ value: mm }, , { value: dd }, , { value: yr }] = dtf.formatToParts(
  yesterday
);
const [{ value: mm2 }, , { value: dd2 }, , { value: yr2 }] = dtf.formatToParts(
  twoAgo
);

// pretty date to display
const [
  { value: mm3 },
  ,
  { value: dd3 },
  ,
  { value: yr3 },
] = dtfPretty.formatToParts(twoAgo);

const yesterdayUrl = `https://covid19.mathdro.id/api/daily/${mm}-${dd}-${yr}`;
const twoAgoUrl = `https://covid19.mathdro.id/api/daily/${mm2}-${dd2}-${yr2}`;

let yesterdayDate = `${dd3} ${mm3}`;
// grab suffix for day
switch (dd3) {
  case 1:
    yesterdayDate = `${dd3}st ${mm3}`;
  case 2:
    yesterdayDate = `${dd3}nd ${mm3}`;
  case 3:
    yesterdayDate = `${dd3}rd ${mm3}`;
  default:
    yesterdayDate = `${dd3}th ${mm3}`;
}

export default function Stats({
  countryName,
  url = "https://covid19.mathdro.id/api",
}) {
  const [stats, loading, error] = useStats(url);
  const [yTotalStats, yTotalLoading, yTotalError] = useStats(yesterdayUrl);
  const [yTotalStats2, yTotalLoading2, yTotalError2] = useStats(twoAgoUrl);
  const [yStats, setYstats] = useState({});
  const [twoStats, setTwostats] = useState({});

  const searchStats = () => {
    if (!yTotalStats || !yTotalStats2) return;
    const res = yTotalStats.find((stat) => {
      return stat.combinedKey === countryName;
    });
    setYstats(res);
    const res2 = yTotalStats2.find((stat) => {
      return stat.combinedKey === countryName;
    });
    setTwostats(res2);
  };

  useMemo(searchStats, [yTotalStats, yTotalStats2, countryName]);

  if (error) return <p>Error fetching: {error}</p>;
  if (!stats || loading) return <p>Loading...</p>;

  const { confirmed, recovered, deaths } = stats;
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

  let confPerDay, recPerDay, deathPerDay;
  if (yStats && twoStats) {
    deathDiffFromYesterday = Number(yStats?.deaths) - Number(twoStats?.deaths);
    deathDiffFromToday = Number(deaths?.value) - Number(twoStats?.deaths);
    isDeathIncreased = deathDiffFromYesterday < deathDiffFromToday;
    deathDifference = deathDiffFromYesterday - deathDiffFromToday;

    recDiffFromYesterday =
      Number(yStats?.recovered) - Number(twoStats?.recovered);
    recDiffFromToday = Number(recovered?.value) - Number(twoStats?.recovered);
    isRecIncreased = recDiffFromYesterday < recDiffFromToday;
    recDifference = recDiffFromYesterday - recDiffFromToday;

    confirmedDiffFromYesterday =
      Number(yStats?.confirmed) - Number(twoStats?.confirmed);
    confirmedDiffFromToday =
      Number(confirmed?.value) - Number(twoStats?.confirmed);
    isConfirmedIncreased = confirmedDiffFromYesterday > confirmedDiffFromToday;
    confirmedDifference = confirmedDiffFromYesterday - confirmedDiffFromToday;
  }
  return (
    <>
      <StatBlock>
        <p>Confirmed: {confirmed?.value}</p>
        {Number(confirmedDifference) !== "NaN" && (
          <Difference
            color={
              isConfirmedIncreased || confirmedDifference === 0
                ? "green"
                : "crimson"
            }
          >
            {typeof confirmedDifference === "number" &&
            confirmedDifference !== 0
              ? `${
                  confirmedDifference < 0
                    ? `Increased by ${
                        confirmedDifference * -1
                      } for a total of ${confirmedDiffFromToday} per day*`
                    : `Decreased by ${confirmedDifference} per day*`
                }`
              : confirmedDifference === 0 && `Same as yesterday`}
          </Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Recovered: {recovered?.value}</p>
        {Number(recDifference) !== "NaN" && (
          <Difference
            color={!isRecIncreased || recDifference === 0 ? "green" : "crimson"}
          >
            {typeof recDifference === "number" && recDifference !== 0
              ? `${
                  recDifference < 0
                    ? `Decreased by ${recDifference * -1} per day*`
                    : `Increased by ${recDifference} per day*`
                }`
              : recDifference === 0 && `Same as yesterday`}
          </Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Deaths: {deaths?.value}</p>
        {Number(deathDifference) !== "NaN" && (
          <Difference color={isDeathIncreased ? "crimson" : "green"}>
            {typeof deathDifference === "number" && deathDifference !== 0
              ? `${
                  deathDifference > 0
                    ? `Decreased by ${deathDifference} per day*`
                    : `Increased by ${
                        deathDifference * -1
                      } for a total of ${deathDiffFromToday} per day*`
                }`
              : deathDifference === 0 && `Same as yesterday`}
          </Difference>
        )}
      </StatBlock>
    </>
  );
}
