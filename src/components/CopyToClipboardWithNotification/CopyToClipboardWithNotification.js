import React, { useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import NotificationContext from '../Notification/NotificationContext';


const CopyToClipboardWithNotification = ({ text, children }) => {
    const showNotification = useContext(NotificationContext);

    return (
      <CopyToClipboard text={text} onCopy={() => showNotification('Numer został skopiowany', 'success')}>
        <span style={{ cursor: 'pointer' }}>{children}</span>
      </CopyToClipboard>
    );
};

export default CopyToClipboardWithNotification;