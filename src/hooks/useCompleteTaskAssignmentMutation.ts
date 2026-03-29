import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeTaskAssignmentRequest } from '../lib/taskAssignmentApi'
import type { MeResponse } from '../types/auth'
import { ME_QUERY_KEY } from './useMeQuery'

export function useCompleteTaskAssignmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => completeTaskAssignmentRequest(taskId),
    onSuccess: (_, taskId) => {
      queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, (current) => {
        if (!current) return current

        return {
          ...current,
          taskAssignments: (current.taskAssignments ?? []).map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'completed',
                  completedAt: task.completedAt ?? new Date().toISOString(),
                }
              : task,
          ),
          cleaningEvents: (current.cleaningEvents ?? []).map((event) => ({
            ...event,
            taskAssignments: (event.taskAssignments ?? []).map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    status: 'completed',
                  }
                : task,
            ),
          })),
        }
      })
    },
  })
}
