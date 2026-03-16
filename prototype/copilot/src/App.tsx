import React from 'react';
import { theme } from './styles/theme';
import TopBar from './components/TopBar';
import CustomerPanel from './components/CustomerPanel';
import ConversationPanel from './components/ConversationPanel';
import InsightsPanel from './components/InsightsPanel';

const App: React.FC = () => {
  return (
    <div style={styles.root}>
      {/* Global font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          height: 100%;
          width: 100%;
          overflow: hidden;
          background: ${theme.colors.bg};
          color: ${theme.colors.text};
          font-family: ${theme.fonts.sans};
          font-size: ${theme.fontSize.base};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Scrollbar styling — Bloomberg-style thin bars */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${theme.colors.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${theme.colors.elevated};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.border};
        }

        /* Pulsing animation for live indicators */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Focus styles */
        input:focus, textarea:focus {
          border-color: ${theme.colors.accent} !important;
          box-shadow: 0 0 0 1px ${theme.colors.accent}40;
        }

        /* Button hover helper */
        button:hover {
          filter: brightness(1.1);
        }
        button:active {
          transform: scale(0.98);
        }

        /* Selection */
        ::selection {
          background: ${theme.colors.accent}40;
          color: ${theme.colors.text};
        }
      `}</style>

      {/* Top navigation bar */}
      <TopBar />

      {/* 3-panel layout */}
      <div style={styles.body}>
        <CustomerPanel />
        <ConversationPanel />
        <InsightsPanel />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.bg,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
};

export default App;
