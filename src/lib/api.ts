// API base URL
const API_BASE_URL = 'http://localhost:3001';

// API helper functions
export const api = {
    // Create a new batch
    createBatch: async (crop: string, weight: string, location: string, basePrice: number) => {
        const response = await fetch(`${API_BASE_URL}/api/batch/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ crop, weight, location, basePrice }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create batch');
        }

        return response.json();
    },

    // Update batch (add stakeholder fee)
    updateBatch: async (batchId: number, role: string, fee: number, description: string) => {
        const response = await fetch(`${API_BASE_URL}/api/batch/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ batchId, role, fee, description }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update batch');
        }

        return response.json();
    },

    // Get batch by ID
    getBatch: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/api/batch/${id}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch batch');
        }

        return response.json();
    },

    // Get all batches
    getAllBatches: async () => {
        const response = await fetch(`${API_BASE_URL}/api/batches`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch batches');
        }

        return response.json();
    },

    // Get batch count
    getBatchCount: async () => {
        const response = await fetch(`${API_BASE_URL}/api/stats/count`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch batch count');
        }

        return response.json();
    }
};

// Type definitions
export interface Batch {
    id: number;
    farmer_address: string;
    crop: string;
    weight: string;
    location: string;
    status: string;
    total_price: number;
    created_at: number;
    updated_at: number;
    priceBreakdown?: PriceComponent[];
}

export interface PriceComponent {
    stakeholder_address: string;
    role: string;
    amount: number;
    description: string;
    timestamp: number;
}
