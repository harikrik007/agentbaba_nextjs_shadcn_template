// lib/keystore-client.js

class KeystoreClient {
    constructor() {
        this.baseUrl = 'https://nfapi.nofrills.ai';
        this.apiKey = process.env.DB_API_KEY || '';
        this.projectId = process.env.PROJECT_ID || '';
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 minutes

        if (!this.apiKey) {
            console.warn('DB_API_KEY environment variable is not set');
        }
        if (!this.projectId) {
            console.warn('PROJECT_ID environment variable is not set');
        }
    }

    getCacheKey(projectId, secretName) {
        return `${projectId}:${secretName}`;
    }

    getFromCache(projectId, secretName) {
        const key = this.getCacheKey(projectId, secretName);
        const cached = this.cache.get(key);

        if (cached && cached.expiry > Date.now()) {
            return cached.value;
        }

        this.cache.delete(key);
        return null;
    }

    setCache(projectId, secretName, value) {
        const key = this.getCacheKey(projectId, secretName);
        this.cache.set(key, {
            value,
            expiry: Date.now() + this.cacheTTL,
        });
    }

    /**
     * Get a secret value by name
     * @param {string} secretName - The name of the secret to retrieve
     * @param {string} [projectId] - Optional project ID (uses process.env.PROJECT_ID if not provided)
     * @returns {Promise<string|null>} The secret value or null if not found
     */
    async getSecret(secretName, projectId = null) {
        // Use provided projectId or fall back to environment variable
        const pid = projectId || this.projectId;

        if (!pid) {
            console.error('Project ID is required. Provide it as parameter or set PROJECT_ID env variable');
            return null;
        }

        // Check cache first
        const cached = this.getFromCache(pid, secretName);
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/keystore/read_secret`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': `Key ${this.apiKey}`,
                    },
                    body: JSON.stringify({
                        data: {
                            project_id: pid,
                            secret_name: secretName,
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Keystore API error: ${response.status}`);
            }

            const result = await response.json();

            if (!result.status) {
                console.error(`Failed to fetch secret: ${result.message}`);
                return null;
            }

            const secretValue = result.secret_value || null;

            // Cache the result
            if (secretValue) {
                this.setCache(pid, secretName, secretValue);
            }

            return secretValue;
        } catch (error) {
            console.error(`Failed to fetch secret "${secretName}":`, error);
            return null;
        }
    }

    /**
     * Clear cache for a specific secret or all secrets
     * @param {string} [projectId] - Optional project ID
     * @param {string} [secretName] - Optional secret name
     */
    clearCache(projectId = null, secretName = null) {
        if (projectId && secretName) {
            const key = this.getCacheKey(projectId, secretName);
            this.cache.delete(key);
        } else if (projectId) {
            // Clear all secrets for this project
            for (const key of this.cache.keys()) {
                if (key.startsWith(`${projectId}:`)) {
                    this.cache.delete(key);
                }
            }
        } else {
            // Clear entire cache
            this.cache.clear();
        }
    }

    /**
     * Set custom cache TTL in milliseconds
     * @param {number} ttlMs - Time to live in milliseconds
     */
    setCacheTTL(ttlMs) {
        this.cacheTTL = ttlMs;
    }
}

// Singleton instance
const keystoreClient = new KeystoreClient();

/**
 * Convenience function for getting a secret
 * @param {string} secretName - The name of the secret to retrieve
 * @param {string} [projectId] - Optional project ID (uses process.env.PROJECT_ID if not provided)
 * @returns {Promise<string|null>} The secret value or null if not found
 */
async function getSecret(secretName, projectId = null) {
    return keystoreClient.getSecret(secretName, projectId);
}

module.exports = {
    keystoreClient,
    getSecret,
};