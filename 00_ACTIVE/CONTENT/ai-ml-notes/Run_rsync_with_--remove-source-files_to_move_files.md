### rsync -avP with remove

The `rsync` command is commonly used in UNIX-based systems for copying and synchronizing files and directories. The `-avP` options are frequently used combinations that make `rsync` powerful for these purposes:

- `-a` stands for "archive" and ensures that symbolic links, devices, attributes, permissions, ownerships, etc., are preserved in the transfer.
- `-v` stands for "verbose," which increases the amount of information you are provided during the transfer process.
- `-P` is a combination option equivalent to `--partial` and `--progress`. `--partial` ensures that partially transferred files are kept (so you don't need to start over if interrupted), and `--progress` shows the progress of the transfer.

To mimic a situation where files that have been deleted from the source are also deleted from the destination, you can add the `--delete` option. This option tells `rsync` to delete files from the destination directory if they have been removed from the source directory.

Here's an example `rsync` command that includes these options:

```sh
rsync -avP --delete /path/to/source/ /path/to/destination/
```

Let's break down this example:

- `/path/to/source/` is the source directory.
- `/path/to/destination/` is the destination directory.
- `-a` ensures all attributes are preserved.
- `-v` gives verbose output.
- `-P` provides progress information and keeps partially transferred files.
- `--delete` ensures that any files deleted from the source are also deleted from the destination.

With this command, `rsync` will synchronize the contents of `/path/to/source/` with `/path/to/destination/`, maintaining all file attributes, providing detailed output, progress information, keeping partially transferred files if interrupted, and removing any files from the destination that no longer exist in the source.

### remove source

If you want to **move** files from the source directory to the destination directory using `rsync` (which means copying the files to the destination and then deleting them from the source), you can achieve this by combining `rsync` with the `--remove-source-files` option.

The `--remove-source-files` option will remove the source files after they have been successfully copied to the destination.

Here's an example `rsync` command that does this:

```sh
rsync -avP --remove-source-files /path/to/source/ /path/to/destination/
```

After running this command, the files will be copied from `/path/to/source/` to `/path/to/destination/` and then deleted from `/path/to/source/` once the copy operation is successful.

Please note that this only applies to files; directories won't be removed even if they are empty after the transfer. If you also want to remove empty directories from the source, you can use the `find` command to identify and remove them after the `rsync` operation. Here’s how you can do it:

```sh
# Run rsync with --remove-source-files to move files
rsync -avP --remove-source-files /path/to/source/ /path/to/destination/

# Find and remove empty directories
find /path/to/source/ -type d -empty -delete
```

In this example:

1. All files are moved from `/path/to/source/` to `/path/to/destination/`.
2. Any empty directories left in `/path/to/source/` are then removed using the `find` command.

This approach ensures that your source directory `/path/to/source/` is cleaned up after the transfer, both files and directories.
