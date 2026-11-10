import { useState, useMemo } from "react"
import { useForm, useWatch, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, Check, Sparkles, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/shared/common"
import { useCreateUserMutation } from "@/redux/features/user/user.api"
import { buildFormData } from "@/utils/buildFormData"
import {
  USER_FORM_DEFAULT_VALUES,
  userFormSchema,
  type UserFormValues,
} from "@/types/validations/user/user.validation"

import {
  PersonalInfoSection,
  SecuritySection,
  RoleAccessSection,
  EmploymentSection,
  VerificationSection,
  LiveIdPreview,
  ReadinessChecklist,
  type ChecklistData,
} from "@/components/modules/user/create"

export default function CreateUser() {
  const navigate = useNavigate()
  const [createUser, { isLoading }] = useCreateUserMutation()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema as never) as never,
    defaultValues: {
      ...USER_FORM_DEFAULT_VALUES,
      joinDate: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  })

  const watchedValues = useWatch({ control })

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      const image = data.image?.[0]
      const payload = buildFormData({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        phone: data.phone?.trim() || undefined,
        image,
        employeeDetail: {
          designation: data.designation?.trim() || undefined,
          joinDate: data.joinDate,
          baseSalary: Number(data.baseSalary),
          nidNumber: data.nidNumber?.trim() || undefined,
          birthCertificateNumber: data.birthCertificateNumber?.trim() || undefined,
          address: data.address?.trim() || undefined,
          emergencyContact: data.emergencyContact?.trim() || undefined,
        },
      })

      const res = await createUser(payload).unwrap()
      toast.success(res?.message || `User "${data.name}" created successfully!`)
      if (res?.data?.id) {
        navigate(`/app/users/${res.data.id}/id-card`, { state: { user: res.data } })
      } else {
        navigate("/app/users")
      }
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : err instanceof Error
          ? err.message
          : "Failed to create user. Please check your inputs."
      toast.error(errorMsg || "An error occurred while creating user")
    }
  }

  // Live checklist calculation
  const checklist = useMemo<ChecklistData>(() => {
    const hasName = Boolean(watchedValues.name && watchedValues.name.trim().length >= 2)
    const hasEmail = Boolean(watchedValues.email && /^\S+@\S+\.\S+$/.test(watchedValues.email))
    const hasPassword = Boolean(watchedValues.password && watchedValues.password.length >= 6)
    const passwordMatches = Boolean(
      hasPassword && watchedValues.password === watchedValues.confirmPassword
    )
    const hasRole = Boolean(watchedValues.role)
    const hasSalary =
      typeof watchedValues.baseSalary === "number" &&
      Number.isFinite(watchedValues.baseSalary) &&
      watchedValues.baseSalary >= 0
    const hasJoinDate = Boolean(watchedValues.joinDate)
    const hasLegalId = Boolean(
      (watchedValues.nidNumber && watchedValues.nidNumber.trim()) ||
        (watchedValues.birthCertificateNumber && watchedValues.birthCertificateNumber.trim())
    )

    const items = [
      { label: "Personal profile (Name & Email)", completed: hasName && hasEmail },
      { label: "Password & matching confirmation", completed: passwordMatches },
      { label: "Role & employment status", completed: hasRole },
      { label: "Join date & base salary", completed: hasJoinDate && hasSalary },
      { label: "Legal ID (NID or Birth Cert)", completed: hasLegalId },
    ]

    const completedCount = items.filter((i) => i.completed).length
    return {
      items,
      completedCount,
      total: items.length,
      percent: Math.round((completedCount / items.length) * 100),
    }
  }, [watchedValues])

  const handleClear = () => {
    reset()
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  return (
    <PageContainer className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b p-5 rounded-lg bg-card shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Create Team Member
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 py-0.5 text-xs font-medium">
              <Sparkles className="size-3 text-primary" />
              HR & Permissions
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Register a new employee, set up authentication credentials, and assign role privileges.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/app/users")}
            className="gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Back to Users
          </Button>
        </div>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <PersonalInfoSection
              register={register}
              errors={errors}
              setValue={setValue}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />

            <SecuritySection
              register={register}
              errors={errors}
              passwordValue={watchedValues.password}
              confirmPasswordValue={watchedValues.confirmPassword}
            />

            <RoleAccessSection
              currentRole={watchedValues.role}
              currentStatus={watchedValues.status}
              setValue={setValue}
              errors={errors}
            />

            <EmploymentSection register={register} errors={errors} />

            <VerificationSection register={register} errors={errors} />

            {/* Bottom Actions Bar */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3  bg-card p-4 rounded-xl">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/app/users")}
                disabled={isLoading}
                className="w-full sm:w-auto cursor-pointer"
              >
                Back to All Users
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClear}
                  disabled={isLoading || !isDirty}
                  className="flex-1 sm:flex-initial cursor-pointer"
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial min-w-40 shadow-sm font-medium gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      Save & Create User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Card & Progress (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            <LiveIdPreview
              watchedValues={watchedValues}
              imagePreview={imagePreview}
            />

            <ReadinessChecklist checklist={checklist} />
          </div>
        </div>
      </form>
    </PageContainer>
  )
}
