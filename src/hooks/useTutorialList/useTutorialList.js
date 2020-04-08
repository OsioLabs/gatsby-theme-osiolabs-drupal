import { useContext } from 'react';
import { TutorialListContext } from './TutorialListProvider';

/**
 * Hook; Get a list of tutorials and a reducer for managing the list.
 *
 * See <TutorialListProvider />.
 *
 * @returns {[object, function]}
 */
const useTutorialList = () => {
  const { list, dispatch } = useContext(TutorialListContext);
  return [list, dispatch];
};

export default useTutorialList;
