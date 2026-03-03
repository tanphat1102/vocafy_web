"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  premiumPackageService,
  paymentMethodService,
  type PremiumPackage,
  type PaymentMethod,
} from "@/services";

export default function AdminPaymentsPage() {
  // Premium Packages State
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesPage, setPackagesPage] = useState(0);
  const [packagesTotalPages, setPackagesTotalPages] = useState(0);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsPage, setMethodsPage] = useState(0);
  const [methodsTotalPages, setMethodsTotalPages] = useState(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState("packages");

  // Package Dialog State
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PremiumPackage | null>(
    null,
  );
  const [packageFormData, setPackageFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration_days: 30,
    active: true,
  });

  // Method Dialog State
  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [methodFormData, setMethodFormData] = useState({
    provider: "",
    description: "",
    active: true,
  });

  const fetchPackages = useCallback(async () => {
    try {
      setPackagesLoading(true);
      const response = await premiumPackageService.list({
        page: packagesPage,
        size: 10,
      });
      setPackages(response.result.content);
      setPackagesTotalPages(response.result.total_pages);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      toast.error((err as Error).message || "Failed to load packages");
    } finally {
      setPackagesLoading(false);
    }
  }, [packagesPage]);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setMethodsLoading(true);
      const response = await paymentMethodService.list({
        page: methodsPage,
        size: 10,
      });
      setPaymentMethods(response.result.content);
      setMethodsTotalPages(response.result.total_pages);
    } catch (err) {
      console.error("Failed to fetch payment methods:", err);
      toast.error((err as Error).message || "Failed to load payment methods");
    } finally {
      setMethodsLoading(false);
    }
  }, [methodsPage]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const handleDeletePackage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await premiumPackageService.delete(id);
      fetchPackages();
      toast.success("Package deleted successfully");
    } catch (err) {
      console.error("Failed to delete package:", err);
      toast.error((err as Error).message || "Failed to delete package");
    }
  };

  const handleOpenPackageDialog = (pkg?: PremiumPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageFormData({
        name: pkg.name,
        description: pkg.description || "",
        price: pkg.price,
        duration_days: pkg.duration_days,
        active: pkg.active,
      });
    } else {
      setEditingPackage(null);
      setPackageFormData({
        name: "",
        description: "",
        price: 0,
        duration_days: 30,
        active: true,
      });
    }
    setPackageDialogOpen(true);
  };

  const handleSavePackage = async () => {
    try {
      if (editingPackage) {
        await premiumPackageService.update(editingPackage.id, packageFormData);
      } else {
        await premiumPackageService.create(packageFormData);
      }
      setPackageDialogOpen(false);
      fetchPackages();
      toast.success("Package saved successfully");
    } catch (err) {
      console.error("Failed to save package:", err);
      toast.error((err as Error).message || "Failed to save package");
    }
  };

  const handleToggleMethodActive = async (id: number, active: boolean) => {
    try {
      await paymentMethodService.toggleActive(id, { active: !active });
      fetchPaymentMethods();
      toast.success("Payment method updated successfully");
    } catch (err) {
      console.error("Failed to toggle payment method:", err);
      toast.error((err as Error).message || "Failed to toggle payment method");
    }
  };

  const handleOpenMethodDialog = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      setMethodFormData({
        provider: method.provider,
        description: method.description || "",
        active: method.active,
      });
    } else {
      setEditingMethod(null);
      setMethodFormData({
        provider: "",
        description: "",
        active: true,
      });
    }
    setMethodDialogOpen(true);
  };

  const handleSaveMethod = async () => {
    try {
      if (editingMethod) {
        await paymentMethodService.update(editingMethod.id, methodFormData);
      } else {
        await paymentMethodService.create(methodFormData);
      }
      setMethodDialogOpen(false);
      fetchPaymentMethods();
      toast.success("Payment method saved successfully");
    } catch (err) {
      console.error("Failed to save payment method:", err);
      toast.error((err as Error).message || "Failed to save payment method");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Payment Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage subscription packages and payments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Premium Packages
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {packages.length}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Total packages
                </p>
              </div>
              <div className="rounded-full bg-chart-1/10 p-3">
                <CreditCard className="h-8 w-8 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Payment Methods
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {paymentMethods.length}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Available methods
                </p>
              </div>
              <div className="rounded-full bg-chart-2/10 p-3">
                <DollarSign className="h-8 w-8 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Subscriptions
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">892</p>
                <p className="mt-2 text-sm text-primary/80 font-medium">
                  +12% this month
                </p>
              </div>
              <div className="rounded-full bg-chart-3/10 p-3">
                <CreditCard className="h-8 w-8 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Premium Packages and Payment Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages">Premium Packages</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Premium Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Premium Packages
                </h2>
                <Dialog
                  open={packageDialogOpen}
                  onOpenChange={setPackageDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleOpenPackageDialog()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingPackage ? "Edit Package" : "Create Package"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingPackage
                          ? "Update premium package details"
                          : "Add a new premium package"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pkg-name">Package Name</Label>
                        <Input
                          id="pkg-name"
                          value={packageFormData.name}
                          onChange={(e) =>
                            setPackageFormData({
                              ...packageFormData,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Pro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pkg-description">Description</Label>
                        <Textarea
                          id="pkg-description"
                          value={packageFormData.description}
                          onChange={(e) =>
                            setPackageFormData({
                              ...packageFormData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Package description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pkg-price">Price (VND)</Label>
                          <Input
                            id="pkg-price"
                            type="number"
                            value={packageFormData.price}
                            onChange={(e) =>
                              setPackageFormData({
                                ...packageFormData,
                                price: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pkg-duration">Duration (days)</Label>
                          <Input
                            id="pkg-duration"
                            type="number"
                            value={packageFormData.duration_days}
                            onChange={(e) =>
                              setPackageFormData({
                                ...packageFormData,
                                duration_days: parseInt(e.target.value) || 30,
                              })
                            }
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pkg-active"
                          checked={packageFormData.active}
                          onChange={(e) =>
                            setPackageFormData({
                              ...packageFormData,
                              active: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="pkg-active">Active</Label>
                      </div>
                      <Button
                        onClick={handleSavePackage}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {editingPackage ? "Update" : "Create"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {packagesLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">
                          {pkg.name}
                        </TableCell>
                        <TableCell>{pkg.duration_days} days</TableCell>
                        <TableCell className="font-semibold">
                          ${pkg.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={pkg.active ? "default" : "secondary"}
                            className={
                              pkg.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {pkg.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <span className="text-sm text-gray-600">
                            {pkg.description || "No description"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(pkg.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenPackageDialog(pkg)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {packagesTotalPages > 1 && (
                  <div className="flex items-center justify-between border-t p-4">
                    <p className="text-sm text-muted-foreground">
                      Page {packagesPage + 1} of {packagesTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPackagesPage((p) => Math.max(0, p - 1))
                        }
                        disabled={packagesPage === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPackagesPage((p) =>
                            Math.min(packagesTotalPages - 1, p + 1),
                          )
                        }
                        disabled={packagesPage >= packagesTotalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Payment Methods
                </h2>
                <Dialog
                  open={methodDialogOpen}
                  onOpenChange={setMethodDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleOpenMethodDialog()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingMethod
                          ? "Edit Payment Method"
                          : "Add Payment Method"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingMethod
                          ? "Update payment method details"
                          : "Add a new payment method"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="method-provider">Provider</Label>
                        <Input
                          id="method-provider"
                          value={methodFormData.provider}
                          onChange={(e) =>
                            setMethodFormData({
                              ...methodFormData,
                              provider: e.target.value,
                            })
                          }
                          placeholder="e.g., Stripe, PayPal"
                        />
                      </div>
                      <div>
                        <Label htmlFor="method-description">Description</Label>
                        <Textarea
                          id="method-description"
                          value={methodFormData.description}
                          onChange={(e) =>
                            setMethodFormData({
                              ...methodFormData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Payment method description"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="method-active"
                          checked={methodFormData.active}
                          onChange={(e) =>
                            setMethodFormData({
                              ...methodFormData,
                              active: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="method-active">Active</Label>
                      </div>
                      <Button
                        onClick={handleSaveMethod}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {editingMethod ? "Update" : "Create"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {methodsLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-indigo-100 p-2">
                              <CreditCard className="h-5 w-5 text-indigo-600" />
                            </div>
                            {method.provider}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {method.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={method.active ? "default" : "secondary"}
                            className={
                              method.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {method.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenMethodDialog(method)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={
                                method.active
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                              onClick={() =>
                                handleToggleMethodActive(
                                  method.id,
                                  method.active,
                                )
                              }
                            >
                              {method.active ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {methodsTotalPages > 1 && (
                  <div className="flex items-center justify-between border-t p-4">
                    <p className="text-sm text-muted-foreground">
                      Page {methodsPage + 1} of {methodsTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setMethodsPage((p) => Math.max(0, p - 1))
                        }
                        disabled={methodsPage === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setMethodsPage((p) =>
                            Math.min(methodsTotalPages - 1, p + 1),
                          )
                        }
                        disabled={methodsPage >= methodsTotalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
