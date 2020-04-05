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

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "numeric",
  day: "2-digit",
});
const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(
  yesterday
);
const yesterdayUrl = `https://covid19.mathdro.id/api/daily/${da}-${mo}-${ye}`;

export default function Stats({
  countryName,
  url = "https://covid19.mathdro.id/api",
}) {
  const [stats, loading, error] = useStats(url);
  const [yTotalStats, yTotalLoading, yTotalError] = useStats(yesterdayUrl);
  const [yStats, setYstats] = useState({});

  const searchStats = () => {
    if (!yTotalStats) return;
    const res = yTotalStats.find((stat) => {
      return stat.combinedKey === countryName;
    });
    setYstats(res);
  };

  const getYstats = useMemo(searchStats, [yTotalStats, countryName]);

  if (error) return <p>Error fetching: {error}</p>;
  if (!stats || loading) return <p>Loading...</p>;
  const { confirmed, recovered, deaths } = stats;
  let deathDifference = 0,
    recDifference = 0,
    confirmedDifference = 0;
  if (yStats) {
    confirmedDifference = Number(confirmed?.value) - Number(yStats?.confirmed);
    deathDifference = Number(deaths?.value) - Number(yStats?.deaths);
    recDifference = Number(recovered?.value) - Number(yStats?.recovered);
  }
  return (
    <>
      <StatBlock>
        <p>Confirmed: {confirmed?.value}</p>
        {Number(confirmedDifference) && (
          <Difference>+{confirmedDifference} from yesterday</Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Recovered: {recovered?.value}</p>
        {Number(recDifference) && (
          <Difference color="green">+{recDifference} from yesterday</Difference>
        )}
      </StatBlock>
      <StatBlock>
        <p>Deaths: {deaths?.value}</p>
        {Number(deathDifference) && (
          <Difference>+{deathDifference} from yesterday</Difference>
        )}
      </StatBlock>
    </>
  );
}
