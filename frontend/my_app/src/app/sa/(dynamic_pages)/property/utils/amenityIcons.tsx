import { FaWifi, FaSwimmingPool, FaParking, FaSnowflake } from "react-icons/fa";
import { GiHomeGarage, GiLift, GiFireplace } from "react-icons/gi";
import { MdOutdoorGrill, MdBalcony } from "react-icons/md";
import { LuLamp } from "react-icons/lu";
import { FcElectricity } from "react-icons/fc";
import { FaHandSparkles } from "react-icons/fa6";
import type { ReactNode } from "react";


export const amenityIcons: Record<string, ReactNode> = {
  "WiFi": <FaWifi className="text-xl text-gray-700" />,
  "Swimming Pool": <FaSwimmingPool className="text-xl text-blue-600" />,
  "Parking": <FaParking className="text-xl text-gray-700" />,
  "Garage": <GiHomeGarage className="text-xl text-gray-700" />,
  "Air Conditioning": <FaSnowflake className="text-xl text-blue-500" />,
  "Elevator": <GiLift className="text-xl text-gray-700" />,
  "Fireplace": <GiFireplace className="text-xl text-orange-500" />,
  "Outdoor Grill": <MdOutdoorGrill className="text-xl text-gray-700" />,
  "Balcony": <MdBalcony className="text-xl text-gray-700" />,
  "Lighting": <LuLamp className="text-xl text-yellow-600" />,
  "Electricity": <FcElectricity className="text-xl text-gray-600" />,
  "Sanitation": <FaHandSparkles className="text-xl text-gray-600" />,
};
