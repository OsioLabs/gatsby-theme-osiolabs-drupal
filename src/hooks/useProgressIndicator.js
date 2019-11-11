import { useCallback, useState } from 'react';

/**
 * React hook; Manage the progress for a specified tutorial.
 *
 * @param {boolean} initialValue
 *   Initial progress value. TRUE for completed, FALSE for incomplete.
 * @param {int} entityId
 *   ID of the Drupal entity that this progress is being tracked for.
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
export function useProgressIndicator(initialValue, entityId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(initialValue);

  // Create, and return, a function that can be used to update the
  // current progress record.
  const toggleComplete = useCallback(async isComplete => {
    try {
      setLoading(true);
      setError(null);

      // @todo: make this actually call the API. And update the complete value
      // as appropriate.
      const timeout = ms => new Promise(res => setTimeout(res, ms));
      await timeout(2000);
      setComplete(isComplete);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return [{ loading, complete, error }, toggleComplete];
}

export default useProgressIndicator;
