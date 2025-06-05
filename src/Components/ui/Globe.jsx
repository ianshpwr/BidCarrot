"use client";

import { useEffect, useRef, useState } from "react"; // ✅ Import useState
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

const Globe = ({
  // Remove default width and height if you want it to be truly dynamic based on parent
  // width = 600,
  // height = 600,
  markers = [
    { location: [37.7595, -122.4367], size: 0.03 },
    { location: [40.7128, -74.006], size: 0.1 },
  ],
  className = "",
  baseColor = [0.3, 0.3, 0.3],
  markerColor = [0.1, 0.8, 1],
  glowColor = [1, 1, 1],
  mapBrightness = 6,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // ✅ Ref for the container div
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 }); // ✅ State for dynamic size

  useEffect(() => {
    // Function to update the globe size based on container
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Assuming you want a square globe, take the minimum of width and height
        const size = Math.min(clientWidth, clientHeight);
        setGlobeSize({ width: size, height: size });
      }
    };

    // Initial size setting
    updateSize();

    // Add event listener for window resize
    window.addEventListener("resize", updateSize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", updateSize);
  }, []); // Run once on mount to set up the listener

  useEffect(() => {
    let phi = 0;

    // Only create globe if dimensions are available and canvasRef is valid
    if (!canvasRef.current || globeSize.width === 0 || globeSize.height === 0)
      return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: globeSize.width * 2, // Use dynamic width
      height: globeSize.height * 2, // Use dynamic height
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness,
      baseColor,
      markerColor,
      glowColor,
      markers,
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => globe.destroy();
  }, [
    globeSize.width, // ✅ Dependency on dynamic width
    globeSize.height, // ✅ Dependency on dynamic height
    markers,
    baseColor,
    markerColor,
    glowColor,
    mapBrightness,
  ]);

  return (
    <div
      ref={containerRef} // ✅ Assign ref to the container
      className={cn(
        "flex items-center justify-center w-full h-full my-40",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: globeSize.width, // Use dynamic width for style
          height: globeSize.height, // Use dynamic height for style
          maxWidth: "100%",
          aspectRatio: 1,
        }}
        className="pointer-events-none"
      />
    </div>
  );
};

export default Globe;