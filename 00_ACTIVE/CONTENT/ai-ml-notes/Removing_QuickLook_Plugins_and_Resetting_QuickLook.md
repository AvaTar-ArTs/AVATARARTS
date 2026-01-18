The `diskutil repairPermissions` command has been deprecated and is no longer available on macOS versions from El Capitan (10.11) onward, because macOS automatically manages permissions on the system files. For versions of macOS after El Capitan, you should use Disk Utility for repairing disk issues.

However, for addressing QuickLook-related issues, repairing permissions is generally not necessary. You've already taken steps to identify and remove problematic QuickLook plugins. Here are the steps again to ensure proper removal and refresh of QuickLook:

### Removing QuickLook Plugins and Resetting QuickLook

1. **Identify QuickLook Plugins**:
   - **Open Terminal**.
   - Run:
     ```bash
     ls /Library/QuickLook
     ls ~/Library/QuickLook
     ```

2. **Remove QuickLook Plugins**:
   - Assuming the problematic plugin is identified, use:
     ```bash
     sudo rm -rf /Library/QuickLook/ProblematicPlugin.qlgenerator
     rm -rf ~/Library/QuickLook/ProblematicPlugin.qlgenerator
     ```

3. **Rebuild QuickLook Cache**:
   - Use the `qlmanage` command:
     ```bash
     qlmanage -r
     qlmanage -r cache
     ```

### Restarting Finder and QuickLook Processes

1. **Restart Finder**:
   - Hold the `Option` key and right-click the Finder icon in the Dock.
   - Click `Relaunch`.

2. **Restart QuickLook Processes Using Activity Monitor**:
   - Open `Activity Monitor` from `/Applications/Utilities`.
   - Search for and quit the following processes: `QuickLookUIService` and `QuickLookSatellite`.

### System Maintenance Using Disk Utility

To check and repair any disk-related issues, use Disk Utility:

1. **Open Disk Utility**:
   - Go to `/Applications/Utilities` and open `Disk Utility`.

2. **First Aid**:
   - Select your startup disk (typically named "Macintosh HD").
   - Click the `First Aid` tab.
   - Click `Run` to verify and repair the disk.

### Resetting QuickLook

Sometimes system or user-specific QuickLook settings can cause issues. You can reset these settings by following these steps:

1. **Remove QuickLook Cache**:
   - **Open Terminal**.
   - Run the following commands to remove user-specific QuickLook caches and preferences:
     ```bash
     rm -rf ~/Library/Caches/com.apple.QuickLookDaemon
     rm -rf ~/Library/Preferences/com.apple.QuickLookDaemon.plist
     ```

2. **Restart QuickLook**:
   ```bash
   qlmanage -r
   qlmanage -r cache
   ```

These commands and steps should help resolve graphics glitches and other issues related to QuickLook on macOS. If you identify any specific plugin causing the issue, make sure to remove it as described. If problems persist, consider further troubleshooting or a fresh macOS installation as a last resort.