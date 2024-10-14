import { SecretModel, SecretDocument } from "./secrets.model";
import { encrypt } from '../utils/encrypt-decrypt';

export class SecretService {
    // Create a new secret
    public static async createSecret(
        name: string,
        description: string,
        secretValue: string,
    ): Promise<SecretDocument> {
        // Create and save the new secret (encryption is handled by the model's pre-save middleware)
        const { encrypted, iv } = encrypt(secretValue);
        const secret = new SecretModel({
            name,
            description,
            encrypted,
            iv
        });

        await secret.save();
        return secret;
    }

    // Get all secrets
    public static async getAllSecrets(): Promise<SecretDocument[]> {
        return SecretModel.find();
    }

    // Get a specific secret by ID
    public static async getSecretById(id: string): Promise<SecretDocument | null> {
        return SecretModel.findById(id);
    }

    // Decrypt a secret by ID
    public static async getDecryptedSecretById(id: string): Promise<string | null> {
        const secret = await SecretModel.findById(id);
        if (!secret) {
            throw new Error("Secret not found");
        }

        // Decrypt and return the secret value (decryption is handled by the model's getValue method)
        return secret.getValue();
    }

    // Update a secret
    public static async updateSecret(
        id: string,
        name: string,
        description: string,
        newSecretValue?: string
    ): Promise<SecretDocument | null> {
        const secret = await SecretModel.findById(id);

        if (!secret) {
            throw new Error("Secret not found");
        }

        // Update the fields
        secret.name = name;
        secret.description = description;

        if (newSecretValue) {
            // If new secret value is provided, update it (encryption will be handled automatically)
            secret.encrypted = newSecretValue;
        }

        await secret.save();
        return secret;
    }

    // Delete a secret by ID
    public static async deleteSecret(id: string): Promise<SecretDocument | null> {
        return SecretModel.findByIdAndDelete(id);
    }
}
