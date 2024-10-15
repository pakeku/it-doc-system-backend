import express from "express";
import {
  validateAccessToken,
  checkRequiredPermissions,
} from "../middleware/auth0.middleware";
import { SecretService } from "./secrets.service";
import { SecretPermissions } from "./secrets.permissions";

export const secretsRouter = express.Router();

// Get all secrets (requires authentication and read permissions)
secretsRouter.get(
  "/",
  validateAccessToken,
  checkRequiredPermissions([SecretPermissions.Read]),
  async (req, res) => {
    try {
      const secrets = await SecretService.getAllSecrets();
      res.status(200).json(secrets);
    } catch (error) {
      console.error("Error fetching secrets:", error);
      res.status(500).json({ message: "Error fetching secrets", error });
    }
  }
);

// Get a single secret by ID (requires authentication)
secretsRouter.get(
  "/:id",
  validateAccessToken,
  checkRequiredPermissions([SecretPermissions.Read]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const secret = await SecretService.getSecretById(id);
      if (!secret) {
        return res.status(404).json({ message: "Secret not found" });
      }
      res.status(200).json(secret);
    } catch (error) {
      console.error("Error fetching secret:", error);
      res.status(500).json({ message: "Error fetching secret", error });
    }
  }
);

// Get and decrypt a specific secret by ID (requires authentication and decrypt permission)
secretsRouter.get(
  "/:id/decrypted",
  validateAccessToken,
  checkRequiredPermissions([SecretPermissions.Decrypt]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const decryptedValue = await SecretService.getDecryptedSecretById(id);
      
      if (!decryptedValue) {
        return res.status(404).json({ message: "Secret not found" });
      }
      
      res.status(200).json({ decryptedValue });
    } catch (error) {
      console.error("Error decrypting secret:", error);
      res.status(500).json({ message: "Error decrypting secret", error });
    }
  }
);

// Create a new secret (requires authentication and write permissions)
secretsRouter.post(
  "/",
  validateAccessToken,
  checkRequiredPermissions([SecretPermissions.Write]), 
  async (req, res) => {
    const { name, description, secretValue } = req.body;
    if (!name || !secretValue) {
      return res.status(400).json({ message: "Name and secret value are required" });
    }

    try {
      const newSecret = await SecretService.createSecret(name, description, secretValue);
      res.status(201).json(newSecret);
    } catch (error) {
      console.error("Error creating secret:", error);
      res.status(500).json({ message: "Error creating secret", error });
    }
  }
);

// Update a secret by ID (requires authentication)
secretsRouter.put(
  "/:id",
  validateAccessToken,
  checkRequiredPermissions([SecretPermissions.Write]),
  async (req, res) => {
    const { id } = req.params;
    const { name, description, secretValue } = req.body;

    try {
      const updatedSecret = await SecretService.updateSecret(id, name, description, secretValue);
      if (!updatedSecret) {
        return res.status(404).json({ message: "Secret not found" });
      }
      res.status(200).json(updatedSecret);
    } catch (error) {
      console.error("Error updating secret:", error);
      res.status(500).json({ message: "Error updating secret", error });
    }
  }
);

// Delete a secret by ID (requires authentication)
secretsRouter.delete(
  "/:id",
  validateAccessToken,
  checkRequiredPermissions([SecretPermissions.Delete]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const deletedSecret = await SecretService.deleteSecret(id);
      if (!deletedSecret) {
        return res.status(404).json({ message: "Secret not found" });
      }
      res.status(200).json({ message: "Secret deleted" });
    } catch (error) {
      console.error("Error deleting secret:", error);
      res.status(500).json({ message: "Error deleting secret", error });
    }
  }
);
