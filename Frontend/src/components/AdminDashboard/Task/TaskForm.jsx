import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  X,
  UserCircle,
  LoaderCircle,
  Plus,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  generateScript,
  generateKeywords,
  createTask,
} from "../../../services/operations/adminServices";
import { updateTask } from "../../../services/operations/taskServices";
import { toast } from "react-hot-toast";
import { CustomerSelect, TeamMemberSelect } from "./Dropdown";
import Loader from "../Loader";

const GenaiToken = import.meta.env.VITE_VULTR_LLAMA_ENDPOINT ?? "";
const GenaiScriptPrompt = import.meta.env.VITE_GENERATE_SCRIPT ?? "";
const GenaiKeywordPrompt = import.meta.env.VITE_GENERATE_KEYWORDS ?? "";

if (!GenaiToken || !GenaiScriptPrompt || !GenaiKeywordPrompt) {
  console.error("Missing required environment variables");
}

const TaskForm = ({
  task = {},
  teamMembers = [],
  onSubmit,
  onCancel,
  isUpdate = false,
  customers = [],
  handle,
}) => {
  // console.log("task:", task);
  // console.log("teamMembers:", teamMembers);
  // console.log("customers:", customers);

  // Initialize state
  const [isLoading, setIsLoading] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [error, setError] = useState("");
  const [availableCustomers, setAvailableCustomers] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const defaultValues = {
    category: task?.category || "",
    customers: task?.customers || [],
    projectTitle: task?.projectTitle || "",
    description: task?.description || "",
    script: task?.script || "",
    keywords: task?.keywords || [],
    assignedMembers: task?.assignedMembers || [],
    status: task?.status || "PENDING",
    priority: task?.priority || "Medium",
    assignedDate: task?.assignedDate || new Date().toISOString().split("T")[0],
    dueDate: task?.dueDate || "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const keywords = watch("keywords");
  const description = watch("description");
  const script = watch("script");
  const selectedCategory = watch("category");
  const selectedCustomers = watch("customers");

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(customers) || customers.length === 0) return [];

    const uniqueCategories = [
      ...new Set(
        customers
          .filter((customer) => customer && customer.category)
          .map((customer) => customer.category)
      ),
    ];

    return uniqueCategories
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        value: category.toLowerCase(),
        label:
          category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      }));
  }, [customers]);

  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      try {
        if (!Array.isArray(customers)) {
          throw new Error("Customers data is not in the correct format");
        }

        const validCustomers = customers.filter(
          (customer) =>
            customer && typeof customer === "object" && customer.category
        );

        setAvailableCustomers(validCustomers);
        setIsInitialized(true);
      } catch (error) {
        setError(error.message);
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [customers]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 mb-4">Error loading customers data</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  const handleSelectAllCustomers = () => {
    if (!selectedCategory) return;

    const newSelectAllState = !selectAllChecked;
    setSelectAllChecked(newSelectAllState);

    if (newSelectAllState) {
      const allCustomersData = availableCustomers.map((customer) => ({
        id: customer.id,
        name: customer.customername,
        email: customer.email,
        productDemand: customer.productdemand,
        category: customer.category,
      }));
      setValue("customers", allCustomersData);
    } else {
      setValue("customers", []);
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setValue("category", selectedOption.value);
    setValue("customers", []);
    setSelectAllChecked(false);

    if (selectedOption.value) {
      const filtered = customers.filter(
        (customer) =>
          customer.category.toLowerCase() === selectedOption.value.toLowerCase()
      );
      setAvailableCustomers(filtered);
    } else {
      setAvailableCustomers(customers);
    }
  };

  const handleGenerateScript = async () => {
    if (!GenaiToken || !token) {
      toast.error("Authentication tokens missing");
      return;
    }

    const description = watch("description");

    if (!description) {
      toast.error("Description is required to generate script");
      return;
    }

    setIsGeneratingScript(true);
    try {
      const generatedScript = await generateScript(
        description,
        // "based on the above context, write me a script that I will use to convince the customer to purchase my product",
        GenaiScriptPrompt,
        GenaiToken,
        token
      );

      if (generatedScript) {
        setValue("script", generatedScript.trim());
        toast.success("Script generated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to generate script");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!GenaiToken || !token) {
      toast.error("Authentication tokens missing");
      return;
    }

    const script = watch("script");

    if (!script) {
      toast.error("Script is required to generate keywords");
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const { personalKeywords, productKeywords } = await generateKeywords(
        script,
        // "Extract keywords from this script",
        GenaiKeywordPrompt,
        GenaiToken,
        token
      );

      const newKeywords = [
        ...new Set([...keywords, ...personalKeywords, ...productKeywords]),
      ];
      setValue("keywords", newKeywords);
      toast.success("Keywords generated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate keywords");
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setValue("keywords", [...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setValue(
      "keywords",
      keywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  const validateDates = {
    validate: {
      futureDate: (value) => {
        if (!value) return true;
        const today = new Date().toISOString().split("T")[0];
        return value >= today || "Date cannot be in the past";
      },
      dueAfterAssigned: (value) => {
        if (!value) return true;
        const assignedDate = getValues("assignedDate");
        return value >= assignedDate || "Due date must be after assigned date";
      },
    },
  };

  const memberOptions =
    teamMembers?.map((member) => ({
      value: member,
      label: (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{member?.name}</p>
            <p className="text-xs text-gray-500">{member?.skillset}</p>
          </div>
        </div>
      ),
    })) || [];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const onSubmitForm = async (data) => {
    try {
      const taskData = {
        ...data,
        assignedMembers: (Array.isArray(data.assignedMembers)
          ? data.assignedMembers
          : [data.assignedMembers]
        ).map((member) => ({
          id: member.id,
          name: member.name,
        })),
        status: isUpdate ? data.status : "PENDING",
        createdAt: isUpdate ? task.createdAt : new Date().toISOString(),
      };

      if (isUpdate) {
        await updateTask(task.id, taskData, token);
        toast.success("Task updated successfully!");
      } else {
        await createTask(taskData, token);
        toast.success("Task created successfully!");
      }

      onSubmit(taskData);
      onCancel();
    } catch (error) {
      toast.error(isUpdate ? "Failed to update task" : "Failed to create task");
      console.error("Form submission error:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col h-full max-h-[calc(100vh-8rem)]"
      >
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Category & Customer Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Dropdown - Remains the same */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      options={categoryOptions}
                      value={categoryOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={handleCategoryChange}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select category..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "45px",
                          backgroundColor: "#f8fafc",
                          border: "none",
                          borderRadius: "0.75rem",
                          boxShadow: "none",
                          "&:hover": {
                            border: "none",
                          },
                        }),
                      }}
                    />
                  )}
                />
              </div>

              {/* Customer Multi-Select with Select All */}
              <CustomerSelect
                customers={availableCustomers}
                selectedCategory={selectedCategory}
                selectedCustomers={selectedCustomers}
                onChange={(customers) => setValue("customers", customers)}
                error={errors.customers?.message}
                onSelectAll={handleSelectAllCustomers}
                selectAllChecked={selectAllChecked}
              />
            </div>

            {/* Project Title */}
            <div className="group">
              <div className="relative flex bg-slate-50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <div className="p-3 bg-slate-100 text-slate-500 flex items-center">
                  <FileText className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
                  placeholder="Project Title"
                  {...register("projectTitle", {
                    required: "Project title is required",
                  })}
                />
              </div>
              {errors.projectTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectTitle.message}
                </p>
              )}
            </div>

            {/* Description Section */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Description
              </label>
              <div className="relative">
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[120px] text-slate-800 placeholder-slate-400"
                  placeholder="Describe your project..."
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                <button
                  type="button"
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript || !description}
                  className="absolute bottom-3 right-3 inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700
                   disabled:text-slate-400 transition-colors "
                >
                  {isGeneratingScript ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {isGeneratingScript ? "Generating..." : "Generate Script"}
                  </span>
                </button>
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Script Section */}
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[250px] text-slate-800 placeholder-slate-400"
                placeholder="Project script will appear here..."
                {...register("script", { required: "Script is required" })}
              />
              <button
                type="button"
                onClick={handleGenerateKeywords}
                disabled={isGeneratingKeywords || !script}
                className="absolute bottom-3 right-3 inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700
                 disabled:text-slate-400 transition-colors "
              >
                {isGeneratingKeywords ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingKeywords ? "Generating..." : "Generate Keywords"}
                </span>
              </button>
              {errors.script && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.script.message}
                </p>
              )}
            </div>

            {/* Keywords Section */}
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                <div className="flex items-center">
                  <span className="font-medium text-slate-700">Keywords</span>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-white rounded-lg text-sm text-slate-700 group"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 p-0.5 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                    placeholder="Add a keyword..."
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="flex items-center justify-center p-2 bg-purple-400 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Priority & Dates Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Priority Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Priority
                </label>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: "Priority is required" }}
                  render={({ field }) => (
                    <Select
                      options={priorityOptions}
                      value={priorityOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option.value)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select priority..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "45px",
                          backgroundColor: "#f8fafc",
                          border: "none",
                          borderRadius: "0.75rem",
                          boxShadow: "none",
                          "&:hover": {
                            border: "none",
                          },
                        }),
                      }}
                    />
                  )}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>

              {/* Assigned Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Assigned Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                    {...register("assignedDate", {
                      required: "Assigned date is required",
                    })}
                  />
                </div>
                {errors.assignedDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.assignedDate.message}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                    {...register("dueDate", {
                      required: "Due date is required",
                      validate: (value) =>
                        value >= getValues("assignedDate") ||
                        "Due date must be after assigned date",
                    })}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Team Members Section */}
            <Controller
              name="assignedMembers"
              control={control}
              rules={{ required: "Please assign a team member" }}
              render={({ field: { onChange, value } }) => (
                <TeamMemberSelect
                  teamMembers={teamMembers}
                  value={value}
                  onChange={onChange}
                  error={errors.assignedMembers?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-12">
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 lg:py-1 text-white font-medium text-sm md:text-base lg:text-lg bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              {isUpdate ? "Update Task" : "Create Task"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
