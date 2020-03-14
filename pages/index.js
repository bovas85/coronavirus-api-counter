import styled from "styled-components";

import Stats from "../components/Stats";
import CountrySelector from "../components/CountrySelector";

const StatGrid = styled.main`
  @import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
  min-height: 55vh;

  > * {
    font-family: Roboto, sans-serif;
  }
`;

const Heading = styled.header`
  font-family: Roboto, sans-serif;
  font-size: 1.2rem;
  margin: 1rem auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  background: white;
  grid-column: 1 / -1;
`;

const Footer = styled.footer`
  background: white;
  grid-column: 1 / -1;
`;

export default function IndexPage() {
  return (
    <>
      <Heading>
        <h1>Coronavirus API counter</h1>
      </Heading>
      <StatGrid>
        <Stats />
        <CountrySelector />
        <Footer>
          <p>
            Github:{" "}
            <a
              href="https://github.com/bovas85/coronavirus-api-counter"
              target="_blank"
            >
              https://github.com/bovas85/coronavirus-api-counter
            </a>
          </p>
        </Footer>
      </StatGrid>
    </>
  );
}
