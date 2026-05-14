import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer as DrawerPrimitive } from 'vaul';
import { AppIcons } from '@/components/icons/AppIcons';

type DetailDrawerProps = {
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  width?: number | string;
};

const DETAIL_DRAWER_CLOSE_DURATION = 170;

export function DetailDrawer({
  children,
  open,
  onClose,
  title,
  subtitle,
  width = 500,
}: DetailDrawerProps) {
  const navigate = useNavigate();
  const [closeRequested, setCloseRequested] = React.useState(false);
  const closeTimerRef = React.useRef<number | null>(null);
  const drawerOpen = open && !closeRequested;

  const navigateAfterClose = React.useCallback(() => {
    closeTimerRef.current = null;

    if (onClose) {
      onClose();
    } else {
      navigate('../');
    }
  }, [navigate, onClose]);

  const requestClose = React.useCallback(() => {
    setCloseRequested(true);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(
      navigateAfterClose,
      DETAIL_DRAWER_CLOSE_DURATION,
    );
  }, [navigateAfterClose]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        if (closeTimerRef.current) {
          window.clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }

        setCloseRequested(false);
        return;
      }

      requestClose();
    },
    [requestClose],
  );

  React.useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  return (
    <DrawerPrimitive.Root
      direction="right"
      open={drawerOpen}
      onOpenChange={handleOpenChange}
      handleOnly
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay
          className="detail-drawer-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(0,0,0,0.3)',
          }}
        />
        <DrawerPrimitive.Content
          className="detail-drawer-container"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 401,
            width: width,
            maxWidth: '90vw',
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ flex: 1 }}>
              <DrawerPrimitive.Title
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--color-fg)',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </DrawerPrimitive.Title>
              {subtitle ? (
                <DrawerPrimitive.Description
                  style={{
                    fontSize: 13,
                    color: 'var(--color-muted)',
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  {subtitle}
                </DrawerPrimitive.Description>
              ) : null}
            </div>
            <button
              type="button"
              onClick={requestClose}
              style={{
                background: 'var(--color-bg)',
                border: 'none',
                borderRadius: 8,
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-muted)',
                transition: 'all 0.1s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = 'var(--color-border)')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = 'var(--color-bg)')
              }
            >
              {AppIcons.x}
            </button>
          </div>
          <div
            className="detail-drawer-content-wrap"
            style={{ flex: 1, overflowY: 'auto', padding: '24px' }}
          >
            {children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
