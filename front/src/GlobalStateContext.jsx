// GlobalStateContext.js
import React, { createContext, useContext, useState } from 'react';

// Context 생성
const GlobalStateContext = createContext();

// Provider 컴포넌트 생성
export const GlobalStateProvider = ({ children }) => {
  const [serverIP, setServerIP] = useState('http://192.168.1.146:9977');
  const [pageMove, setPageMove] = useState(false);
  return (
    <GlobalStateContext.Provider value={{ serverIP, setServerIP, pageMove, setPageMove }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Context 값을 가져오는 커스텀 훅
export const useGlobalState = () => useContext(GlobalStateContext);