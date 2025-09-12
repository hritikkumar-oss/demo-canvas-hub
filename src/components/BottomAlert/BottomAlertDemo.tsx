import React, { useState } from 'react';
import { BottomAlert } from '../BottomAlert';
import { Button } from '@/components/ui/button';

export const BottomAlertDemo: React.FC = () => {
  const [alerts, setAlerts] = useState({
    success: false,
    error: false,
    warning: false,
    info: false,
  });

  const showAlert = (variant: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [variant]: true }));
  };

  const hideAlert = (variant: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [variant]: false }));
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">BottomAlert Component Demo</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => showAlert('success')}
          className="bg-green-600 hover:bg-green-700"
        >
          Show Success
        </Button>
        
        <Button
          onClick={() => showAlert('error')}
          variant="destructive"
        >
          Show Error
        </Button>
        
        <Button
          onClick={() => showAlert('warning')}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Show Warning
        </Button>
        
        <Button
          onClick={() => showAlert('info')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Show Info
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="font-semibold mb-2">Demo Instructions:</h3>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Click buttons to show different alert variants</li>
          <li>• Success and Info alerts auto-dismiss after 6 seconds</li>
          <li>• Error and Warning alerts persist until manually closed</li>
          <li>• Hover over alerts to pause auto-dismiss timer</li>
          <li>• Press Esc key to close visible alerts</li>
          <li>• Alerts are fully keyboard accessible</li>
        </ul>
      </div>

      {/* Alert Components */}
      <BottomAlert
        variant="success"
        title="Payment Successful"
        message="Your payment has been successfully received. You have unlocked premium service now."
        visible={alerts.success}
        onClose={() => hideAlert('success')}
      />

      <BottomAlert
        variant="error"
        title="Upload Failed"
        message="The file could not be uploaded. Please check your connection and try again."
        visible={alerts.error}
        onClose={() => hideAlert('error')}
      />

      <BottomAlert
        variant="warning"
        title="Storage Almost Full"
        message="You're running out of storage space. Consider upgrading your plan or removing old files."
        visible={alerts.warning}
        onClose={() => hideAlert('warning')}
      />

      <BottomAlert
        variant="info"
        title="New Feature Available"
        message="Check out our new dashboard analytics in the sidebar menu. It provides detailed insights about your usage."
        visible={alerts.info}
        onClose={() => hideAlert('info')}
      />
    </div>
  );
};