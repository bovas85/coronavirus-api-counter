import { useState } from "react";

import useStats from "../utils/useStats";
import Stats from "./Stats";

import styled from "styled-components";

const Container = styled.div`
  background: white;
  grid-column: 1 / -1;
`;

const Button = styled.button`
  padding: 10px 20px;
  min-width: 60px;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: red;
  color: white;
  font-size: 1.5rem;
  display: inline-block;
  margin-right: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: crimson;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const Select = styled.select`
  font-family: Roboto, sans-serif;
  font-size: 1rem;
  padding: 20px;
  background: white;
  height: 40px;
  display: block;
  margin: 10px 0 0;
`;

const getUrl = country => {
  return `https://covid19.mathdro.id/api/countries/${country}`;
};

export default function CountrySelector() {
  const [country, setCountry] = useState(
    "https://covid19.mathdro.id/api/countries/GB"
  );
  const [countries, loading, error] = useStats(
    "https://covid19.mathdro.id/api/countries"
  );

  const handleChange = event => {
    setCountry(getUrl(event.target.value));
  };

  if (!countries || loading) return null;
  if (error) return <p>Error fetching</p>;
  return (
    <>
      <Container>
        <label htmlFor="country-select">Select a country</label>
        <Select
          onChange={handleChange}
          name="country-select"
          id="country-select"
        >
          <option value="">Please choose...</option>
          {Object.keys(countries.countries).map(country => {
            const value = countries.countries[country];
            return (
              <option key={`${country}-${value}`} value={value}>
                {country}
              </option>
            );
          })}
        </Select>
        <p>Or pick a favorite:</p>
        <Button onClick={() => setCountry(getUrl("GB"))}>UK</Button>
        <Button onClick={() => setCountry(getUrl("IT"))}>Italy</Button>
      </Container>
      <Stats url={country} />
    </>
  );
}
