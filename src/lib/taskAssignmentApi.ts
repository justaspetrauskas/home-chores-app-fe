import axios from 'axios'
import { apiClient } from './apiClient'

type CompleteTaskAssignmentResponse = {
  status?: string
  message?: string
}

export async function completeTaskAssignmentRequest(taskId: string): Promise<void> {
  try {
    const { data } = await apiClient.post<CompleteTaskAssignmentResponse>(`/task-assignments/${taskId}/complete`)

    if (data?.status && data.status !== 'success') {
      throw new Error(data.message || 'Complete task assignment did not return success status')
    }
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to complete task assignment')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to complete task assignment')
  }
}
