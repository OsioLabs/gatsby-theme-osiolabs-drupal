import { useEffect, useState } from 'react';
import { useTutorialList } from './useTutorialList';

/**
 * React hook; Manage the progress for a specified tutorial.
 *
 * @param {boolean} initialValue
 *   Initial progress value. TRUE for completed, FALSE for incomplete.
 * @param {string} entityId
 *   UUID of the Drupal entity that this progress is being tracked for.
 * @param {string} userId
 *   UUID of the Drupal user that this progress is being tracked for.
 * @returns []
 *   An array with an object representing stateful information about the
 *   progress including:
 *   - loading {boolean}: TRUE if the status is currently being updated.
 *   - complete {boolean}: TRUE if the current user has completed this
 *     tutorial.
 *   - error {mixed}: Any errors returned while processing an update.
 *  And an instance of the toggleComplete() function bound to this hooks
 *  state. Used to make updates to the progress record.
 */
export default function useProgressIndicator(initialValue, entityId, userId) {
  const [list, listDispatch] = useTutorialList();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(initialValue);

  // If the progress indicator is initialized without value for complete
  // indicate that we're working on figuring it out.
  if (complete === null && loading === false) {
    setLoading(true);
  }

  function userReadState() {
    if (list.list !== null && typeof list.list[entityId] !== 'undefined' && typeof list.list[entityId].tutorial_read_state !== 'undefined') {
      return list.list[entityId].tutorial_read_state;
    }

    return null;
  }

  // Then see if we can figure out what the value should be.
  useEffect(() => {
    if (list.list !== null && typeof list.list[entityId] !== 'undefined') {
      const newState = list.list[entityId].tutorial_read_state === 'Read';
      setComplete(newState);
      setLoading(false);
    }
  }, [userReadState()]);

  const markAsRead = () => {
    setComplete(true);
    listDispatch({
      type: 'update',
      data: {
        id: entityId,
        value: {
          ...list.list[entityId],
          tutorial_read_state: 'Read',
        },
      },
    });
  };

  const markAsUnread = () => {
    setComplete(false);
    listDispatch({
      type: 'update',
      data: {
        id: entityId,
        value: {
          ...list.list[entityId],
          tutorial_read_state: 'Unread',
        },
      },
    });
  };

  return [{ loading, complete }, markAsRead, markAsUnread];
}
