import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script for TinyTyper
 *
 * This script runs in a sandboxed context and provides a secure bridge
 * between the renderer process (web page) and the main process (Node.js).
 * It uses contextBridge to expose specific APIs to the renderer.
 */

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Send messages to main process
  send: (channel: string, data: any) => {
    // Whitelist channels for security
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Example: Receive messages from main process
  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Remove the event parameter to prevent exposing ipcRenderer
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },

  // Future: Add settings, kiosk mode toggle, etc.
  toggleKioskMode: () => {
    ipcRenderer.send('toggle-kiosk-mode');
  },
});

// Extend Window interface for TypeScript
declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: any) => void;
      receive: (channel: string, func: (...args: any[]) => void) => void;
      toggleKioskMode: () => void;
    };
  }
}
