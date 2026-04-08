import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // MODULES AND HELPERS

  // Sort modules
  module FarmerProfile {
    public func compare(farmer1 : FarmerProfile, farmer2 : FarmerProfile) : Order.Order {
      Text.compare(farmer1.name, farmer2.name);
    };
  };

  module Field {
    public func compare(field1 : Field, field2 : Field) : Order.Order {
      Text.compare(field1.name, field2.name);
    };
  };

  module CropRecord {
    public func compare(crop1 : CropRecord, crop2 : CropRecord) : Order.Order {
      Text.compare(crop1.name, crop2.name);
    };
  };

  module WorkerProfile {
    public func compare(worker1 : WorkerProfile, worker2 : WorkerProfile) : Order.Order {
      Text.compare(worker1.name, worker2.name);
    };
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Text.compare(task1.title, task2.title);
    };
  };

  module InventoryItem {
    public func compare(item1 : InventoryItem, item2 : InventoryItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  module Expense {
    public func compare(expense1 : Expense, expense2 : Expense) : Order.Order {
      Text.compare(expense1.title, expense2.title);
    };
  };

  module Notice {
    public func compare(notice1 : Notice, notice2 : Notice) : Order.Order {
      Text.compare(notice1.title, notice2.title);
    };
  };

  // Types

  // Farmer Profiles
  type FarmerId = Principal;
  type FieldId = Text;
  type CropId = Text;
  type WorkerId = Text;
  type TaskId = Text;
  type ItemId = Text;
  type ExpenseId = Text;
  type NoticeId = Text;

  type Timestamp = Int;

  type SoilType = {
    #clay;
    #sandy;
    #loamy;
    #silt;
  };

  type FieldStatus = {
    #idle;
    #planted;
    #harvesting;
  };

  type CropStage = {
    #sowing;
    #germination;
    #vegetative;
    #flowering;
    #harvesting;
    #completed;
  };

  type WorkerSkill = {
    #plowing;
    #irrigation;
    #harvesting;
    #spraying;
    #general;
  };

  type TaskStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type TaskPriority = {
    #low;
    #medium;
    #high;
  };

  type ItemCategory = {
    #seeds;
    #fertilizer;
    #pesticide;
    #equipment;
    #other;
  };

  type ExpenseCategory = {
    #seeds;
    #labour;
    #equipment;
    #irrigation;
    #transport;
    #other;
  };

  public type FarmerProfile = {
    name : Text;
    contact : ?Text;
    landAreaAcres : Float;
    village : ?Text;
    registrationDate : Timestamp;
  };

  public type Field = {
    name : Text;
    areaAcres : Float;
    soilType : SoilType;
    ownerId : Principal;
    status : FieldStatus;
  };

  public type CropRecord = {
    name : Text;
    variety : ?Text;
    fieldId : Text;
    plantingDate : Timestamp;
    expectedHarvestDate : Timestamp;
    growthStage : CropStage;
    farmerId : Principal;
  };

  public type WorkerProfile = {
    name : Text;
    contact : ?Text;
    skill : WorkerSkill;
    dailyWage : Float;
    joiningDate : Timestamp;
  };

  public type Task = {
    title : Text;
    description : ?Text;
    assignedWorker : WorkerId;
    fieldId : FieldId;
    dueDate : Timestamp;
    status : TaskStatus;
    priority : TaskPriority;
  };

  public type InventoryItem = {
    name : Text;
    category : ItemCategory;
    quantity : Float;
    unit : Text;
    lowStockThreshold : Float;
    lastUpdated : Timestamp;
  };

  public type Expense = {
    title : Text;
    amount : Float;
    category : ExpenseCategory;
    date : Timestamp;
    notes : ?Text;
  };

  public type Notice = {
    title : Text;
    message : Text;
    postedDate : Timestamp;
    postedBy : Principal;
  };

  public type UserProfile = {
    name : Text;
    role : Text; // "Admin", "Farmer", or "Worker"
    workerId : ?Text; // Only for workers
  };

  public type DashboardStats = {
    totalFarmers : Nat;
    totalFields : Nat;
    activeCrops : Nat;
    pendingTasks : Nat;
    lowStockItems : Nat;
    totalExpensesThisMonth : Float;
  };

  // STATE
  let farmers = Map.empty<FarmerId, FarmerProfile>();
  let fields = Map.empty<FieldId, Field>();
  let crops = Map.empty<CropId, CropRecord>();
  let workers = Map.empty<WorkerId, WorkerProfile>();
  let tasks = Map.empty<TaskId, Task>();
  let inventory = Map.empty<ItemId, InventoryItem>();
  let expenses = Map.empty<ExpenseId, Expense>();
  let notices = Map.empty<NoticeId, Notice>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Methods (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Farmer Profile Methods
  public shared ({ caller }) func createFarmerProfile(profile : FarmerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create farmer profiles");
    };
    if (farmers.containsKey(caller)) {
      Runtime.trap("Farmer profile already exists");
    };
    farmers.add(
      caller,
      {
        profile with
        registrationDate = Time.now();
      },
    );
  };

  public query ({ caller }) func getFarmerProfile(farmerId : FarmerId) : async FarmerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view farmer profiles");
    };
    switch (farmers.get(farmerId)) {
      case (null) {
        Runtime.trap("Farmer does not exist");
      };
      case (?farmer) { farmer };
    };
  };

  public query ({ caller }) func getAllFarmerProfiles() : async [FarmerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view farmer profiles");
    };
    farmers.values().toArray().sort();
  };

  // Field Methods
  public shared ({ caller }) func createField(
    name : Text,
    areaAcres : Float,
    soilType : SoilType,
    ownerId : Principal,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create fields");
    };
    // Only admin or the owner can create fields for a farmer
    if (caller != ownerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only create fields for yourself");
    };
    let id = name.concat("_").concat(ownerId.toText());
    if (fields.containsKey(id)) {
      Runtime.trap("Field with this name already exists for this owner");
    };
    let field : Field = {
      name;
      areaAcres;
      soilType;
      ownerId;
      status = #idle;
    };
    fields.add(id, field);
  };

  public query ({ caller }) func getField(fieldId : FieldId) : async Field {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view fields");
    };
    switch (fields.get(fieldId)) {
      case (null) {
        Runtime.trap("Field does not exist");
      };
      case (?field) { field };
    };
  };

  public query ({ caller }) func getAllFields() : async [Field] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view fields");
    };
    fields.values().toArray().sort();
  };

  // Crop Management Methods
  public shared ({ caller }) func plantCrop(
    name : Text,
    variety : ?Text,
    fieldId : Text,
    expectedHarvestDate : Timestamp,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can plant crops");
    };
    switch (fields.get(fieldId)) {
      case (null) {
        Runtime.trap("Field does not exist");
      };
      case (?field) {
        // Only the field owner or admin can plant crops
        if (caller != field.ownerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only plant crops in your own fields");
        };
      };
    };
    let id = name.concat("_").concat(fieldId);
    if (crops.containsKey(id)) {
      Runtime.trap("Crop already planted in this field");
    };
    let crop : CropRecord = {
      name;
      variety;
      fieldId;
      plantingDate = Time.now();
      expectedHarvestDate;
      growthStage = #sowing;
      farmerId = caller;
    };
    crops.add(id, crop);
  };

  public query ({ caller }) func getAllCrops() : async [CropRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view crops");
    };
    crops.values().toArray().sort();
  };

  public query ({ caller }) func getCrop(cropId : CropId) : async CropRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view crops");
    };
    switch (crops.get(cropId)) {
      case (null) {
        Runtime.trap("Crop does not exist");
      };
      case (?crop) { crop };
    };
  };

  // Worker Methods
  public shared ({ caller }) func addWorkerProfile(profile : WorkerProfile) : async WorkerId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add workers");
    };
    let id = profile.name;
    workers.add(id, { profile with joiningDate = Time.now() });
    id;
  };

  public query ({ caller }) func getWorkerProfile(workerId : WorkerId) : async WorkerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view worker profiles");
    };
    switch (workers.get(workerId)) {
      case (null) {
        Runtime.trap("Worker does not exist");
      };
      case (?worker) { worker };
    };
  };

  public query ({ caller }) func getAllWorkerProfiles() : async [WorkerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view worker profiles");
    };
    workers.values().toArray().sort();
  };

  // Task Management
  public shared ({ caller }) func createTask(task : Task) : async TaskId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };
    let id = task.title;
    tasks.add(
      id,
      {
        task with
        status = #pending;
      },
    );
    id;
  };

  public query ({ caller }) func getTask(taskId : TaskId) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    switch (tasks.get(taskId)) {
      case (null) {
        Runtime.trap("Task does not exist");
      };
      case (?task) { task };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray().sort();
  };

  public shared ({ caller }) func updateTaskStatus(taskId : TaskId, status : TaskStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };
    switch (tasks.get(taskId)) {
      case (null) {
        Runtime.trap("Task does not exist");
      };
      case (?task) {
        tasks.add(taskId, { task with status });
      };
    };
  };

  // Inventory Methods
  public shared ({ caller }) func addInventoryItem(item : InventoryItem) : async ItemId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add inventory items");
    };
    let id = item.name;
    inventory.add(
      id,
      {
        item with
        lastUpdated = Time.now();
      },
    );
    id;
  };

  public shared ({ caller }) func updateInventoryItem(itemId : ItemId, item : InventoryItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update inventory items");
    };
    if (not inventory.containsKey(itemId)) {
      Runtime.trap("Item does not exist");
    };
    inventory.add(
      itemId,
      {
        item with
        lastUpdated = Time.now();
      },
    );
  };

  public query ({ caller }) func getInventoryItem(itemId : ItemId) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory");
    };
    switch (inventory.get(itemId)) {
      case (null) {
        Runtime.trap("Item does not exist");
      };
      case (?item) { item };
    };
  };

  public query ({ caller }) func getAllInventoryItems() : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory");
    };
    inventory.values().toArray().sort();
  };

  // Expense Methods
  public shared ({ caller }) func addExpense(expense : Expense) : async ExpenseId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add expenses");
    };
    let id = expense.title;
    expenses.add(
      id,
      {
        expense with
        date = Time.now();
      },
    );
    id;
  };

  public query ({ caller }) func getExpense(expenseId : ExpenseId) : async Expense {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view expenses");
    };
    switch (expenses.get(expenseId)) {
      case (null) {
        Runtime.trap("Expense does not exist");
      };
      case (?expense) { expense };
    };
  };

  public query ({ caller }) func getAllExpenses() : async [Expense] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view expenses");
    };
    expenses.values().toArray().sort();
  };

  // Notice Board Methods
  public shared ({ caller }) func postNotice(
    title : Text,
    message : Text,
  ) : async NoticeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post notices");
    };
    let id = title.concat(caller.toText());
    let notice : Notice = {
      title;
      message;
      postedDate = Time.now();
      postedBy = caller;
    };
    notices.add(id, notice);
    id;
  };

  public query ({ caller }) func getNotice(noticeId : NoticeId) : async Notice {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notices");
    };
    switch (notices.get(noticeId)) {
      case (null) {
        Runtime.trap("Notice does not exist");
      };
      case (?notice) { notice };
    };
  };

  public query ({ caller }) func getAllNotices() : async [Notice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notices");
    };
    notices.values().toArray().sort();
  };

  // Dashboard Stats
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };

    let totalFarmers = farmers.size();
    let totalFields = fields.size();
    
    var activeCrops = 0;
    for (crop in crops.values()) {
      if (crop.growthStage != #completed) {
        activeCrops += 1;
      };
    };

    var pendingTasks = 0;
    for (task in tasks.values()) {
      if (task.status == #pending) {
        pendingTasks += 1;
      };
    };

    var lowStockItems = 0;
    for (item in inventory.values()) {
      if (item.quantity <= item.lowStockThreshold) {
        lowStockItems += 1;
      };
    };

    let currentTime = Time.now();
    let thirtyDaysAgo = currentTime - (30 * 24 * 60 * 60 * 1_000_000_000);
    var totalExpensesThisMonth : Float = 0.0;
    for (expense in expenses.values()) {
      if (expense.date >= thirtyDaysAgo) {
        totalExpensesThisMonth += expense.amount;
      };
    };

    {
      totalFarmers;
      totalFields;
      activeCrops;
      pendingTasks;
      lowStockItems;
      totalExpensesThisMonth;
    };
  };
};
