/**
 * WebSocket client with auto-reconnect for the agent pipeline
 */

import type { ServerMessage, ClientMessage } from './types';

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000];
const PING_INTERVAL = 30_000;

export type StoreCallbacks = {
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
  handleAgentEvent: (id: string, event: ServerMessage & { type: 'agent_event' }) => void;
  setResult: (id: string, output: any) => void;
  setRunError: (id: string, message: string) => void;
};

export class AgentWebSocket {
  private ws: WebSocket | null = null;
  private url = '';
  private apiKey = '';
  private store: StoreCallbacks;
  private intentionalClose = false;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;

  constructor(store: StoreCallbacks) {
    this.store = store;
  }

  connect(url: string, apiKey: string) {
    this.url = url;
    this.apiKey = apiKey;
    this.intentionalClose = false;
    this.reconnectAttempt = 0;
    this._connect();
  }

  disconnect() {
    this.intentionalClose = true;
    this._cleanup();
    this.store.setConnectionStatus('disconnected');
  }

  send(msg: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private _connect() {
    this._cleanup();
    this.store.setConnectionStatus('connecting');

    const wsUrl = this.apiKey
      ? `${this.url}?api_key=${encodeURIComponent(this.apiKey)}`
      : this.url;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.store.setConnectionStatus('connected');
      this.pingTimer = setInterval(() => {
        this.send({ type: 'ping' });
      }, PING_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;
        this._handleMessage(msg);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      this._clearTimers();
      if (!this.intentionalClose) {
        this.store.setConnectionStatus('error');
        this._scheduleReconnect();
      }
    };

    ws.onerror = () => {
      // onclose will fire after this
    };

    this.ws = ws;
  }

  private _handleMessage(msg: ServerMessage) {
    switch (msg.type) {
      case 'agent_event':
        this.store.handleAgentEvent(msg.id, msg);
        break;
      case 'result':
        this.store.setResult(msg.id, msg.output);
        break;
      case 'error':
        this.store.setRunError(msg.id, msg.error.message);
        break;
      case 'cancelled':
        this.store.setRunError(msg.id, 'Cancelled');
        break;
      case 'pong':
        break;
    }
  }

  private _scheduleReconnect() {
    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)];
    this.reconnectAttempt++;
    this.reconnectTimer = setTimeout(() => this._connect(), delay);
  }

  private _clearTimers() {
    if (this.pingTimer) { clearInterval(this.pingTimer); this.pingTimer = null; }
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
  }

  private _cleanup() {
    this._clearTimers();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
  }
}
