def batch_process_files(
    files,
    process_func,
    batch_size=50,
    max_workers=None
):
    """
    Batch process files with ThreadPoolExecutor and progress tracking.

    Args:
        files: List of file paths to process
        process_func: Function to call for each file
        batch_size: Number of files per batch
        max_workers: Number of worker threads (default: CPU count)

    Returns:
        List of results from processing

    Source: batch_quality_improver.py, advanced_quality_enhancer.py
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed
    from tqdm import tqdm
    import multiprocessing

    if max_workers is None:
        max_workers = min(multiprocessing.cpu_count(), 8)

    # Create batches
    batches = [files[i:i + batch_size] for i in range(0, len(files), batch_size)]

    results = []
    for batch_num, batch_files in enumerate(batches):
        print(f"Processing batch {batch_num + 1}/{len(batches)} ({len(batch_files)} files)")

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {
                executor.submit(process_func, file_path): file_path
                for file_path in batch_files
            }

            for future in tqdm(as_completed(future_to_file), total=len(batch_files)):
                file_path = future_to_file[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
                    results.append(None)

    return results
