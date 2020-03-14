import { useState, useCallback, useEffect } from "react";

export default function useStats(url = "https://covid19.mathdro.id/api") {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError();
    const data = await fetch(url)
      .then(async res => {
        const json = await res.json();
        if (json.error) {
          setError(json.error.message);
          setStats();
          return;
        }
        return json;
      })
      .catch(error => {
        setError(error.message);
      });
    setStats(data);
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [url]);
  return [stats, loading, error];
}
