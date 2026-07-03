// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// KeyVault Chat â€” ChatGPT-Style PWA Chatbot with Rotating Keys
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

(() => {
  'use strict';

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PWA SERVICE WORKER
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered successfully.', reg.scope))
        .catch(err => console.log('Service Worker registration failed: ', err));
    });
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // DEFAULT PROVIDERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const DEFAULT_PROVIDERS = [
    {
      id: 'openai',
      name: 'OpenAI',
      color: '#10a37f',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'o3', 'o4-mini'],
      defaultLimit: 200,
      defaultPeriod: 'daily',
      headerName: 'Authorization',
      headerPrefix: 'Bearer ',
      builtIn: true,
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      color: '#4285f4',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
      defaultLimit: 1500,
      defaultPeriod: 'daily',
      headerName: 'x-goog-api-key',
      headerPrefix: '',
      builtIn: true,
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      color: '#d97706',
      baseUrl: 'https://api.anthropic.com/v1',
      models: ['claude-3-5-sonnet-latest', 'claude-3-haiku-latest', 'claude-3-5-opus-latest'],
      defaultLimit: 1000,
      defaultPeriod: 'daily',
      headerName: 'x-api-key',
      headerPrefix: '',
      builtIn: true,
    },
    {
      id: 'mistral',
      name: 'Mistral',
      color: '#ff7000',
      baseUrl: 'https://api.mistral.ai/v1',
      models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
      defaultLimit: 1000,
      defaultPeriod: 'daily',
      headerName: 'Authorization',
      headerPrefix: 'Bearer ',
      builtIn: true,
    },
    {
      id: 'cohere',
      name: 'Cohere',
      color: '#39594d',
      baseUrl: 'https://api.cohere.ai/v2',
      models: ['command-r-plus', 'command-r'],
      defaultLimit: 1000,
      defaultPeriod: 'monthly',
      headerName: 'Authorization',
      headerPrefix: 'Bearer ',
      builtIn: true,
    },
    {
      id: 'groq',
      name: 'Groq',
      color: '#f55036',
      baseUrl: 'https://api.groq.com/openai/v1',
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
      defaultLimit: 14400,
      defaultPeriod: 'daily',
      headerName: 'Authorization',
      headerPrefix: 'Bearer ',
      builtIn: true,
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      color: '#4d6bfe',
      baseUrl: 'https://api.deepseek.com/v1',
      models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
      defaultLimit: 1000,
      defaultPeriod: 'daily',
      headerName: 'Authorization',
      headerPrefix: 'Bearer ',
      builtIn: true,
    },
  ];

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // STORAGE KEYS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const STORAGE = {
    KEYS: 'keyvault_keys',
    PROVIDERS: 'keyvault_providers',
    LOGS: 'keyvault_logs',
    ROTATION_INDEX: 'keyvault_rotation_index',
    CONVERSATIONS: 'kvchat_conversations',
    CURRENT_CONV: 'kvchat_current_conv',
    THEME: 'kvchat_theme'
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // DATA LAYER HELPERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function loadJSON(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROVIDER STORE
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function getProviders() {
    const custom = loadJSON(STORAGE.PROVIDERS, []);
    return [...DEFAULT_PROVIDERS, ...custom];
  }

  function getProvider(id) {
    return getProviders().find(p => p.id === id);
  }

  function addProvider({ name, color, baseUrl, models, defaultLimit }) {
    const custom = loadJSON(STORAGE.PROVIDERS, []);
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (getProviders().find(p => p.id === id)) {
      showToast('Provider already exists', 'error');
      return null;
    }
    const provider = {
      id,
      name,
      color: color || '#8b5cf6',
      baseUrl: baseUrl || '',
      models: models || [],
      defaultLimit: defaultLimit || 1000,
      defaultPeriod: 'daily',
      headerName: 'Authorization',
      headerPrefix: 'Bearer ',
      builtIn: false,
    };
    custom.push(provider);
    saveJSON(STORAGE.PROVIDERS, custom);
    return provider;
  }

  function removeProvider(id) {
    const custom = loadJSON(STORAGE.PROVIDERS, []);
    const filtered = custom.filter(p => p.id !== id);
    saveJSON(STORAGE.PROVIDERS, filtered);
    // Remove provider's keys
    const keys = loadJSON(STORAGE.KEYS, []);
    saveJSON(STORAGE.KEYS, keys.filter(k => k.provider !== id));
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // KEY STORE
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function getKeys(provider = null) {
    let keys = loadJSON(STORAGE.KEYS, []);
    if (provider && provider !== 'all') {
      keys = keys.filter(k => k.provider === provider);
    }
    return keys;
  }

  function getKey(id) {
    return getKeys().find(k => k.id === id);
  }

  function addKey({ provider, label, key, limit, limitPeriod, notes }) {
    const keys = loadJSON(STORAGE.KEYS, []);
    const newKey = {
      id: generateId(),
      provider,
      label: label || `Key ${keys.filter(k => k.provider === provider).length + 1}`,
      key,
      limit: parseInt(limit) || 1000,
      limitPeriod: limitPeriod || 'daily',
      notes: notes || '',
      usage: 0,
      status: 'active',
      enabled: true,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      lastResetAt: new Date().toISOString(),
      errorMessage: '',
    };
    keys.push(newKey);
    saveJSON(STORAGE.KEYS, keys);
    return newKey;
  }

  function updateKey(id, updates) {
    const keys = loadJSON(STORAGE.KEYS, []);
    const idx = keys.findIndex(k => k.id === id);
    if (idx === -1) return null;
    keys[idx] = { ...keys[idx], ...updates };
    saveJSON(STORAGE.KEYS, keys);
    return keys[idx];
  }

  function removeKey(id) {
    const keys = loadJSON(STORAGE.KEYS, []);
    saveJSON(STORAGE.KEYS, keys.filter(k => k.id !== id));
  }

  function resetKeyUsage(id) {
    return updateKey(id, {
      usage: 0,
      status: 'active',
      errorMessage: '',
      lastResetAt: new Date().toISOString(),
    });
  }

  // Auto Reset checks on app load
  function checkAutoResets() {
    const keys = loadJSON(STORAGE.KEYS, []);
    const now = new Date();
    let changed = false;
    keys.forEach(k => {
      if (k.limitPeriod === 'never') return;
      const lastReset = new Date(k.lastResetAt);
      let shouldReset = false;
      if (k.limitPeriod === 'daily') {
        shouldReset = now.toDateString() !== lastReset.toDateString();
      } else if (k.limitPeriod === 'monthly') {
        shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
      }
      if (shouldReset) {
        k.usage = 0;
        k.status = 'active';
        k.errorMessage = '';
        k.lastResetAt = now.toISOString();
        changed = true;
      }
    });
    if (changed) saveJSON(STORAGE.KEYS, keys);
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ROTATION ENGINE
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function getRotationIndex() {
    return loadJSON(STORAGE.ROTATION_INDEX, {});
  }

  function setRotationIndex(provider, idx) {
    const indices = getRotationIndex();
    indices[provider] = idx;
    saveJSON(STORAGE.ROTATION_INDEX, indices);
  }

  function getNextKey(provider) {
    const keys = getKeys(provider).filter(k => k.status === 'active' && k.usage < k.limit && k.enabled !== false);
    if (keys.length === 0) return null;

    const indices = getRotationIndex();
    let idx = (indices[provider] || 0) % keys.length;
    const key = keys[idx];
    setRotationIndex(provider, (idx + 1) % keys.length);
    return key;
  }

  function markKeyExhausted(keyId, reason = 'Usage limit reached') {
    updateKey(keyId, { status: 'exhausted', errorMessage: reason });
    const key = getKey(keyId);
    if (key) {
      addLog({
        type: 'exhausted',
        provider: key.provider,
        keyId: key.id,
        keyLabel: key.label,
        reason,
      });
    }
  }

  function markKeyError(keyId, errorMsg) {
    updateKey(keyId, { status: 'error', errorMessage: errorMsg });
    const key = getKey(keyId);
    if (key) {
      addLog({
        type: 'error',
        provider: key.provider,
        keyId: key.id,
        keyLabel: key.label,
        reason: errorMsg,
      });
    }
  }

  function recordUsage(keyId, count = 1) {
    const key = getKey(keyId);
    if (!key) return;
    const newUsage = key.usage + count;
    const updates = {
      usage: newUsage,
      lastUsedAt: new Date().toISOString(),
    };
    if (newUsage >= key.limit) {
      updates.status = 'exhausted';
      updates.errorMessage = 'Usage limit reached';
      addLog({
        type: 'exhausted',
        provider: key.provider,
        keyId: key.id,
        keyLabel: key.label,
        reason: 'Usage limit reached',
      });
      // Rotation switch log
      const nextKey = getNextKey(key.provider);
      if (nextKey) {
        addLog({
          type: 'rotation',
          provider: key.provider,
          fromKeyId: key.id,
          fromKeyLabel: key.label,
          toKeyId: nextKey.id,
          toKeyLabel: nextKey.label,
          reason: 'Auto-rotation: previous key exhausted',
        });
      }
    }
    updateKey(keyId, updates);
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // ROTATION LOGS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function getLogs() {
    return loadJSON(STORAGE.LOGS, []);
  }

  function addLog(entry) {
    const logs = getLogs();
    logs.unshift({
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString(),
    });
    if (logs.length > 100) logs.length = 100;
    saveJSON(STORAGE.LOGS, logs);
  }

  function clearLogs() {
    saveJSON(STORAGE.LOGS, []);
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CONVERSATION MANAGER
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let conversations = loadJSON(STORAGE.CONVERSATIONS, []);
  let currentConversationId = localStorage.getItem(STORAGE.CURRENT_CONV);

  function getConversations() {
    return conversations;
  }

  function getConversation(id) {
    return conversations.find(c => c.id === id);
  }

  function createConversation(model = 'gemini/gemini-2.5-flash') {
    const id = generateId();
    const newConv = {
      id,
      title: 'New Chat',
      model,
      messages: [],
      createdAt: new Date().toISOString()
    };
    conversations.unshift(newConv);
    saveConversations();
    setCurrentConversationId(id);
    return newConv;
  }

  function saveConversations() {
    saveJSON(STORAGE.CONVERSATIONS, conversations);
  }

  function setCurrentConversationId(id) {
    currentConversationId = id;
    if (id) {
      localStorage.setItem(STORAGE.CURRENT_CONV, id);
    } else {
      localStorage.removeItem(STORAGE.CURRENT_CONV);
    }
  }

  function deleteConversation(id) {
    conversations = conversations.filter(c => c.id !== id);
    saveConversations();
    if (currentConversationId === id) {
      if (conversations.length > 0) {
        setCurrentConversationId(conversations[0].id);
      } else {
        setCurrentConversationId(null);
      }
    }
  }

  function clearAllConversations() {
    conversations = [];
    saveConversations();
    setCurrentConversationId(null);
  }

  function renameConversation(id, newTitle) {
    const conv = getConversation(id);
    if (conv) {
      conv.title = newTitle;
      saveConversations();
    }
  }

  function addMessageToConversation(id, role, content, meta = {}) {
    const conv = getConversation(id);
    if (conv) {
      conv.messages.push({
        role,
        content,
        timestamp: new Date().toISOString(),
        ...meta
      });
      // Auto-rename chat if it's the first user message
      if (role === 'user' && conv.title === 'New Chat' && conv.messages.length === 1) {
        conv.title = content.length > 26 ? content.slice(0, 24) + '...' : content;
      }
      saveConversations();
    }
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // UI HANDLERS & BINDINGS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let keyManagerTab = 'tabKeys';
  let confirmCallback = null;

  function initUI() {
    // Set theme on load
    const savedTheme = localStorage.getItem(STORAGE.THEME) || 'dark';
    setTheme(savedTheme);

    // Initial render
    renderAll();

    // Setup active status indicators
    updateHeaderStatusBadge();

    // Event Binds
    document.getElementById('btnNewChat').addEventListener('click', () => {
      createConversation(document.getElementById('modelSelector').value);
      renderAll();
      closeSidebarOnMobile();
    });

    document.getElementById('btnSidebarClose').addEventListener('click', closeSidebar);
    document.getElementById('btnSidebarOpen').addEventListener('click', openSidebar);

    // Chat form input submission
    document.getElementById('chatInputForm').addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendPrompt();
    });

    // Auto-grow textarea
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = (chatInput.scrollHeight - 6) + 'px';
      document.getElementById('btnSend').disabled = !chatInput.value.trim();
    });

    // Keyboard submit: Enter sends, Shift+Enter new line
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (chatInput.value.trim()) {
          document.getElementById('chatInputForm').requestSubmit();
        }
      }
    });

    // Model Selector Change
    document.getElementById('modelSelector').addEventListener('change', (e) => {
      if (currentConversationId) {
        const conv = getConversation(currentConversationId);
        if (conv) {
          conv.model = e.target.value;
          saveConversations();
        }
      }
    });

    // Toggle Key Manager Modal
    document.getElementById('btnToggleKeyManager').addEventListener('click', () => {
      openKeyManagerModal();
      closeSidebarOnMobile();
    });

    document.getElementById('btnCloseKeyManager').addEventListener('click', closeKeyManagerModal);
    document.getElementById('btnSaveKeyManager').addEventListener('click', closeKeyManagerModal);

    // Modal Tabs
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        switchKeyManagerTab(e.target.dataset.tab);
      });
    });

    // Clear history
    document.getElementById('btnClearHistory').addEventListener('click', () => {
      showConfirmDialog('Clear History', 'Delete all your chat conversations? This cannot be undone.', 'Clear All', () => {
        clearAllConversations();
        renderAll();
        showToast('Conversations cleared', 'success');
      });
    });

    // Toggle Light/Dark mode
    document.getElementById('btnToggleTheme').addEventListener('click', toggleTheme);

    // Quick prompt links
    document.getElementById('chatMessages').addEventListener('click', (e) => {
      const card = e.target.closest('.quick-prompt-card');
      if (card) {
        document.getElementById('chatInput').value = card.dataset.prompt;
        document.getElementById('chatInput').dispatchEvent(new Event('input'));
        document.getElementById('chatInput').focus();
      }
    });

    // Photo and video prompt helper button bindings
    document.getElementById('btnCreatePhoto').addEventListener('click', () => {
      const input = document.getElementById('chatInput');
      input.value = "Draft an image generation prompt for: ";
      input.dispatchEvent(new Event('input'));
      input.focus();
    });

    document.getElementById('btnCreateVideo').addEventListener('click', () => {
      const input = document.getElementById('chatInput');
      input.value = "Draft a video generation prompt for: ";
      input.dispatchEvent(new Event('input'));
      input.focus();
    });

    // Key Manager Specific events
    document.getElementById('btnOpenAddKey').addEventListener('click', () => {
      resetAddKeyForm();
      openModal('addKeyModal');
    });

    document.getElementById('btnSaveKey').addEventListener('click', () => {
      const provider = document.getElementById('addKeyProvider').value;
      const label = document.getElementById('addKeyLabel').value.trim();
      const key = document.getElementById('addKeyValue').value.trim();
      const limit = document.getElementById('addKeyLimit').value;
      const limitPeriod = document.getElementById('addKeyLimitPeriod').value;
      const notes = document.getElementById('addKeyNotes').value.trim();

      if (!key) {
        showToast('API Key is required', 'error');
        return;
      }

      addKey({ provider, label, key, limit, limitPeriod, notes });
      closeModal('addKeyModal');
      renderKeyManager();
      updateHeaderStatusBadge();
      showToast('Key added successfully', 'success');
    });

    document.getElementById('toggleKeyVis').addEventListener('click', () => {
      const input = document.getElementById('addKeyValue');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    // Provider change auto limits
    document.getElementById('addKeyProvider').addEventListener('change', (e) => {
      const p = getProvider(e.target.value);
      if (p) {
        document.getElementById('addKeyLimit').value = p.defaultLimit;
      }
    });

    // Custom provider open
    document.getElementById('btnOpenAddProvider').addEventListener('click', () => {
      document.getElementById('providerName').value = '';
      document.getElementById('providerColor').value = '#8b5cf6';
      document.getElementById('providerBaseUrl').value = '';
      document.getElementById('providerModels').value = '';
      document.getElementById('providerDefaultLimit').value = '1000';
      openModal('addProviderModal');
    });

    // Save provider
    document.getElementById('btnSaveProvider').addEventListener('click', () => {
      const name = document.getElementById('providerName').value.trim();
      const color = document.getElementById('providerColor').value;
      const baseUrl = document.getElementById('providerBaseUrl').value.trim();
      const limit = document.getElementById('providerDefaultLimit').value;
      const modelsStr = document.getElementById('providerModels').value.trim();
      const models = modelsStr ? modelsStr.split(',').map(m => m.trim()).filter(Boolean) : [];

      if (!name) {
        showToast('Provider name is required', 'error');
        return;
      }

      const p = addProvider({ name, color, baseUrl, models, defaultLimit: limit });
      if (p) {
        closeModal('addProviderModal');
        renderKeyManager();
        showToast(`Provider "${name}" registered`, 'success');
      }
    });

    // Backup Export / Import Config
    document.getElementById('btnExportData').addEventListener('click', exportConfig);
    document.getElementById('btnImportData').addEventListener('click', () => {
      document.getElementById('importConfigInput').click();
    });
    document.getElementById('importConfigInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        importConfig(ev.target.result);
        e.target.value = '';
      };
      reader.readAsText(file);
    });

    // Clear rotation log
    document.getElementById('btnClearLogs').addEventListener('click', () => {
      clearLogs();
      renderKeyManager();
      showToast('Logs cleared', 'success');
    });

    // Close buttons for modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    // Overlay click to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Confirm Modal button click
    document.getElementById('btnConfirmAction').addEventListener('click', () => {
      if (confirmCallback) confirmCallback();
      closeModal('confirmModal');
      confirmCallback = null;
    });

    // Key list search and sort
    document.getElementById('searchKeysInput').addEventListener('input', renderKeyListTable);
    document.getElementById('sortKeysSelect').addEventListener('change', renderKeyListTable);
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // RENDER CONTROLLERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function renderAll() {
    renderSidebarHistory();
    renderChatWindow();
    renderProviderSelectOptions();
  }

  function renderSidebarHistory() {
    const list = document.getElementById('historyList');
    const convs = getConversations();

    if (convs.length === 0) {
      list.innerHTML = `<div style="padding: 12px; font-size: 13px; color: var(--text-muted); text-align: center;">No active chats</div>`;
      return;
    }

    list.innerHTML = convs.map(c => {
      const isActive = c.id === currentConversationId;
      return `
        <div class="history-item ${isActive ? 'active' : ''}" data-conv-id="${c.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span class="history-title">${escapeHtml(c.title)}</span>
          <div class="history-item-actions">
            <button class="history-action-btn btn-rename-conv" title="Rename">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="history-action-btn btn-delete-conv" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind sidebar clicks
    list.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = el.dataset.convId;
        const renameBtn = e.target.closest('.btn-rename-conv');
        const deleteBtn = e.target.closest('.btn-delete-conv');

        if (renameBtn) {
          e.stopPropagation();
          const conv = getConversation(id);
          const newTitle = prompt('Enter new conversation title:', conv.title);
          if (newTitle && newTitle.trim()) {
            renameConversation(id, newTitle.trim());
            renderSidebarHistory();
          }
          return;
        }

        if (deleteBtn) {
          e.stopPropagation();
          showConfirmDialog('Delete Chat', 'Delete this chat conversation?', 'Delete', () => {
            deleteConversation(id);
            renderAll();
          });
          return;
        }

        setCurrentConversationId(id);
        renderAll();
        closeSidebarOnMobile();
      });
    });
  }

  function renderChatWindow() {
    const welcome = document.getElementById('welcomeScreen');
    const messagesBox = document.getElementById('chatMessages');

    // Remove existing message rows
    messagesBox.querySelectorAll('.message-row').forEach(row => row.remove());

    const activeConv = getConversation(currentConversationId);

    if (!activeConv || activeConv.messages.length === 0) {
      welcome.style.display = 'flex';
      document.getElementById('modelSelector').disabled = false;
      if (activeConv) {
        document.getElementById('modelSelector').value = activeConv.model;
      }
      return;
    }

    welcome.style.display = 'none';
    document.getElementById('modelSelector').disabled = true;
    document.getElementById('modelSelector').value = activeConv.model;

    activeConv.messages.forEach(m => {
      appendMessageBubble(m.role, m.content, m);
    });

    // Scroll to bottom
    scrollToBottom();
  }

  function appendMessageBubble(role, content, meta = null) {
    const messagesBox = document.getElementById('chatMessages');
    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const avatarInitial = role === 'user' ? 'U' : 'AI';
    const formattedContent = formatMarkdown(content);

    let metaHtml = '';
    if (meta && (meta.keyLabel || meta.duration)) {
      metaHtml = `
        <div class="message-meta">
          ${meta.keyLabel ? `<span>Key: ${escapeHtml(meta.keyLabel)}</span>` : ''}
          ${meta.duration ? `<span>Time: ${meta.duration}ms</span>` : ''}
        </div>
      `;
    }

    row.innerHTML = `
      <div class="message-wrapper">
        <div class="message-avatar">${avatarInitial}</div>
        <div class="message-content">
          ${formattedContent}
          ${metaHtml}
        </div>
      </div>
    `;

    row.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const code = btn.closest('pre')?.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          showToast('Copied code', 'success');
        } catch {
          showToast('Could not copy code', 'error');
        }
      });
    });

    messagesBox.appendChild(row);
    return row;
  }

  // Model select options mapping
  function renderProviderSelectOptions() {
    const select = document.getElementById('modelSelector');
    const customProviders = getProviders().filter(p => !p.builtIn);
    
    // Clear old custom optgroup
    const customGroup = select.querySelector('optgroup[label="Custom Providers"]');
    if (customGroup) customGroup.remove();

    if (customProviders.length > 0) {
      const group = document.createElement('optgroup');
      group.setAttribute('label', 'Custom Providers');
      group.innerHTML = customProviders.map(p => 
        p.models.map(m => `<option value="${p.id}/${m}">${p.name} - ${m}</option>`).join('')
      ).join('');
      select.appendChild(group);
    }

    // Modal Provider Option
    const addKeyProvSelect = document.getElementById('addKeyProvider');
    addKeyProvSelect.innerHTML = getProviders().map(p => 
      `<option value="${p.id}">${p.name}</option>`
    ).join('');
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TEXT FORMATTING (Markdowns & Code Blocks)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // Code Blocks: ```lang\ncode\n```
    const codeBlockRegex = /```([a-zA-Z0-9+#-]+)?\n([\s\S]*?)\n```/g;
    html = html.replace(codeBlockRegex, (match, lang, code) => {
      const displayLang = lang || 'code';
      return `
        <pre><div class="code-header"><span>${displayLang}</span><button class="code-copy-btn" type="button" title="Copy code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy code</button></div><code>${code}</code></pre>
      `;
    });

    // Inline Code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Paragraphs
    const paragraphs = html.split('\n\n');
    return paragraphs.map(p => {
      if (p.trim().startsWith('<pre') || p.trim().startsWith('<style')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // SIDEBAR TOGGLING
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function openSidebar() {
    document.getElementById('sidebar').classList.add('sidebar-open');
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('sidebar-open');
  }

  function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // THEME CONTROL
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  }

  function setTheme(theme) {
    const body = document.body;
    const text = document.getElementById('themeText');
    const sun = document.querySelector('.sun-icon');
    const moon = document.querySelector('.moon-icon');

    if (theme === 'light') {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      text.textContent = 'Dark Mode';
      sun.style.display = 'block';
      moon.style.display = 'none';
      localStorage.setItem(STORAGE.THEME, 'light');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      text.textContent = 'Light Mode';
      sun.style.display = 'none';
      moon.style.display = 'block';
      localStorage.setItem(STORAGE.THEME, 'dark');
    }
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // API CLIENT CALLS WITH AUTO ROTATION
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function handleSendPrompt() {
    const input = document.getElementById('chatInput');
    const promptText = input.value.trim();
    if (!promptText) return;

    // Reset textarea height
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('btnSend').disabled = true;

    // Create conversation if none exists
    if (!currentConversationId) {
      createConversation(document.getElementById('modelSelector').value);
      renderSidebarHistory();
    }

    const activeConvId = currentConversationId;
    const modelFull = document.getElementById('modelSelector').value;
    const [providerId, modelName] = modelFull.split('/');

    // Add user message to state and view
    addMessageToConversation(activeConvId, 'user', promptText);
    renderChatWindow();

    // Create BOT message shell with typing indicator
    const botBubble = appendMessageBubble('assistant', '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>');
    scrollToBottom();

    const startTime = performance.now();
    let retryCount = 0;
    const maxRetries = getKeys(providerId).length;

    async function executeApiRequest() {
      const keyData = getNextKey(providerId);
      if (!keyData) {
        updateBotBubbleError(botBubble, `No active/valid API keys available for <strong>${getProvider(providerId).name}</strong>. Add API keys in the Key Manager.`);
        return;
      }

      try {
        const provider = getProvider(providerId);
        let result;

        if (providerId === 'gemini') {
          result = await callGeminiAPI(provider, keyData, modelName, promptText);
        } else if (providerId === 'anthropic') {
          result = await callAnthropicAPI(provider, keyData, modelName, promptText);
        } else {
          result = await callOpenAICompatibleAPI(provider, keyData, modelName, promptText);
        }

        const duration = Math.round(performance.now() - startTime);
        recordUsage(keyData.id, 1);

        // Update state and UI
        const meta = { keyLabel: keyData.label, duration };
        addMessageToConversation(activeConvId, 'assistant', result.text, meta);
        
        // Render whole window to show metadata properly
        renderChatWindow();
        updateHeaderStatusBadge();
      } catch (err) {
        console.error('API Call Failure:', err);
        const errorMsg = err.message || 'Unknown error';

        if (isRateLimitError(err)) {
          markKeyExhausted(keyData.id, `Rate Limit: ${errorMsg}`);
          updateHeaderStatusBadge();
          
          if (retryCount < maxRetries) {
            retryCount++;
            addLog({
              type: 'rotation',
              provider: providerId,
              reason: `Rate limited key "${keyData.label}". Retrying with next key (Attempt ${retryCount}/${maxRetries})`
            });
            // Try next key recursively
            await executeApiRequest();
          } else {
            updateBotBubbleError(botBubble, `All API keys for <strong>${provider.name}</strong> are exhausted (Rate Limit). Please add more keys.`);
          }
        } else {
          markKeyError(keyData.id, errorMsg);
          updateHeaderStatusBadge();
          updateBotBubbleError(botBubble, `API Error (Key "${keyData.label}"): ${errorMsg}.`);
        }
      }
    }

    await executeApiRequest();
  }

  function updateBotBubbleError(bubbleEl, htmlContent) {
    const contentBox = bubbleEl.querySelector('.message-content');
    contentBox.innerHTML = `<div style="color:#ef4444; font-weight:500;">âŒ Error: ${htmlContent}</div>`;
  }

  function isRateLimitError(err) {
    const msg = (err.message || '').toLowerCase();
    const status = err.status || err.statusCode || 0;
    return status === 429 || status === 503 ||
      msg.includes('rate limit') ||
      msg.includes('quota') ||
      msg.includes('too many requests') ||
      msg.includes('resource_exhausted') ||
      msg.includes('exceeded');
  }

  async function callOpenAICompatibleAPI(provider, keyData, model, userPrompt) {
    const headers = { 'Content-Type': 'application/json' };
    headers[provider.headerName] = provider.headerPrefix + keyData.key;

    const res = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 1024
      }),
    });

    if (!res.ok) {
      const err = new Error(await res.text().catch(() => res.statusText));
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || 'No response' };
  }

  async function callGeminiAPI(provider, keyData, model, userPrompt) {
    const res = await fetch(
      `${provider.baseUrl}/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': keyData.key,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }]
        }),
      }
    );

    if (!res.ok) {
      const err = new Error(await res.text().catch(() => res.statusText));
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response' };
  }

  async function callAnthropicAPI(provider, keyData, model, userPrompt) {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': keyData.key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    };

    const res = await fetch(`${provider.baseUrl}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: userPrompt }]
      }),
    });

    if (!res.ok) {
      const err = new Error(await res.text().catch(() => res.statusText));
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return { text: data.content?.[0]?.text || 'No response' };
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // MODAL LOGIC & TAB RENDERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function openKeyManagerModal() {
    renderKeyManager();
    openModal('keyManagerModal');
  }

  function closeKeyManagerModal() {
    closeModal('keyManagerModal');
  }

  function switchKeyManagerTab(tabId) {
    keyManagerTab = tabId;
    document.querySelectorAll('.modal-tab').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(el => {
      el.style.display = el.id === tabId ? 'block' : 'none';
    });
    renderKeyManager();
  }

  function renderKeyManager() {
    // Render Stats
    const keys = getKeys();
    const activeCount = keys.filter(k => k.status === 'active' && k.usage < k.limit).length;
    const exhaustedCount = keys.filter(k => k.status !== 'active' || k.usage >= k.limit).length;
    const requestSum = keys.reduce((sum, k) => sum + k.usage, 0);

    document.getElementById('valTotalKeys').textContent = keys.length;
    document.getElementById('valActiveKeys').textContent = activeCount;
    document.getElementById('valExhaustedKeys').textContent = exhaustedCount;
    document.getElementById('valTotalRequests').textContent = requestSum;

    if (keyManagerTab === 'tabKeys') {
      renderKeyListTable();
    } else if (keyManagerTab === 'tabProviders') {
      renderProviderGrid();
    } else if (keyManagerTab === 'tabLogs') {
      renderRotationLogs();
    }
  }

  function renderKeyListTable() {
    const search = document.getElementById('searchKeysInput').value.toLowerCase();
    const sort = document.getElementById('sortKeysSelect').value;
    let keys = getKeys();

    if (search) {
      keys = keys.filter(k => 
        k.label.toLowerCase().includes(search) || 
        k.provider.toLowerCase().includes(search)
      );
    }

    if (sort === 'usage-high') {
      keys.sort((a,b) => b.usage - a.usage);
    } else if (sort === 'usage-low') {
      keys.sort((a,b) => a.usage - b.usage);
    } else {
      keys.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const container = document.getElementById('keyListContainer');
    if (keys.length === 0) {
      container.innerHTML = `<div class="empty-placeholder">No keys match this query.</div>`;
      return;
    }

    let html = `
      <table class="key-table">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Label</th>
            <th>API Key</th>
            <th>Usage</th>
            <th>Status</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    html += keys.map(k => {
      const prov = getProvider(k.provider);
      const color = prov ? prov.color : '#8b5cf6';
      const name = prov ? prov.name : k.provider;
      const pct = Math.min(100, Math.round((k.usage / k.limit) * 100));
      const usageColor = pct >= 90 ? 'critical' : (pct >= 70 ? 'warn' : 'ok');
      const displayKey = k.key.slice(0,4) + 'â€¢â€¢â€¢' + k.key.slice(-4);
      const isEnabled = k.enabled !== false;

      let statusBadgeClass = 'active';
      let statusText = 'Active';
      if (!isEnabled) {
        statusBadgeClass = 'exhausted';
        statusText = 'Disabled';
      } else if (k.status === 'exhausted' || k.usage >= k.limit) {
        statusBadgeClass = 'exhausted';
        statusText = 'Limit Hit';
      } else if (k.status === 'error') {
        statusBadgeClass = 'error';
        statusText = 'Error';
      }

      return `
        <tr>
          <td>
            <span class="provider-pill">
              <span class="provider-dot-indicator" style="background-color: ${color}"></span>
              ${name}
            </span>
          </td>
          <td><strong>${escapeHtml(k.label)}</strong></td>
          <td><code style="font-family: var(--font-mono);">${displayKey}</code></td>
          <td>
            <div style="width:120px">
              <div style="display:flex; justify-content:space-between; font-size:11px;">
                <span>${k.usage}/${k.limit}</span>
                <span>${pct}%</span>
              </div>
              <div class="usage-mini-bar">
                <div class="usage-mini-fill ${usageColor}" style="width: ${pct}%"></div>
              </div>
            </div>
          </td>
          <td><span class="status-badge-inline ${statusBadgeClass}">${statusText}</span></td>
          <td>
            <label class="switch-toggle" style="position:relative; display:inline-block; width:36px; height:20px;">
              <input type="checkbox" class="btn-toggle-key-enabled" data-key-id="${k.id}" ${isEnabled ? 'checked' : ''} style="opacity:0; width:0; height:0;">
              <span class="switch-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:rgba(255,255,255,0.1); transition:.2s; border-radius:34px;"></span>
            </label>
          </td>
          <td>
            <button class="btn-icon btn-reset-usage" data-key-id="${k.id}" title="Reset Usage">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
            <button class="btn-icon btn-delete-key" data-key-id="${k.id}" title="Delete Key" style="color:var(--danger)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    html += `</tbody></table>`;
    container.innerHTML = html;

    // Bind row action events
    container.querySelectorAll('.btn-toggle-key-enabled').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.keyId;
        updateKey(id, { enabled: cb.checked });
        renderKeyManager();
        updateHeaderStatusBadge();
        showToast(cb.checked ? 'Key enabled' : 'Key disabled', 'success');
      });
    });

    container.querySelectorAll('.btn-reset-usage').forEach(btn => {
      btn.addEventListener('click', () => {
        resetKeyUsage(btn.dataset.keyId);
        renderKeyManager();
        updateHeaderStatusBadge();
        showToast('Key usage count reset', 'success');
      });
    });

    container.querySelectorAll('.btn-delete-key').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.keyId;
        const key = getKey(id);
        showConfirmDialog('Delete Key', `Remove API Key "${key.label}"?`, 'Delete', () => {
          removeKey(id);
          renderKeyManager();
          updateHeaderStatusBadge();
          showToast('Key deleted', 'success');
        });
      });
    });
  }

  function renderProviderGrid() {
    const providers = getProviders().filter(p => !p.builtIn);
    const container = document.getElementById('providerListContainer');

    if (providers.length === 0) {
      container.innerHTML = `<div class="empty-placeholder">No custom providers configured yet. Click "Add Custom Provider" to create one.</div>`;
      return;
    }

    container.innerHTML = `
      <div class="providers-grid">
        ${providers.map(p => `
          <div class="provider-card">
            <div class="provider-card-header">
              <span class="provider-dot-indicator" style="background-color: ${p.color}"></span>
              <span>${escapeHtml(p.name)}</span>
            </div>
            <div class="provider-card-url">${escapeHtml(p.baseUrl || 'No base URL')}</div>
            <div class="provider-card-models">Models: <code>${escapeHtml(p.models.join(', ')) || 'None'}</code></div>
            <div class="provider-card-actions">
              <button class="btn btn-ghost btn-sm btn-delete-provider" data-prov-id="${p.id}" style="color:var(--danger)">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Bind provider delete
    container.querySelectorAll('.btn-delete-provider').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.provId;
        showConfirmDialog('Remove Provider', `Remove provider and all its stored keys?`, 'Remove', () => {
          removeProvider(id);
          renderKeyManager();
          renderProviderSelectOptions();
          updateHeaderStatusBadge();
          showToast('Provider removed', 'success');
        });
      });
    });
  }

  function renderRotationLogs() {
    const logs = getLogs();
    const container = document.getElementById('logListContainer');

    if (logs.length === 0) {
      container.innerHTML = `<div class="empty-placeholder">No rotation logs recorded yet.</div>`;
      return;
    }

    container.innerHTML = logs.map(l => {
      const prov = getProvider(l.provider);
      const color = prov ? prov.color : '#8b5cf6';
      const time = new Date(l.timestamp).toLocaleTimeString();
      let borderLeftColor = color;
      
      let header = '';
      if (l.type === 'rotation') {
        header = `ðŸ”„ Rotated Key`;
      } else if (l.type === 'exhausted') {
        header = `âš ï¸ Key Exhausted`;
      } else {
        header = `âŒ Error Occurred`;
      }

      return `
        <div class="log-row" style="border-left-color: ${borderLeftColor}">
          <div class="log-row-left">
            <span class="log-row-header" style="color:${color}">${header}</span>
            <span class="log-row-desc">${escapeHtml(l.reason)}</span>
          </div>
          <span class="log-row-time">${time}</span>
        </div>
      `;
    }).join('');
  }

  function updateHeaderStatusBadge() {
    const badge = document.getElementById('rotatorStatusBadge');
    const dot = document.getElementById('rotatorStatusBadge').querySelector('.status-indicator-dot');
    const text = document.getElementById('rotationStatusText');
    const sidebarBadge = document.getElementById('sidebarActiveKeysBadge');

    const totalActive = getKeys().filter(k => k.status === 'active' && k.usage < k.limit && k.enabled !== false).length;
    sidebarBadge.textContent = totalActive;

    if (totalActive > 0) {
      dot.classList.add('active');
      text.textContent = `${totalActive} active keys`;
      badge.title = `${totalActive} keys available for request routing.`;
    } else {
      dot.classList.remove('active');
      text.textContent = `0 keys active`;
      badge.title = `No active keys. Request routing is offline.`;
    }
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // BACKUPS & JSON CONFIG FILE EXPORT/IMPORT
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function exportConfig() {
    const data = {
      version: 2,
      exportType: 'safe-config-no-secrets',
      keys: loadJSON(STORAGE.KEYS, []).map(({ key, ...rest }) => ({
        ...rest,
        key: '',
        hasStoredKey: Boolean(key),
        status: rest.status === 'active' ? 'needs-key' : rest.status,
        enabled: false,
      })),
      customProviders: loadJSON(STORAGE.PROVIDERS, []),
      logs: getLogs()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyvault-chat-safe-config.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Safe config exported without API key values', 'success');
  }

  function importConfig(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.keys) {
        showToast('Invalid backup file structure', 'error');
        return;
      }
      saveJSON(STORAGE.KEYS, (data.keys || []).map(k => ({ ...k, key: k.key || '', enabled: Boolean(k.key) && k.enabled !== false })));
      saveJSON(STORAGE.PROVIDERS, data.customProviders || []);
      saveJSON(STORAGE.LOGS, data.logs || []);
      
      renderKeyManager();
      renderProviderSelectOptions();
      updateHeaderStatusBadge();
      showToast('Config imported. Re-enter any missing API keys.', 'success');
    } catch {
      showToast('Parsing error. Is it a valid JSON config?', 'error');
    }
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // MODAL CONTROL INTERFACES
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.style.display = 'none'; }, 200);
  }

  function resetAddKeyForm() {
    document.getElementById('addKeyLabel').value = '';
    document.getElementById('addKeyValue').value = '';
    document.getElementById('addKeyValue').type = 'password';
    document.getElementById('addKeyNotes').value = '';
    
    const prov = getProvider(document.getElementById('addKeyProvider').value);
    if (prov) {
      document.getElementById('addKeyLimit').value = prov.defaultLimit;
    }
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CONFIRMATION DIALOG MODAL
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function showConfirmDialog(title, message, actionText, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('btnConfirmAction').textContent = actionText;
    confirmCallback = callback;
    openModal('confirmModal');
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // TOAST NOTIFICATIONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'none';
      toast.offsetHeight; /* trigger reflow */
      toast.style.animation = 'toastIn 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  // Expose toast globally for inline copy buttons
  window.showToast = showToast;

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // UTILITY HELPERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function stripHtml(str) {
    const div = document.createElement('div');
    div.innerHTML = String(str || '');
    return div.textContent || div.innerText || '';
  }

  function scrollToBottom() {
    const box = document.getElementById('chatMessages');
    box.scrollTop = box.scrollHeight;
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // INIT BOOT
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function boot() {
    checkAutoResets();
    initUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

