import { useState, useCallback} from 'react';
const useInput = (initialData: any) => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, [])

  return [value, handler, setValue]
}

export default useInput;