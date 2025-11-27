export interface IStorageAdapter {
  /*
    Save a stream to a given destination path (relative to adapter root)
    Return the final stored path (adapter-specific) and public URL (if available)
    */
  save(
    stream: NodeJS.ReadableStream,
    destinationPath: string,
  ): Promise<{ path: string; url?: string }>;

  /*
    Move/rename a file within adapter. Useful for promoting temp -> permanent.
    */
  move(
    srcPath: string,
    destPath: string,
  ): Promise<{ path: string; url?: string }>;

  /*
    Delete a stored file. Should be idempotent.
    */
  delete(path: string): Promise<void>;

  /*
    Create directory if not exists.
    */
  ensureDir(path: string): Promise<void>;
}
