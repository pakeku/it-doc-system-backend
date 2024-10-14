import mongoose, { Schema, Document } from "mongoose";
import { encrypt, decrypt } from "../utils/encrypt-decrypt";

// Interface defining the structure of a Secret
export interface Secret {
  name: string;               // Name of the secret (e.g., service or key name)
  description?: string;        // Optional description for context or usage of the secret
  encrypted: string;           // The encrypted data (in hex format)
  iv: string;                  // Initialization vector used for encryption (in hex format)
}

// Mongoose Document type with additional MongoDB fields like _id, timestamps, etc.
export interface SecretDocument extends Secret, Document {
  getValue(): string;          // Method to decrypt and retrieve the secret
}

// Create Mongoose Schema for Secret
const SecretSchema = new Schema<SecretDocument>(
  {
    name: { type: String, required: true },              // Name is required
    description: { type: String },                       // Description is optional
    encrypted: { type: String, required: true },         // Encrypted data is required
    iv: { type: String, required: true },                // IV is required for decryption
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Method to decrypt the secret value
SecretSchema.methods.getValue = function (): string {
  return decrypt({ iv: this.iv, encryptedData: this.encrypted });
};

// Create and export the Mongoose model for Secrets
export const SecretModel = mongoose.model<SecretDocument>("Secret", SecretSchema);