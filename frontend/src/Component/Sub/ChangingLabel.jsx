import { useEffect, useState } from "react";

const ChangingLabel = ({ words, inter = 300 , con = "" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, inter);

    return () => clearInterval(interval);
  }, [words, inter]);

  return (
    <span className="text-indigo-600 font-bold text-2xl">
      
      {`${con} ${words[index]}`}
    </span>
  );
};

export default ChangingLabel;
