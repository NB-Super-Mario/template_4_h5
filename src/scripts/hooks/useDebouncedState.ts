import { useState } from 'react';
import { useDebounce } from './useDebounce';

export const useDebouncedState = (initialState, durationInMs = 200) => {
  const [internalState, setInternalState] = useState(initialState);
  const debouncedFunction = useDebounce(setInternalState, durationInMs);
  return [internalState, debouncedFunction];
};

export default useDebouncedState;
