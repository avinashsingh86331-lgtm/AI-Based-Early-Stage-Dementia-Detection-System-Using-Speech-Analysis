import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const lerp = (start, end, amt) => start + (end - start) * amt;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.14);
      ringY = lerp(ringY, mouseY, 0.14);
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // We use event delegation for dynamic elements

    const addHover = () => {
      dot.classList.add("hover");
      ring.classList.add("hover");
    };
    const removeHover = () => {
      dot.classList.remove("hover");
      ring.classList.remove("hover");
    };

    // We use event delegation for dynamic elements
    const onMouseOver = (e) => {
      if (e.target.closest('button, a, input, textarea, [role="button"], select, label')) {
        addHover();
      }
    };
    const onMouseOut = (e) => {
      if (e.target.closest('button, a, input, textarea, [role="button"], select, label')) {
        removeHover();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
