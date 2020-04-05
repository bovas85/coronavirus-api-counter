import { useState, useCallback, useEffect } from "react";

export default function useCountryFinder(countries = {}, name = "GB") {
  const countryName = countries?.countries.find(
    (country) => name === country.iso2
  );
  return countryName;
}
