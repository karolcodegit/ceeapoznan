import React from "react"

const Notification = ({ message, type, showMessage, index }) => {
  const isSuccess = type === 'success';
  const topPosition = 100 + index * 60; // 20px odstępu między powiadomieniami
  const notificationClasses = `fixed right-0 shadow-2xl rounded-lg ring-black ring-offset-0 drop-shadow-lg bg-${
    isSuccess ? 'green' : 'red'
  }-100 text-${isSuccess ? 'green' : 'red'}-800 transition-transform duration-300 ease-in-out`;

  const getIcon = () => {
    if (isSuccess) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
          className="w-6 h-6 text-green-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
          className="w-6 h-6 text-red-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      );
    }
  };

  return (
    <>
      {showMessage && (
        <div className={notificationClasses} style={{ top: `${topPosition}px` }}>
          <div className="flex p-4">
            <div className="items-center flex">
              <div className="shrink-0 pr-4">{getIcon()}</div>
              <div>
                <p>{message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;