import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import DropDownHeader from "~/components/DropdownHeader";
import "~/styles/root.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Xinyu Feng" },
    { name: "description", content: "Welcome to my page!" },
  ];
};

export default function Index() {
  useEffect(() => {
    // Add your script here
    const script = document.createElement("script");
    script.src =
      "//rf.revolvermaps.com/0/0/8.js?i=5wm*****1mh&m=0&c=ff0000&cr1=ffffff&f=arial&l=33";
    script.async = true;
    // Load the script inside the specific div with the id "mapContainer"
    const mapContainer = document.getElementById("mapContainer");
    if (mapContainer) {
      mapContainer.appendChild(script);
    }
    return () => {
      // Remove the script when the component unmounts
      if (mapContainer && mapContainer.contains(script)) {
        mapContainer.removeChild(script);
      }
    };
  }, []);
  return (
    <div className="container">
      <DropDownHeader />
      <div id="mapContainer"></div>
    </div>
  );
}
