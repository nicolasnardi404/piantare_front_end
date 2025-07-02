import React, { useEffect, useState } from "react";
import { Fade } from "@mui/material";

function ScrollTriggeredSection({ children, threshold = 0.3 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, threshold]);

  return (
    <div ref={setElement}>
      <Fade in={isVisible} timeout={1000}>
        <div>{children}</div>
      </Fade>
    </div>
  );
}

export default ScrollTriggeredSection;
