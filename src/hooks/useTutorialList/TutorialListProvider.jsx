import React, { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import tutorialListReducer from './tutorialListReducer';
import { getDataFromCache, purgeDataFromCache } from './cacheFunctions';

export const TutorialListContext = createContext(null);

/**
 * Context provider.
 *
 * Provides:
 * - list: A list of tutorials relative to the current user.
 *   See cacheFunctions().
 * - dispatch: A reducer that can be used to perform operations on the list of
 *   tutorials.
 *   See tutorialListReducer().
 */
const TutorialListProvider = ({ children, currentUserId }) => {
  const initialState = { list: null };
  const [list, dispatch] = useReducer(tutorialListReducer, initialState);
  const [previousUserId, setUserId] = useState(null);

  // On render we load the list of tutorials from the cache. And initialize new
  // state values with that list. Bind this to the currentUserId and that way
  // if it changes we can refresh the list.
  useEffect(() => {
    // If currentUserId is null then we just dont' know enough about the user
    // yet.
    if (currentUserId !== null) {
      // Keep track of the user for later.
      setUserId(currentUserId);

      // If the currentUserId changes that means someone just logged out, or in,
      // and we should purge the cache.
      if (currentUserId !== previousUserId && previousUserId !== null) {
        purgeDataFromCache();
      }

      getDataFromCache().then(data => dispatch({ type: 'initialize', data }));
    }
  }, [currentUserId]);

  return (
    <TutorialListContext.Provider value={{ list, dispatch }}>
      {children}
    </TutorialListContext.Provider>
  );
};

TutorialListProvider.propTypes = {
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
};

export default TutorialListProvider;
