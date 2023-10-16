import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <DndProvider backend={HTML5Backend}>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#43ED3f',
          borderRadius: 2,

          // Alias Token
          colorBgContainer: '#f6ffed',
        },
      }}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ConfigProvider>
  </DndProvider>
)
