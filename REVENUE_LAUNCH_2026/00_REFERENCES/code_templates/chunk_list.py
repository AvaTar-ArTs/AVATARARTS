def chunk_list(data, chunk_size):
    """
    Split a list into chunks of specified size.

    Args:
        data: List to chunk
        chunk_size: Size of each chunk

    Returns:
        List of chunks

    Usage:
        files = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt']
        batches = chunk_list(files, 2)
        # Result: [['file1.txt', 'file2.txt'], ['file3.txt', 'file4.txt'], ['file5.txt']]

    Source: enhanced_utilities.py
    """
    return [data[i:i + chunk_size] for i in range(0, len(data), chunk_size)]
