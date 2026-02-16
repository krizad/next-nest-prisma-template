'use server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

/**
 * Server Action: Create a new user
 * Calls backend API endpoint: POST /api/v1/users
 */
export async function createUserAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = (formData.get('role') as string) || 'user';

  // Validate
  if (!name || !email) {
    return { success: false, error: 'Name and email are required' };
  }

  if (!email.includes('@')) {
    return { success: false, error: 'Invalid email format' };
  }

  try {
    const payload: CreateUserPayload = {
      name,
      email,
      password: 'defaultPassword123', // In production, require user to set password
    };

    if (role) {
      payload.role = role;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error?.message || 'Failed to create user',
      };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Network error: Failed to create user',
    };
  }
}

/**
 * Server Action: Delete a user by ID
 * Calls backend API endpoint: DELETE /api/v1/users/:id
 */
export async function deleteUserAction(userId: string) {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      return {
        success: false,
        error: data.message || data.error?.message || 'Failed to delete user',
      };
    }

    return { success: true, data: { id: userId } };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: 'Network error: Failed to delete user',
    };
  }
}
