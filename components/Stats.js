import { useState, useMemo, useCallback, useEffect } from "react";

import useStats from "../utils/useStats";
import styled from "styled-components";

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

const yesterday = new Date(Date.now() - 864e5);
const twoAgo = new Date(Date.now() - (864e5 * 2));

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "numeric",
  day: "2-digit",
});
const [{ value: mm }, , { value: dd }, , { value: yr }] = dtf.formatToParts(
  yesterday
);
const [{ value: mm2 }, , { value: dd2 }, , { value: yr2 }] = dtf.formatToParts(
  twoAgo
);

const yesterdayUrl = `https://covid19.mathdro.id/api/daily/${dd}-${mm}-${yr}`;
const twoAgoUrl = `https://covid19.mathdro.id/api/daily/${dd2}-${mm2}-${yr2}`;

export default function Stats({
  countryName,
  url = "https://covid19.mathdro.id/api",
}) {
  const [stats, loading, error] = useStats(url);
  const [yTotalStats, yTotalLoading, yTotalError] = useStats(yesterdayUrl);
  const [yTotalStats2, yTotalLoading2, yTotalError2] = useStats(twoAgoUrl);
  const [yStats, setYstats] = useState({});
  const [twoStats, setTwostats] = useState({});

  if (error) return <p>Error fetching: {error}</p>;
  if (!stats || loading) return <p>Loading...</p>;

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

  const { confirmed, recovered, deaths } = stats;
  let deathDifference = 0,
    recDifference = 0,
    confirmedDifference = 0;
  if (yStats && twoStats) {
    confirmedDifference = Number(yStats?.confirmed) - Number(twoStats?.confirmed);
    deathDifference = Number(yStats?.deaths) - Number(twoStats?.deaths);
    recDifference = Number(yStats?.recovered) - Number(twoStats?.recovered);
  }
  return (
    <>
      <StatBlock>
        <p>Confirmed: {confirmed?.value}</p>
        {!!Number(confirmedDifference) && (
          <Difference>{confirmedDifference} difference</Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Recovered: {recovered?.value}</p>
        {!!Number(recDifference) && (
          <Difference color={Number(recDifference) > 0 ? 'green' : null}>{recDifference} difference</Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Deaths: {deaths?.value}</p>
        {!!Number(deathDifference) && (
          <Difference color={Number(deathDifference) < 0 ? 'green' : null}>{deathDifference} difference</Difference>
        )}
      </StatBlock>
    </>
  );
}
