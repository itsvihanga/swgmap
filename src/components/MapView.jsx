import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Mapbox styles
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showButton, setShowButton] = useState(false); // toggle button

  // Initialize map
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [144.9631, -37.8136],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    axios
      .get("http://localhost:5000/api/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));

    return () => map.current.remove();
  }, []);

  // Render markers (address-only filter)
  useEffect(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const filteredProjects = projects.filter((project) =>
      project.address.toLowerCase().includes(searchText.toLowerCase())
    );

    filteredProjects.forEach((project) => {
      const marker = new mapboxgl.Marker({ color: "#e11d48" })
        .setLngLat([project.longitude, project.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>${project.projectName}</strong><br/>
            ${project.address}<br/>
            Status: ${project.status}<br/>
            Year: ${project.year}
          `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [projects, searchText]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* 🔍 SEARCH BAR OVERLAY */}
      <div
        className="d-flex justify-content-center"
        style={{
          position: "absolute",
          top: "20px",
          width: "100%",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "900px", width: "100%", position: "relative" }}>
          <input
            type="text"
            className="form-control text-center"
            placeholder="Search job address..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowButton(true)} // show button when input focused
            onBlur={() => setTimeout(() => setShowButton(false), 200)} // hide after small delay
            style={{
              fontSize: "1.5rem",
              padding: "18px",
              borderRadius: "50px",
            }}
          />

          {/* Pop-up Search Button */}
          {showButton && (
            <button
              className="btn btn-danger"
              style={{
                position: "absolute",
                right: "-110px",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "10px 20px",
                fontSize: "1.2rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                zIndex: 3,
                cursor: "pointer",
              }}
              onMouseDown={(e) => e.preventDefault()} // prevent input blur
            >
              Search
            </button>
          )}
        </div>
      </div>

      {/* 🗺 MAP */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default MapView;
