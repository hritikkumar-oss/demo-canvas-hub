# BottomAlert Component

A polished, accessible bottom notification component with support for four variants: Success, Error, Warning, and Info.

## Features

- 🎨 **Four variants** with distinct colors and icons
- 📱 **Mobile-first responsive design**
- ♿ **Fully accessible** with ARIA labels and keyboard support
- ⏰ **Auto-dismiss** with pause on hover/focus
- 🎭 **Smooth animations** (slide up + fade in/out)
- ⌨️ **Keyboard support** (Esc to close)
- 🎯 **Three placement options** (center, left, right)

## Usage

```jsx
import { BottomAlert } from '@/components/BottomAlert';
import { useState } from 'react';

function MyComponent() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <button onClick={() => setShowAlert(true)}>
        Show Success Alert
      </button>

      <BottomAlert
        variant="success"
        title="Payment Successful"
        message="Your payment has been successfully received. You have unlocked premium service now."
        visible={showAlert}
        autoDismiss={6}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | ✅ | - | Alert variant with specific colors and icons |
| `title` | `string` | ✅ | - | Alert title (bold, prominent) |
| `message` | `string` | ✅ | - | Alert message body (regular weight) |
| `visible` | `boolean` | ✅ | - | Controls alert visibility |
| `onClose` | `() => void` | ✅ | - | Callback when alert is dismissed |
| `autoDismiss` | `number \| false` | ❌ | `6` for success/info, `false` for error/warning | Auto-dismiss delay in seconds |
| `placement` | `'bottom-center' \| 'bottom-left' \| 'bottom-right'` | ❌ | `'bottom-center'` | Alert positioning |

## Variants

### Success
- **Use for**: Successful operations, confirmations
- **Colors**: Mint green palette
- **Icon**: CheckCircle
- **Auto-dismiss**: 6 seconds (default)

```jsx
<BottomAlert
  variant="success"
  title="Settings Saved"
  message="Your preferences have been updated successfully."
  visible={showSuccess}
  onClose={() => setShowSuccess(false)}
/>
```

### Error
- **Use for**: Errors, failures, critical issues
- **Colors**: Rose red palette
- **Icon**: AlertCircle
- **Auto-dismiss**: None (persistent until closed)

```jsx
<BottomAlert
  variant="error"
  title="Upload Failed"
  message="The file could not be uploaded. Please check your connection and try again."
  visible={showError}
  onClose={() => setShowError(false)}
/>
```

### Warning
- **Use for**: Warnings, cautionary messages
- **Colors**: Amber yellow palette
- **Icon**: AlertTriangle
- **Auto-dismiss**: None (persistent until closed)

```jsx
<BottomAlert
  variant="warning"
  title="Storage Almost Full"
  message="You're running out of storage space. Consider upgrading your plan."
  visible={showWarning}
  onClose={() => setShowWarning(false)}
/>
```

### Info
- **Use for**: Information, tips, neutral notifications
- **Colors**: Sky blue palette
- **Icon**: Info
- **Auto-dismiss**: 6 seconds (default)

```jsx
<BottomAlert
  variant="info"
  title="New Feature Available"
  message="Check out our new dashboard analytics in the sidebar menu."
  visible={showInfo}
  onClose={() => setShowInfo(false)}
/>
```

## Advanced Usage

### Custom Auto-dismiss
```jsx
<BottomAlert
  variant="success"
  title="Quick Notification"
  message="This will disappear in 3 seconds."
  visible={show}
  autoDismiss={3}
  onClose={() => setShow(false)}
/>
```

### Persistent Notification
```jsx
<BottomAlert
  variant="info"
  title="Important Update"
  message="This notification stays until manually closed."
  visible={show}
  autoDismiss={false}
  onClose={() => setShow(false)}
/>
```

### Different Placement
```jsx
<BottomAlert
  variant="warning"
  title="Connection Issue"
  message="Experiencing slow network connection."
  visible={show}
  placement="bottom-right"
  onClose={() => setShow(false)}
/>
```

## Accessibility Features

- **ARIA roles**: `status` for success/info, `alert` for error/warning
- **Live regions**: Proper `aria-live` attributes for screen readers
- **Keyboard navigation**: Esc key closes the alert
- **Focus management**: Automatic focus on interactive elements
- **Touch targets**: Minimum 40x40px touch targets
- **Color contrast**: WCAG AA compliant color combinations

## Styling

The component uses CSS custom properties for colors, making it easy to customize:

```css
:root {
  --alert-success-bg: 158 74% 94%;
  --alert-success-title: 158 75% 38%;
  --alert-success-body: 158 66% 33%;
  --alert-success-icon: 158 93% 53%;
  /* ... similar for error, warning, info */
}
```

## Animation Details

- **Entrance**: Slide up 8px + fade in over 240ms with smooth easing
- **Exit**: Slide down 8px + fade out over 180ms
- **Hover pause**: Auto-dismiss timer pauses when hovering or focused
- **Resume**: Timer resumes with remaining time when hover ends