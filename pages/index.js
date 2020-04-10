import styled from "styled-components";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";

import Stats from "../components/Stats";
import CountrySelector from "../components/CountrySelector";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 16px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body, h1, h2, h3, h4, h5, h6, p, ol, ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  ol, ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

const StatGrid = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
  display: grid;
  max-width: 100%;
  width: 100%;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  min-height: 55vh;
  margin: 0 auto;
  margin-bottom: 1rem;
  padding: 0 0.5rem;

  @media (min-width: 400px) {
    padding: 0 1rem;
    max-width: 1200px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  > * {
    font-family: Roboto, sans-serif;
  }
`;

const Heading = styled.header`
  font-size: 1.2rem;
  margin: 1rem auto;
  width: 100%;
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;

  > h2 {
    margin-right: auto;
  }
`;

const Paragraph = styled.p`
  margin: 0 auto;
  text-align: center;
  grid-column: 1 / -1;
`;

const Container = styled.div`
  background: white;
  grid-column: 1 / -1;
`;

const Footer = styled.footer`
  background: white;
  grid-column: 1 / -1;

  > i {
    font-size: 0.8rem;
    color: #9c6500;
  }
`;

const Link = styled.a`
  color: crimson;
  font-style: italic;
  text-decoration: underline;
`;

export default function IndexPage() {
  return (
    <main role="main">
      <GlobalStyle />
      <Head>
        <title>Coronavirus counter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <StatGrid>
        <Heading>
          <h1>Coronavirus API counter</h1>
        </Heading>
        <Heading>
          <h2>Global view:</h2>
        </Heading>
        <Stats coloursEnabled={false} />
        <CountrySelector />
        <Footer>
          <i>
            *Be aware that this data relies on yesterday's data and might be
            incomplete depending on the time you watch this
          </i>
          <p>
            Github:{" "}
            <Link
              href="https://github.com/bovas85/coronavirus-api-counter"
              target="_blank"
            >
              https://github.com/bovas85/coronavirus-api-counter
            </Link>
          </p>
        </Footer>
      </StatGrid>
    </main>
  );
}
