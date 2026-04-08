import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Field {
    status: FieldStatus;
    soilType: SoilType;
    ownerId: Principal;
    areaAcres: number;
    name: string;
}
export type Timestamp = bigint;
export interface CropRecord {
    growthStage: CropStage;
    plantingDate: Timestamp;
    farmerId: Principal;
    expectedHarvestDate: Timestamp;
    name: string;
    variety?: string;
    fieldId: string;
}
export type FieldId = string;
export interface Task {
    status: TaskStatus;
    title: string;
    assignedWorker: WorkerId;
    dueDate: Timestamp;
    description?: string;
    priority: TaskPriority;
    fieldId: FieldId;
}
export type FarmerId = Principal;
export interface InventoryItem {
    lowStockThreshold: number;
    name: string;
    unit: string;
    lastUpdated: Timestamp;
    quantity: number;
    category: ItemCategory;
}
export type CropId = string;
export interface Notice {
    title: string;
    postedBy: Principal;
    postedDate: Timestamp;
    message: string;
}
export type ItemId = string;
export type NoticeId = string;
export interface Expense {
    title: string;
    date: Timestamp;
    notes?: string;
    category: ExpenseCategory;
    amount: number;
}
export interface DashboardStats {
    totalExpensesThisMonth: number;
    totalFields: bigint;
    activeCrops: bigint;
    pendingTasks: bigint;
    lowStockItems: bigint;
    totalFarmers: bigint;
}
export interface FarmerProfile {
    contact?: string;
    name: string;
    village?: string;
    landAreaAcres: number;
    registrationDate: Timestamp;
}
export interface WorkerProfile {
    contact?: string;
    dailyWage: number;
    name: string;
    joiningDate: Timestamp;
    skill: WorkerSkill;
}
export type TaskId = string;
export type ExpenseId = string;
export type WorkerId = string;
export interface UserProfile {
    workerId?: string;
    name: string;
    role: string;
}
export enum CropStage {
    germination = "germination",
    sowing = "sowing",
    flowering = "flowering",
    completed = "completed",
    harvesting = "harvesting",
    vegetative = "vegetative"
}
export enum ExpenseCategory {
    other = "other",
    equipment = "equipment",
    labour = "labour",
    transport = "transport",
    seeds = "seeds",
    irrigation = "irrigation"
}
export enum FieldStatus {
    idle = "idle",
    planted = "planted",
    harvesting = "harvesting"
}
export enum ItemCategory {
    other = "other",
    equipment = "equipment",
    seeds = "seeds",
    fertilizer = "fertilizer",
    pesticide = "pesticide"
}
export enum SoilType {
    clay = "clay",
    silt = "silt",
    sandy = "sandy",
    loamy = "loamy"
}
export enum TaskPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WorkerSkill {
    harvesting = "harvesting",
    plowing = "plowing",
    spraying = "spraying",
    irrigation = "irrigation",
    general = "general"
}
export interface backendInterface {
    addExpense(expense: Expense): Promise<ExpenseId>;
    addInventoryItem(item: InventoryItem): Promise<ItemId>;
    addWorkerProfile(profile: WorkerProfile): Promise<WorkerId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFarmerProfile(profile: FarmerProfile): Promise<void>;
    createField(name: string, areaAcres: number, soilType: SoilType, ownerId: Principal): Promise<void>;
    createTask(task: Task): Promise<TaskId>;
    getAllCrops(): Promise<Array<CropRecord>>;
    getAllExpenses(): Promise<Array<Expense>>;
    getAllFarmerProfiles(): Promise<Array<FarmerProfile>>;
    getAllFields(): Promise<Array<Field>>;
    getAllInventoryItems(): Promise<Array<InventoryItem>>;
    getAllNotices(): Promise<Array<Notice>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllWorkerProfiles(): Promise<Array<WorkerProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCrop(cropId: CropId): Promise<CropRecord>;
    getDashboardStats(): Promise<DashboardStats>;
    getExpense(expenseId: ExpenseId): Promise<Expense>;
    getFarmerProfile(farmerId: FarmerId): Promise<FarmerProfile>;
    getField(fieldId: FieldId): Promise<Field>;
    getInventoryItem(itemId: ItemId): Promise<InventoryItem>;
    getNotice(noticeId: NoticeId): Promise<Notice>;
    getTask(taskId: TaskId): Promise<Task>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkerProfile(workerId: WorkerId): Promise<WorkerProfile>;
    isCallerAdmin(): Promise<boolean>;
    plantCrop(name: string, variety: string | null, fieldId: string, expectedHarvestDate: Timestamp): Promise<void>;
    postNotice(title: string, message: string): Promise<NoticeId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateInventoryItem(itemId: ItemId, item: InventoryItem): Promise<void>;
    updateTaskStatus(taskId: TaskId, status: TaskStatus): Promise<void>;
}
