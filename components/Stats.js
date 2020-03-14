import useStats from "../utils/useStats";
import styled from "styled-components";

const StatBlock = styled.div`
  background: #fafafa;
  box-shadow: 1px 1px 6px 1px grey;
  font-size: 1.6rem;
  padding: 20px;
  grid-gap: 1rem;
`;

export default function Stats({ url = "https://covid19.mathdro.id/api" }) {
  const [stats, loading, error] = useStats(url);
  if (error) return <p>Error fetching: {error}</p>;
  if (!stats || loading) return <p>Loading...</p>;
  const { confirmed, recovered, deaths } = stats;
  return (
    <>
      <StatBlock>
        <p>Confirmed: {confirmed?.value}</p>
      </StatBlock>
      <StatBlock>
        <p>Recovered: {recovered?.value}</p>
      </StatBlock>
      <StatBlock>
        <p>Deaths: {deaths?.value}</p>
      </StatBlock>
    </>
  );
}
