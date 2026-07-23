import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Edit3, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ContentWrapper } from "@/components/common/ContentWrapper";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
  type AdminUserPayload,
} from "@/lib/adminUsers";
import type { AdminRole, AdminUser } from "@/lib/auth";

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  is_active: boolean;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  is_active: true,
};

function userToForm(user?: AdminUser | null): UserForm {
  if (!user) {
    return emptyForm;
  }

  return {
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    is_active: user.is_active,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data.message ?? fallback;
  }

  return fallback;
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const { canManageUsers, user: currentUser } = useAdminAuth();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const { data = [], isError, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    enabled: canManageUsers,
  });

  async function refreshUsers() {
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  }

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: async () => {
      toast.success("Admin berhasil dibuat.");
      setIsEditorOpen(false);
      await refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal membuat admin."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminUser,
    onSuccess: async () => {
      toast.success("Admin berhasil diupdate.");
      setIsEditorOpen(false);
      setEditingUser(null);
      await refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal mengupdate admin."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: async () => {
      toast.success("Admin berhasil dihapus.");
      setDeleteTarget(null);
      await refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menghapus admin."));
    },
  });

  function openAddDialog() {
    setEditingUser(null);
    setIsEditorOpen(true);
  }

  function openEditDialog(user: AdminUser) {
    setEditingUser(user);
    setIsEditorOpen(true);
  }

  if (!canManageUsers) {
    return (
      <ContentWrapper>
        <PageHeader
          title="Users"
          description="Only super admin can manage administrator accounts."
        />
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Akun admin biasa tetap bisa edit konten website, tapi tidak bisa
            membuat atau mengubah akun administrator.
          </CardContent>
        </Card>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <PageHeader
        title="Users"
        description="Manage super admin and admin access for the website CMS."
        actions={
          <Button
            type="button"
            className="bg-[#07503d] text-white hover:bg-[#064433]"
            onClick={openAddDialog}
          >
            <Plus className="size-4" />
            Add Admin
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            <ShieldCheck className="size-4" />
            Administrator Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid min-h-40 place-items-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-8 text-sm text-destructive">
              Gagal mengambil data admin.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-28 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((adminUser) => (
                    <TableRow key={adminUser.id}>
                      <TableCell className="font-normal">
                        {adminUser.name}
                      </TableCell>
                      <TableCell>{adminUser.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-[#07503d]/25 bg-[#07503d]/10 text-[#07503d] capitalize"
                        >
                          {adminUser.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            adminUser.is_active
                              ? "border-[#07503d]/25 bg-[#07503d] text-white"
                              : "border-[#07503d]/20 bg-[#07503d]/5 text-[#07503d]"
                          }
                        >
                          {adminUser.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="icon-sm"
                            className="border-[#07503d]/25 bg-[#07503d]/10 text-[#07503d] hover:bg-[#07503d] hover:text-white"
                            onClick={() => openEditDialog(adminUser)}
                          >
                            <Edit3 className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={adminUser.id === currentUser?.id}
                            onClick={() => setDeleteTarget(adminUser)}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <UserEditorDialog
        user={editingUser}
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) {
            setEditingUser(null);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(form) => {
          if (editingUser) {
            const payload: AdminUserPayload = {
              name: form.name,
              email: form.email,
              role: form.role,
              is_active: form.is_active,
            };

            if (form.password.trim()) {
              payload.password = form.password;
            }

            updateMutation.mutate({ id: editingUser.id, payload });
            return;
          }

          createMutation.mutate({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            is_active: form.is_active,
          });
        }}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete admin account?</DialogTitle>
            <DialogDescription>
              This action will remove {deleteTarget?.name} from CMS access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentWrapper>
  );
}

function UserEditorDialog({
  user,
  open,
  onOpenChange,
  isSubmitting,
  onSubmit,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (form: UserForm) => void;
}) {
  const [form, setForm] = useState<UserForm>(userToForm(user));

  useEffect(() => {
    if (open) {
      setForm(userToForm(user));
    }
  }, [open, user]);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setForm(userToForm(user));
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden p-0 sm:max-w-3xl">
        <form
          className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col"
          onSubmit={handleSubmit}
        >
          <DialogHeader className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
            <DialogTitle>{user ? "Edit Admin" : "Add Admin"}</DialogTitle>
            <DialogDescription>
              Super admin can create admin accounts and control CMS access.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Name</Label>
              <Input
                id="admin-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-password">
                Password {user ? "(leave blank to keep)" : ""}
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                required={!user}
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    role: value as AdminRole,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border-input accent-[#07503d]"
              checked={form.is_active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active: event.target.checked,
                }))
              }
            />
            Active account
          </label>
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 rounded-b-xl px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#07503d] text-white hover:bg-[#064433]"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
