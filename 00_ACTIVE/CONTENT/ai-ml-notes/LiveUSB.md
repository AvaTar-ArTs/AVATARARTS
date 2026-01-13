Creating a bootable live USB of Xubuntu on macOS involves several steps. Here's how to do it:

### Step 1: Download Xubuntu ISO

1. **Go to the Xubuntu website**:
   - [Xubuntu Downloads](https://xubuntu.org/download/)

2. **Download the appropriate ISO**:
   - Choose the version of Xubuntu you wish to install and download the ISO file.

### Step 2: Prepare a USB Drive

1. **Insert the USB Drive**:
   - Insert a USB drive with at least 4GB of space into your Mac.

2. **Open Disk Utility**:
   - Go to Finder > Applications > Utilities > Disk Utility.

3. **Format the USB Drive**:
   - Select your USB drive from the list of drives.
   - Click on the "Erase" button.
   - Set **Format** to `MS-DOS (FAT)` and **Scheme** to `GUID Partition Map`.
   - Click "Erase" to format the drive.

### Step 3: Convert the ISO to IMG Format

1. **Open Terminal**:
   - Go to Finder > Applications > Utilities > Terminal.

2. **Convert the ISO to IMG**:
   - Use the `hdiutil` command to convert the ISO to an IMG file:

     ```bash
     hdiutil convert -format UDRW -o ~/path/to/xubuntu.img ~/path/to/xubuntu.iso
     ```

   - Replace `~/path/to/xubuntu.iso` with the path to the downloaded ISO file.
   - This will create a file named `xubuntu.img.dmg`. You'll need to rename it:

     ```bash
     mv ~/path/to/xubuntu.img.dmg ~/path/to/xubuntu.img
     ```

### Step 4: Write the IMG to USB

1. **Identify Your USB Drive**:
   - In Terminal, list all disk partitions with:

     ```bash
     diskutil list
     ```

   - Find your USB drive from the list (It might be `/dev/disk2` or similar).

2. **Unmount the USB Drive**:
   - Unmount the USB drive using `diskutil`:

     ```bash
     diskutil unmountDisk /dev/diskN
     ```

   - Replace `N` with the number corresponding to your USB drive.

3. **Write the IMG to USB Drive**:
   - Use `dd` to write the IMG file to the USB drive:

     ```bash
     sudo dd if=~/path/to/xubuntu.img of=/dev/rdiskN bs=1m
     ```

   - `rdiskN` should be the raw disk device. Using `r` in front of `diskN` can make the process faster.
   - You need to replace `N` with your disk number.
   - This command will take some time to complete. Be patient and do not interrupt the process.

4. **Eject the USB Drive**:
   - After the process completes, eject the USB drive:

     ```bash
     diskutil eject /dev/diskN
     ```

### Step 5: Boot From USB

1. **Insert the USB Drive** into the computer you want to install Xubuntu on.

2. **Restart Your Mac**:
   - If you are trying to boot the Xubuntu live USB from a Mac, restart your Mac and hold down the `Option (⌥)` key immediately after turning on your Mac.
   - Select the USB drive from the boot menu.

3. **Follow On-Screen Instructions**:
   - Your PC or Mac should now boot from the USB drive, and you can follow the on-screen instructions to try or install Xubuntu.

### Summary

1. **Download Xubuntu ISO**
2. **Format USB Drive with Disk Utility**
3. **Convert ISO to IMG using hdiutil**
4. **Write IMG to USB Drive using dd**
5. **Boot from the USB Drive**

By following these detailed steps, you can create a bootable live USB of Xubuntu on your macOS machine.