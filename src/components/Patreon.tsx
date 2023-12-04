// components/PatreonButton.tsx

import React from "react";
import Image from "next/image";
import patreonLogo from "../../public/assets/img/logos/patreon.png";

// You can adjust the styles as per your requirement
const styles = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    minWidth: "150px",
    backgroundColor: "#FF424D", // Patreon color
    color: "white",
    padding: "10px 15px",
    borderRadius: "4px",
    textDecoration: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  text: {
    marginLeft: "10px",
    fontWeight: 700,
    fontSize: 14,
  },
};

const PatreonButton = () => {
  return (
    <div>
      <div className="button-container">
        <a
          href="https://www.patreon.com/bePatron?u=899550"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.button}
          className="kofi-button"
        >
          <Image src={patreonLogo} alt="Patreon Logo" width={15} height={15} />
          <span style={styles.text}>TripSit Patreon</span>
        </a>
      </div>
    </div>
  );
};

export default PatreonButton;
