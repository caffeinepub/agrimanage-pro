import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Expense,
  FarmerProfile,
  InventoryItem,
  SoilType,
  Task,
  TaskStatus,
  WorkerProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => actor!.getDashboardStats(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllFarmers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["farmers"],
    queryFn: () => actor!.getAllFarmerProfiles(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllFields() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["fields"],
    queryFn: () => actor!.getAllFields(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllCrops() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["crops"],
    queryFn: () => actor!.getAllCrops(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllWorkers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["workers"],
    queryFn: () => actor!.getAllWorkerProfiles(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => actor!.getAllTasks(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllInventory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => actor!.getAllInventoryItems(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllExpenses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => actor!.getAllExpenses(),
    enabled: !!actor && !isFetching,
  });
}

export function useAllNotices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notices"],
    queryFn: () => actor!.getAllNotices(),
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFarmer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: FarmerProfile) => actor!.createFarmerProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farmers"] }),
  });
}

export function useCreateField() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      name: string;
      areaAcres: number;
      soilType: SoilType;
      ownerId: Principal;
    }) =>
      actor!.createField(
        args.name,
        args.areaAcres,
        args.soilType,
        args.ownerId,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fields"] }),
  });
}

export function usePlantCrop() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      name: string;
      variety: string | null;
      fieldId: string;
      expectedHarvestDate: bigint;
    }) =>
      actor!.plantCrop(
        args.name,
        args.variety,
        args.fieldId,
        args.expectedHarvestDate,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crops"] }),
  });
}

export function useAddWorker() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: WorkerProfile) => actor!.addWorkerProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => actor!.createTask(task),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { taskId: string; status: TaskStatus }) =>
      actor!.updateTaskStatus(args.taskId, args.status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useAddInventoryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: InventoryItem) => actor!.addInventoryItem(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useUpdateInventoryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { itemId: string; item: InventoryItem }) =>
      actor!.updateInventoryItem(args.itemId, args.item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useAddExpense() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expense: Expense) => actor!.addExpense(expense),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function usePostNotice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { title: string; message: string }) =>
      actor!.postNotice(args.title, args.message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}
