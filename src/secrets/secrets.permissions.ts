export enum SecretPermissions {
  Read = "read:secrets",        // Permission to read/decrypt secrets
  Write = "write:secrets",      // Permission to create or update secrets
  Delete = "delete:secrets",    // Permission to delete secrets
  Decrypt = "decrypt:secrets",  // Permission to decrypt secrets
}