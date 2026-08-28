import { useEffect, useState } from "react";

export function useTypewriter(words, typingSpeed = 80, pause = 1300) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const complete = text === word;
    const empty = text.length === 0;
    const delay = deleting ? typingSpeed / 2 : complete ? pause : typingSpeed;

    const id = setTimeout(() => {
      if (deleting) {
        if (empty) {
          setDeleting(false);
          setIndex((current) => (current + 1) % words.length);
        } else {
          setText((current) => current.slice(0, -1));
        }
        return;
      }

      if (complete) {
        setDeleting(true);
      } else {
        setText((current) => word.slice(0, current.length + 1));
      }
    }, delay);

    return () => clearTimeout(id);
  }, [text, index, deleting, words, typingSpeed, pause]);

  return { text, index };
}
