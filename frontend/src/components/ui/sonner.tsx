import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-center"
      richColors
      closeButton
      toastOptions={{
        duration: 3200,
        style: {
          fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          fontSize: '13px',
        },
      }}
      {...props}
    />
  );
}
