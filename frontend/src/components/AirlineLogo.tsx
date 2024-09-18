import { useState, useEffect } from "react";

interface AirlineLogoProps {
  airlineName: string;
}

export default function AirlineLogo({ airlineName }: AirlineLogoProps) {
  const [airlineLogo, setAirlineLogo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAirlinesData = async () => {
      try {
        const response = await fetch("/airlines.json");
        const airlinesData = await response.json();

        const upperCaseAirlineName = airlineName.toUpperCase();

        const airline = airlinesData.find(
          (a: { name: string }) => a.name.toUpperCase() === upperCaseAirlineName
        );

        if (airline) {
          setAirlineLogo(airline.logo);
        } else {
          setAirlineLogo("/vercel.svg");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching airline data:", error);
        setLoading(false);
      }
    };

    fetchAirlinesData();
  }, [airlineName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {airlineLogo ? (
        <img src={airlineLogo} alt={airlineName} className="w-12 h-12 rounded-lg"/>
      ) : (
        <p>Logo not available</p>
      )}
    </div>
  );
}
