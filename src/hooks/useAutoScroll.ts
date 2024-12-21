import { useCallback, useState, RefObject, useEffect } from 'react';

export const useAutoScroll = (ref: RefObject<HTMLElement>) => {
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref]);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      setIsAtBottom(scrollHeight - scrollTop === clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [ref, handleScroll]);

  return { scrollToBottom, isAtBottom };
};