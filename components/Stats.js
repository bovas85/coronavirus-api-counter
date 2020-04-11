import { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";

import useDifference from "../utils/useDifference";
import useStats from "../utils/useStats";

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
  color: ${({ coloursEnabled, color = "crimson" }) =>
    coloursEnabled ? color : "black"};
`;
// ------------------------------------------

// date - 1/2 days
const yesterday = new Date(Date.now() - 864e5);
const twoAgo = new Date(Date.now() - 864e5 * 2);
const threeAgo = new Date(Date.now() - 864e5 * 3);

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
const [{ value: mm4 }, , { value: dd4 }, , { value: yr4 }] = dtf.formatToParts(
  threeAgo
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
const threeAgoUrl = `https://covid19.mathdro.id/api/daily/${mm4}-${dd4}-${yr4}`;

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
  coloursEnabled = true,
}) {
  const [stats, loading, error] = useStats(url);
  const [yTotalStats, yTotalLoading, yTotalError] = useStats(yesterdayUrl);
  const [yTotalStats2, yTotalLoading2, yTotalError2] = useStats(twoAgoUrl);
  const [yTotalStats3, yTotalLoading3, yTotalError3] = useStats(threeAgoUrl);
  const [yStats, setYstats] = useState({});
  const [twoStats, setTwostats] = useState({});
  const [threeStats, setThreestats] = useState({});

  const searchStats = () => {
    if (!yTotalStats || !yTotalStats2 || !yTotalStats3) return;
    const res = yTotalStats.find((stat) => {
      return stat.combinedKey === countryName;
    });
    setYstats(res);
    const res2 = yTotalStats2.find((stat) => {
      return stat.combinedKey === countryName;
    });
    setTwostats(res2);
    const res3 = yTotalStats3.find((stat) => {
      return stat.combinedKey === countryName;
    });
    setThreestats(res3);
  };

  useMemo(searchStats, [yTotalStats, yTotalStats2, yTotalStats3, countryName]);

  if (error) return <p>Error fetching: {error}</p>;
  if (!stats || loading) return <p>Loading...</p>;

  const { confirmed, recovered, deaths } = stats;

  const {
    deathDifference,
    recDifference,
    confirmedDifference,
    isDeathIncreased,
    isRecIncreased,
    isConfirmedIncreased,
    deathDiffFromToday,
    recDiffFromToday,
    confirmedDiffFromToday,
  } = useDifference(stats, yStats, twoStats, threeStats);

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
            coloursEnabled={coloursEnabled}
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
              : confirmedDifference === 0 &&
                coloursEnabled &&
                `Same as yesterday`}
          </Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Recovered: {recovered?.value}</p>
        {Number(recDifference) !== "NaN" && (
          <Difference
            color={!isRecIncreased || recDifference === 0 ? "crimson" : "green"}
            coloursEnabled={coloursEnabled}
          >
            {typeof recDifference === "number" && recDifference !== 0
              ? `${
                  recDifference < 0
                    ? `Decreased by ${recDifference * -1} per day*`
                    : `Increased by ${recDifference} per day*`
                }`
              : recDifference === 0 && coloursEnabled && `Same as yesterday`}
          </Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Deaths: {deaths?.value}</p>
        {Number(deathDifference) !== "NaN" && (
          <Difference
            color={
              isDeathIncreased && deathDifference !== 0 ? "crimson" : "green"
            }
            coloursEnabled={coloursEnabled}
          >
            {typeof deathDifference === "number" && deathDifference !== 0
              ? `${
                  deathDifference > 0
                    ? `Decreased by ${deathDifference} per day*`
                    : `Increased by ${deathDifference * -1} for a total of ${
                        deathDiffFromToday * -1
                      } per day*`
                }`
              : deathDifference === 0 && coloursEnabled && `Same as yesterday`}
          </Difference>
        )}
      </StatBlock>
    </>
  );
}
