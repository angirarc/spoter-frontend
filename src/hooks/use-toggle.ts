import * as React from 'react';

const useToggle = (
  initialState: boolean = false,
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [state, setState] = React.useState<boolean>(initialState);

  const toggle: () => void | undefined = React.useCallback(() => setState((state) => !state), []);

  return [state, toggle, setState];
};

export default useToggle;