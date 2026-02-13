# Expo-Notifications iOS Physical Device Setup Research

**Date:** 2026-02-13 | **SDK:** Expo 52

## 1. iOS Requirements & Physical Device Constraints

**Critical:** Push notifications only work on **physical iOS devices**, not simulators/emulators. SDK 52 enforces this by warning when using `expo-notifications` features in Expo Go.

**SDK 52 Transition Changes:**
- Expo Go no longer uses Expo's default credentials for push notifications
- Development builds required for proper testing (not Expo Go)
- Push key management now requires explicit setup via EAS Credentials

## 2. Required app.json/app.config.js Settings

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./path/to/notification_icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
          "sounds": ["./path/to/notification_sound.wav"],
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ]
  }
}
```

**Critical:** Include `projectId` in Constants for token retrieval:
```javascript
const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
```

## 3. iOS Entitlements & Capabilities Required

**APNs Entitlement (Automatic):** The `aps-environment` entitlement is automatically added during `prebuild`:
```json
{
  "ios": {
    "entitlements": {
      "aps-environment": "development"
    }
  }
}
```

**Push Notification Capability:** Automatically managed by expo-notifications plugin during prebuild.

**Common Entitlement Issue:** Personal development team accounts **do NOT support Push Notifications capability** — results in provisioning profile creation errors.

## 4. Common Physical Device Failure Reasons

| Issue | Cause | Solution |
|-------|-------|----------|
| **Token retrieval fails** | No valid push key in EAS credentials | Regenerate APNs push key via `eas credentials` |
| **Notifications don't deliver** | Push key revoked or invalid | Check EAS credentials, add new push key if needed |
| **"Missing Push Notification Entitlement"** | Personal dev team used | Use Apple Developer Program team account |
| **Capability sync conflicts** | Remote capability mismatched with local entitlements | Run `EXPO_NO_CAPABILITY_SYNC=1 eas build` to skip sync |
| **Permission prompt not shown** | Android-specific channel needed for iOS workaround | iOS doesn't need notification channel, but ensure iOS entitlements valid |

## 5. Required Code Pattern

```javascript
// Register device for push notifications
async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
  } catch (e) {
    console.error('Push token error:', e);
    return null;
  }
}
```

## 6. Checklist for iOS Notifications on Physical Device

- [ ] Using physical device (not simulator)
- [ ] Development build created (not Expo Go for SDK 52+)
- [ ] Valid APNs push key in EAS credentials
- [ ] `projectId` configured in app.json or Constants
- [ ] `expo-notifications` plugin in plugins array
- [ ] Device has granted notification permissions
- [ ] Bundle ID matches provisioning profile
- [ ] Not using personal development team account
- [ ] Push key not revoked in EAS

---

## Sources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Push Notifications Setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [iOS Capabilities Reference](https://docs.expo.dev/build-reference/ios-capabilities/)
- [Expo SDK 52 Changelog](https://expo.dev/changelog/2024-11-12-sdk-52)
- [Push Notifications FAQ & Troubleshooting](https://docs.expo.dev/push-notifications/faq/)
