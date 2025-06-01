import { useEffect } from 'react';

const useCustomTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default useCustomTitle;
