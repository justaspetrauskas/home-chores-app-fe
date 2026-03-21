import React, { useMemo, useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useHouseholdsQuery } from '../hooks/useHouseholdsQuery'
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import HouseholdRow from '../components/households/HouseholdRow'
import { Outlet } from 'react-router-dom'
import { useDeleteHouseholdMutation } from '../hooks/useDeleteHouseholdMutation'
import { useSetDefaultHouseholdMutation } from '../hooks/useSetDefaultHouseholdMutation'
import ConfirmModal from '../components/ui/ConfirmModal'
import ToastMessage from '../components/ui/ToastMessage'
import { useSelectedHouseholdStorage } from '../hooks/useSelectedHouseholdStorage'

function formatMembershipRole(role?: string) {
  if (!role) return null
  const normalized = role.replace(/_/g, ' ').toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function isAdminRole(role?: string) {
  const normalizedRole = formatMembershipRole(role)
  return normalizedRole?.toLowerCase().includes('admin') ?? false
}

const Households: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const memberships = user?.memberships ?? []
  const hasMemberships = memberships.length > 0
  const membershipRoles = Array.from(new Set(memberships.map((membership) => formatMembershipRole(membership.role)).filter(Boolean)))
  const overviewDescription = hasMemberships
    ? `You currently belong to ${memberships.length} household${memberships.length === 1 ? '' : 's'}${membershipRoles.length > 0 ? ` as ${membershipRoles.join(', ')}.` : '.'}`
    : 'You are not part of any household yet. Create one here to start inviting members and organizing chores.'

  const { data: households, isLoading: householdsLoading } = useHouseholdsQuery(hasMemberships)
  const setDefaultMutation = useSetDefaultHouseholdMutation()
  const deleteMutation = useDeleteHouseholdMutation()
  const { value: selectedHouseholdFromStorage, setValue: setSelectedHouseholdInStorage } = useSelectedHouseholdStorage()
  const isOnNewForm = Boolean(useMatch('/households/new'))
  const isOnHouseholdSubPage = Boolean(useMatch('/households/:householdId/*')) && !isOnNewForm
  const [pendingAction, setPendingAction] = useState<
    | {
        type: 'set-default' | 'delete'
        householdId: string
        householdName: string
      }
    | null
  >(null)
  const [toast, setToast] = useState<{
    open: boolean
    title: string
    description?: string
    variant: 'success' | 'info' | 'error'
  }>({
    open: false,
    title: '',
    variant: 'success',
  })

  const membershipByHouseholdId = new Map(memberships.map((membership) => [membership.householdId, membership]))
  const householdOptions = memberships
    .filter((membership) => membership.householdId && (membership.household?.name || membership.householdName))
    .map((membership) => ({
      id: membership.householdId as string,
      name: (membership.household?.name ?? membership.householdName) as string,
      membershipStatus: formatMembershipRole(membership.role) ?? 'Member',
    }))
  const hasStoredHouseholdInMemberships = Boolean(
    selectedHouseholdFromStorage && householdOptions.some((option) => option.id === selectedHouseholdFromStorage),
  )
  const selectedHouseholdId = hasStoredHouseholdInMemberships
    ? selectedHouseholdFromStorage
    : user?.defaultHousehold?.id ?? householdOptions[0]?.id
  const selectedHouseholdIdForHeader = selectedHouseholdId ?? undefined

  const handleSelectHousehold = (householdId: string) => {
    if (!householdId || householdId === selectedHouseholdId) return
    setSelectedHouseholdInStorage(householdId)

    const selectedHousehold = householdOptions.find((option) => option.id === householdId)

    setDefaultMutation.mutate(householdId, {
      onSuccess: () => {
        setToast({
          open: true,
          title: 'Default household updated',
          description: selectedHousehold ? `"${selectedHousehold.name}" is now your default household.` : undefined,
          variant: 'success',
        })
      },
      onError: (error) => {
        setToast({
          open: true,
          title: 'Update failed',
          description: error instanceof Error ? error.message : 'Unable to set default household.',
          variant: 'error',
        })
      },
    })
  }

  const isConfirming = useMemo(() => {
    if (!pendingAction) return false
    if (pendingAction.type === 'set-default') {
      return setDefaultMutation.isPending && setDefaultMutation.variables === pendingAction.householdId
    }
    return deleteMutation.isPending && deleteMutation.variables === pendingAction.householdId
  }, [pendingAction, setDefaultMutation.isPending, setDefaultMutation.variables, deleteMutation.isPending, deleteMutation.variables])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleConfirmAction = () => {
    if (!pendingAction) return

    if (pendingAction.type === 'set-default') {
      const { householdId, householdName } = pendingAction

      setDefaultMutation.mutate(householdId, {
        onSuccess: () => {
          setPendingAction(null)
          setToast({
            open: true,
            title: 'Default household updated',
            description: `"${householdName}" is now your default household.`,
            variant: 'success',
          })
        },
        onError: (error) => {
          setToast({
            open: true,
            title: 'Update failed',
            description: error instanceof Error ? error.message : 'Unable to set default household.',
            variant: 'error',
          })
        },
      })
      return
    }

    const { householdId, householdName } = pendingAction
    setPendingAction(null)

    deleteMutation.mutate(householdId, {
      onSuccess: () => {
        setToast({
          open: true,
          title: 'Household deleted',
          description: `"${householdName}" was removed successfully.`,
          variant: 'success',
        })
      },
      onError: (error) => {
        setToast({
          open: true,
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Unable to delete household.',
          variant: 'error',
        })
      },
    })
  }

  return (
    <AuthenticatedLayout
      onPrimaryAction={!isOnNewForm ? () => navigate('/households/new') : undefined}
      primaryActionLabel={!isOnNewForm ? 'Create Household' : undefined}
      onLogout={handleLogout}
      showPrimaryAction={!isOnNewForm}
      householdOptions={householdOptions}
      selectedHouseholdId={selectedHouseholdIdForHeader}
      onSelectHousehold={handleSelectHousehold}
      isSwitchingHousehold={setDefaultMutation.isPending}
    >
      <ToastMessage
        open={toast.open}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />

      <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
        Welcome back{user?.username ? `, ${user.username}` : ''}. Manage your household setup from here.
      </p>

      <DashboardOverview title="Households" description={overviewDescription} />

      {hasMemberships && !isOnNewForm && !isOnHouseholdSubPage && (
        householdsLoading ? (
          <p className="text-sm text-slate-400 mb-6">Loading households…</p>
        ) : households && households.length > 0 ? (
          <ul className="mb-6 space-y-3">
            {households.map((household) => (
              <HouseholdRow
                key={household.id}
                household={household}
                isDefault={user?.defaultHousehold?.id === household.id}
                canDelete={isAdminRole(membershipByHouseholdId.get(household.id)?.role)}
                onOpen={(householdId) => navigate(`/households/${householdId}`)}
                onMakeDefault={(householdId) =>
                  setPendingAction({
                    type: 'set-default',
                    householdId,
                    householdName: household.name,
                  })
                }
                onDelete={(householdId) =>
                  setPendingAction({
                    type: 'delete',
                    householdId,
                    householdName: household.name,
                  })
                }
                isSettingDefault={setDefaultMutation.isPending && setDefaultMutation.variables === household.id}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === household.id}
              />
            ))}
          </ul>
        ) : null
      )}

      <ConfirmModal
        open={Boolean(pendingAction)}
        title={pendingAction?.type === 'delete' ? 'Delete household?' : 'Set as default household?'}
        message={
          pendingAction?.type === 'delete'
            ? `Are you sure you want to delete "${pendingAction.householdName}"? This action cannot be undone.`
            : `Set "${pendingAction?.householdName}" as your default household?`
        }
        confirmLabel={pendingAction?.type === 'delete' ? 'Delete household' : 'Set as default'}
        confirmVariant={pendingAction?.type === 'delete' ? 'danger' : 'default'}
        isConfirming={isConfirming}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />

      <Outlet />
    </AuthenticatedLayout>
  )
}

export default Households