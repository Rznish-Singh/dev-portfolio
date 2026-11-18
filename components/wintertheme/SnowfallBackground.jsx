"use client";

import Snowfall from "react-snowfall";

export default function SnowfallBackground() {
  return (
    <Snowfall
      color="#b8cde8"
      snowflakeCount={50}
      speed={[0.5, 2]}
      radius={[1, 3]}
      wind={[-0.5, 1.5]}
      opacity={[0.4, 0.8]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import Snowfall from "react-snowfall";

// export default function SnowfallBackground() {
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     const paths = [
//       "/snowflakes/snowflake-1.png",
//       "/snowflakes/snowflake-2.png",
//       "/snowflakes/snowflake-3.png",
//       "/snowflakes/snowflake-4.png",
//     ];

//     const loadedImages = paths.map((path) => {
//       const img = new Image();
//       img.src = path;
//       return img;
//     });

//     Promise.all(
//       loadedImages.map(
//         (img) =>
//           new Promise((resolve) => {
//             if (img.complete && img.naturalWidth > 0) {
//               resolve(img);
//             } else {
//               img.onload = () => resolve(img);
//               img.onerror = () => resolve(null);
//             }
//           })
//       )
//     ).then((result) => {
//       setImages(result.filter(Boolean));
//     });
//   }, []);

//   return (
//     <Snowfall
//       images={images.length ? images : undefined}
//       snowflakeCount={100}
//       radius={[8, 18]}
//       speed={[0.5, 2]}
//       wind={[-0.5, 1.5]}
//       rotationSpeed={[-0.5, 0.5]}
//       opacity={[0.35, 0.8]}
//       style={{
//         position: "fixed",
//         inset: 0,
//         width: "100%",
//         height: "100%",
//         pointerEvents: "none",
//         zIndex: 50,
//       }}
//     />
//   );
// }
