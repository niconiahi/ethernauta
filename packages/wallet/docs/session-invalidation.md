# Session Invalidation in Browser Wallet Extensions

This document outlines how popular browser wallet extensions like MetaMask and Backpack handle session management after password input, providing insights for implementing session invalidation in wallet applications.

## Session Management Approaches

### MetaMask
- **Automatic timeout**: Sessions expire after a period of inactivity
- **Memory-based storage**: Private keys are decrypted and stored in `sessionStorage` (in-memory)
- **Timestamp expiration**: Uses expiry timestamps for automatic session invalidation
- **Security-first approach**: Requires password re-entry after timeout for security
- **User feedback**: Users have requested configurable timeout intervals due to disruption during active DApp usage

### Backpack
- **No session expiration**: Sessions persist without automatic timeout
- **Persistent sessions**: Different approach focusing on convenience over automatic timeouts
- **Alternative security**: Relies on 2FA and other security mechanisms instead of session timeouts
- **API security**: Uses time-windowed requests (5-60 second validity) for signed operations

## Technical Implementation Patterns

### Memory-based Storage (Primary Approach)

**Chrome Extension Storage API:**
- Uses `chrome.storage.session` for in-memory storage (10MB limit)
- Data persists across background script lifetimes but cleared on:
  - Extension disable/reload/update
  - Browser restart
  - Manual session termination

**Implementation Details:**
```javascript
// Store decrypted session data in memory
chrome.storage.session.set({
  decryptedPrivateKey: privateKey,
  sessionTimestamp: Date.now(),
  sessionExpiry: Date.now() + (30 * 60 * 1000) // 30 minutes
});
```

### Timestamp-based Expiration (Secondary Layer)

**Expiry Management:**
- Add expiry timestamps to decrypted private keys
- Background processes periodically check timestamps
- Clear expired sessions automatically
- Configurable timeout periods

**Security Benefits:**
- Automatic cleanup of forgotten sessions
- Time-based access control
- Prevents indefinite key exposure

### Hybrid Approach (Recommended)

**Combined Strategy:**
1. **Memory storage** for session data (never persists to disk)
2. **Timestamp checks** for automatic expiration
3. **Event-based cleanup** on browser/extension lifecycle events
4. **Manual locks** for immediate security

## Security Considerations

### Storage Types and Security

**Memory Storage (`sessionStorage`):**
- ✅ Cleared on browser close
- ✅ Not persisted to disk
- ✅ Better performance
- ✅ Isolated by Same Origin Policy

**Persistent Storage (`localStorage`):**
- ❌ Survives browser restarts
- ❌ Written to file system
- ❌ Potential security risk for sensitive data
- ❌ Should never store unencrypted private keys

### Implementation Security

**Best Practices:**
- Private keys decrypted by user password and stored unencrypted only in `sessionStorage`
- Use encryptor classes for any persistent storage needs
- Implement automatic session invalidation with configurable timeouts
- Clear sensitive data on extension lifecycle events
- Never store confidential data in `localStorage` unencrypted

**Browser Extension Considerations:**
- Extensions require additional processes (CPU/memory overhead)
- Isolation based on Same Origin Policy
- Session data cleared on extension disable/reload
- Background scripts can manage session lifecycle

## Recommended Implementation Strategy

### For Cryptoman Wallet

1. **Primary Storage**: Use `chrome.storage.session` for decrypted keys and session state
2. **Timeout Management**: Implement configurable session timeouts with timestamps
3. **Cleanup Events**: Clear sessions on browser close, extension reload, manual lock
4. **Security Layer**: Never persist sensitive data to disk unencrypted
5. **User Control**: Provide session timeout configuration options

### Session Lifecycle

```javascript
// Session initialization after password entry
const initializeSession = async (password, encryptedData) => {
  const decryptedKey = await decrypt(encryptedData, password);
  const sessionData = {
    privateKey: decryptedKey,
    timestamp: Date.now(),
    expiry: Date.now() + getSessionTimeout()
  };
  
  await chrome.storage.session.set({ walletSession: sessionData });
  startSessionMonitoring();
};

// Periodic session validation
const validateSession = async () => {
  const { walletSession } = await chrome.storage.session.get('walletSession');
  
  if (!walletSession || Date.now() > walletSession.expiry) {
    await clearSession();
    return false;
  }
  
  return true;
};

// Session cleanup
const clearSession = async () => {
  await chrome.storage.session.remove('walletSession');
  // Trigger password re-entry UI
};
```

## Conclusion

Most successful browser wallet extensions use a **hybrid approach** combining memory-based storage with timestamp-based expiration. This provides both security (automatic timeouts, no disk persistence) and usability (configurable timeouts, performance benefits).

The key is balancing security requirements with user experience, allowing configurable session timeouts while maintaining strict memory-only storage for sensitive cryptographic material.