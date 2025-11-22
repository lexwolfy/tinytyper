import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import serve from 'electron-serve';

/**
 * TinyTyper - Electron Main Process
 *
 * This is the main entry point for the Electron application.
 * It handles window creation, keyboard shortcut blocking, and app lifecycle.
 */

let mainWindow: BrowserWindow | null = null;
let isKioskMode = false;

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development';

// Configure electron-serve for production builds
const loadURL = serve({ directory: 'out' });

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true, // Start in fullscreen
    autoHideMenuBar: true, // Hide menu bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Security: isolate context
      nodeIntegration: false, // Security: disable node integration
      webSecurity: !isDev, // Disable in dev for CORS
    },
  });

  // Load the app
  if (isDev) {
    // Development: load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from static export
    loadURL(mainWindow);
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Block refresh shortcuts in production
  if (!isDev) {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      // Block Cmd/Ctrl+R (refresh)
      if (
        (input.control || input.meta) &&
        (input.key === 'r' || input.key === 'R')
      ) {
        event.preventDefault();
      }
    });
  }
}

/**
 * Register global keyboard shortcuts to prevent system actions
 */
function registerGlobalShortcuts() {
  // macOS shortcuts
  if (process.platform === 'darwin') {
    // Prevent Cmd+Q (quit)
    globalShortcut.register('Command+Q', () => {
      console.log('Cmd+Q blocked (use window close button to exit)');
      return false;
    });

    // Prevent Cmd+W (close window)
    globalShortcut.register('Command+W', () => {
      console.log('Cmd+W blocked');
      return false;
    });

    // Prevent Cmd+H (hide)
    globalShortcut.register('Command+H', () => {
      console.log('Cmd+H blocked');
      return false;
    });

    // Prevent Cmd+M (minimize)
    globalShortcut.register('Command+M', () => {
      console.log('Cmd+M blocked');
      return false;
    });
  }

  // Windows/Linux shortcuts
  if (process.platform === 'win32' || process.platform === 'linux') {
    // Prevent Alt+F4 (close window)
    globalShortcut.register('Alt+F4', () => {
      console.log('Alt+F4 blocked (use window close button to exit)');
      return false;
    });

    // Prevent Ctrl+W (close window)
    globalShortcut.register('Control+W', () => {
      console.log('Ctrl+W blocked');
      return false;
    });

    // Prevent Ctrl+Q (quit - Linux)
    if (process.platform === 'linux') {
      globalShortcut.register('Control+Q', () => {
        console.log('Ctrl+Q blocked');
        return false;
      });
    }
  }

  // Cross-platform: F11 (fullscreen toggle) - block it
  globalShortcut.register('F11', () => {
    console.log('F11 blocked - use menu to toggle fullscreen');
    return false;
  });

  // Admin shortcut: Ctrl+Shift+K to toggle kiosk mode (for parents)
  globalShortcut.register('CommandOrControl+Shift+K', () => {
    toggleKioskMode();
  });

  // Admin shortcut: Ctrl+Shift+D to toggle DevTools (for debugging)
  if (mainWindow) {
    globalShortcut.register('CommandOrControl+Shift+D', () => {
      if (mainWindow) {
        mainWindow.webContents.toggleDevTools();
      }
    });
  }

  console.log('Global shortcuts registered successfully');
}

/**
 * Unregister all global shortcuts
 */
function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
  console.log('Global shortcuts unregistered');
}

/**
 * Toggle kiosk mode on/off
 */
function toggleKioskMode() {
  if (!mainWindow) return;

  isKioskMode = !isKioskMode;

  if (isKioskMode) {
    // Enter kiosk mode
    mainWindow.setKiosk(true);
    console.log('Kiosk mode enabled - press Ctrl+Shift+K to exit');
  } else {
    // Exit kiosk mode
    mainWindow.setKiosk(false);
    mainWindow.setFullScreen(true); // Keep fullscreen
    console.log('Kiosk mode disabled - back to fullscreen');
  }
}

// App lifecycle events

/**
 * App is ready - create window and register shortcuts
 */
app.whenReady().then(() => {
  createWindow();
  registerGlobalShortcuts();

  // macOS: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * All windows closed - quit app (except on macOS)
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * App is about to quit - cleanup
 */
app.on('will-quit', () => {
  unregisterGlobalShortcuts();
});

// IPC handlers for communication with renderer process

/**
 * Handle toggle kiosk mode request from renderer
 */
ipcMain.on('toggle-kiosk-mode', () => {
  toggleKioskMode();
});

/**
 * Handle messages from renderer
 */
ipcMain.on('toMain', (_event, data) => {
  console.log('Received from renderer:', data);
  // Handle any future messages from renderer
});
