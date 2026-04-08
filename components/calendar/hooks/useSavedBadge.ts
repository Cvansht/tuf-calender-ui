import { useEffect, useRef, useState } from "react";

export const useSavedBadge = (value: string) => {
  const [visible, setVisible] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    setVisible(false);

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 800);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [value]);

  return visible;
};
