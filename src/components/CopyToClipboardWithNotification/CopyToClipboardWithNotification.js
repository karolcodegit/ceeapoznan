import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';


const CopyToClipboardWithNotification = ({ text, children }) => {
    return (
      <CopyToClipboard text={text} onCopy={() => toast.success('Numer został skopiowany')}>
        <span style={{ cursor: 'pointer' }}>{children}</span>
      </CopyToClipboard>
    );
};

export default CopyToClipboardWithNotification;