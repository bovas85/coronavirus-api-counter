import styled from "styled-components";

import Stats from "../components/Stats";
import CountrySelector from "../components/CountrySelector";

const StatGrid = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;

  > * {
    font-family: Roboto, sans-serif;
  }
`;

const Container = styled.div`
  background: white;
  grid-column: 1 / -1;
`;

export default function IndexPage() {
  return (
    <StatGrid>
      <Stats />
      <CountrySelector />
    </StatGrid>
  );
}