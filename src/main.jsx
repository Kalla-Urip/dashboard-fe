import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import idID from 'antd/locale/id_ID';
import pallete from './utils/pallete.js';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      locale={idID}
      // drawer={{ 
      //   styles: {
      //     wrapper:{
      //       margin: 15,
      //     },
      //     content: {
      //       borderRadius: 8
      //     }
      //   }
      // }}
      theme={{
        token: {
          colorPrimary: pallete.primary.main,
          fontFamily: 'Lato',
        },
        components: {
          Button: {
            primaryShadow: false
          },
          Menu: {
            itemColor: pallete.grey[500],
            itemHoverColor: pallete.primary.main,
            collapsedIconSize: 15,
          },
          Table: {
            headerSplitColor: '',
            headerBorderRadius: 0,
          },
          Form: {
            itemMarginBottom: 16,
            verticalLabelMargin: "0 0 -3px 0",
            labelFontSize: 13,
            labelColor: pallete.grey[800],
          },
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
