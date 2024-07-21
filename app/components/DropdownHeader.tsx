import { useEffect, useState } from "react";
import styles from "./DropdownHeader.module.css"; // Import CSS module for animation styles

const DropDownHeader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation on component mount
    setIsVisible(true);
  }, []);

  return (
    <h1 className={`${styles.dropDownH1} ${isVisible ? styles.animate : ""}`}>
      Beautiful Home
    </h1>
  );
};

export default DropDownHeader;
