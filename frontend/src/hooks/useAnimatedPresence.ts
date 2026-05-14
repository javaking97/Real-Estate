import React from 'react';

export type PopoverTransitionStatus = 'closed' | 'opening' | 'open' | 'close';

export function useAnimatedPresence(open: boolean, closeDuration = 90) {
  const [transitionStatus, setTransitionStatus] = React.useState<PopoverTransitionStatus>(open ? 'opening' : 'closed');
  const closeTimerRef = React.useRef<number | null>(null);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const clearTimers = () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    clearTimers();

    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Animation state machine requires immediate state transition
      setTransitionStatus('opening');
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = window.requestAnimationFrame(() => {
          setTransitionStatus('open');
          frameRef.current = null;
        });
      });

      return clearTimers;
    }

    setTransitionStatus((currentStatus) => {
      if (currentStatus === 'closed') {
        return currentStatus;
      }

      closeTimerRef.current = window.setTimeout(() => {
        setTransitionStatus('closed');
        closeTimerRef.current = null;
      }, closeDuration);

      return 'close';
    });

    return clearTimers;
  }, [open, closeDuration]);

  const presenceState: 'opening' | 'closing' = transitionStatus === 'close' ? 'closing' : 'opening';

  return {
    present: transitionStatus !== 'closed',
    presenceState,
    transitionStatus,
  };
}
