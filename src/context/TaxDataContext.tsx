import React, { createContext, useContext, useReducer, useEffect } from "react";
import { PersonalInfoFormData } from "@/components/forms/PersonalInfoForm";
import { IncomeFormData } from "@/components/forms/IncomeForm";

// Define interfaces for our form data types
// We're importing existing types for Personal and Income form data
// and defining new types for the other forms

export interface ExpensesFormData {
  // Business Operating Expenses
  rent: string;
  utilities: string;
  supplies: string;
  insurance: string;
  advertising: string;
  maintenance: string;
  // Owner Withdrawals
  ownerWithdrawals: string;
  // Distributions
  shareholderDistributions: string;
  // Employee Expenses
  employeeSalaries: string;
  employeeBenefits: string;
  payrollTaxes: string;
  // Travel and Vehicle
  businessTravel: string;
  mileage: string;
  vehicleExpenses: string;
  // Professional Services
  accounting: string;
  legal: string;
  consulting: string;
  // Other Expenses
  otherExpenses: string;
}

export interface SalaryFormData {
  industry: string;
  yearsExperience: string;
  location: string;
  hoursPerWeek: string;
  comparableSalary: string;
  calculatedMinSalary: string;
  calculatedMaxSalary: string;
  selectedSalary: string;
}

// State type for our entire tax data
export interface TaxDataState {
  personalInfo: PersonalInfoFormData | null;
  income: IncomeFormData | null;
  expenses: ExpensesFormData | null;
  salary: SalaryFormData | null;
  currentStep: number;
  completedSteps: number[];
}

// Define action types
type ActionType =
  | { type: "SET_PERSONAL_INFO"; payload: PersonalInfoFormData }
  | { type: "SET_INCOME"; payload: IncomeFormData }
  | { type: "SET_EXPENSES"; payload: ExpensesFormData }
  | { type: "SET_SALARY"; payload: SalaryFormData }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "SET_COMPLETED_STEPS"; payload: number[] }
  | { type: "ADD_COMPLETED_STEP"; payload: number }
  | { type: "RESET_DATA" };

// Initial state
const initialState: TaxDataState = {
  personalInfo: null,
  income: null,
  expenses: null,
  salary: null,
  currentStep: 1,
  completedSteps: [],
};

// Reducer function
const taxDataReducer = (state: TaxDataState, action: ActionType): TaxDataState => {
  switch (action.type) {
    case "SET_PERSONAL_INFO":
      return { ...state, personalInfo: action.payload };
    case "SET_INCOME":
      return { ...state, income: action.payload };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    case "SET_SALARY":
      return { ...state, salary: action.payload };
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_COMPLETED_STEPS":
      return { ...state, completedSteps: action.payload };
    case "ADD_COMPLETED_STEP":
      if (state.completedSteps.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        completedSteps: [...state.completedSteps, action.payload],
      };
    case "RESET_DATA":
      return initialState;
    default:
      return state;
  }
};

// Create context with initial undefined value
export const TaxDataContext = createContext<{
  state: TaxDataState;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const TaxDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load data from localStorage
  const loadFromLocalStorage = (): TaxDataState => {
    try {
      const savedData = localStorage.getItem("taxData");
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(taxDataReducer, loadFromLocalStorage());

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("taxData", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [state]);

  return (
    <TaxDataContext.Provider value={{ state, dispatch }}>
      {children}
    </TaxDataContext.Provider>
  );
};

// Custom hook for using the tax data context
export const useTaxData = () => {
  const context = useContext(TaxDataContext);
  if (context === undefined) {
    throw new Error("useTaxData must be used within a TaxDataProvider");
  }
  return context;
};

// Selector hooks for easily accessing specific pieces of data
export const usePersonalInfo = () => {
  const { state } = useTaxData();
  return state.personalInfo;
};

export const useIncome = () => {
  const { state } = useTaxData();
  return state.income;
};

export const useExpenses = () => {
  const { state } = useTaxData();
  return state.expenses;
};

export const useSalary = () => {
  const { state } = useTaxData();
  return state.salary;
};

export const useWizardState = () => {
  const { state, dispatch } = useTaxData();
  
  return {
    currentStep: state.currentStep,
    completedSteps: state.completedSteps,
    setCurrentStep: (step: number) => 
      dispatch({ type: "SET_CURRENT_STEP", payload: step }),
    setCompletedSteps: (steps: number[]) => 
      dispatch({ type: "SET_COMPLETED_STEPS", payload: steps }),
    addCompletedStep: (step: number) => 
      dispatch({ type: "ADD_COMPLETED_STEP", payload: step }),
  };
};

// Actions for updating data
export const setPersonalInfo = (
  dispatch: React.Dispatch<ActionType>,
  data: PersonalInfoFormData
) => {
  dispatch({ type: "SET_PERSONAL_INFO", payload: data });
};

export const setIncome = (
  dispatch: React.Dispatch<ActionType>,
  data: IncomeFormData
) => {
  dispatch({ type: "SET_INCOME", payload: data });
};

export const setExpenses = (
  dispatch: React.Dispatch<ActionType>,
  data: ExpensesFormData
) => {
  dispatch({ type: "SET_EXPENSES", payload: data });
};

export const setSalary = (
  dispatch: React.Dispatch<ActionType>,
  data: SalaryFormData
) => {
  dispatch({ type: "SET_SALARY", payload: data });
};

export const resetAllData = (dispatch: React.Dispatch<ActionType>) => {
  dispatch({ type: "RESET_DATA" });
  // Also remove from localStorage
  localStorage.removeItem("taxData");
};

// Validation functions
export const validatePersonalInfo = (data: PersonalInfoFormData | null): boolean => {
  if (!data) return false;
  return (
    !!data.fullName &&
    !!data.email &&
    !!data.phone &&
    !!data.street &&
    !!data.city &&
    !!data.state &&
    !!data.zipCode &&
    !!data.ssn &&
    !!data.filingStatus
  );
};

export const validateIncome = (data: IncomeFormData | null): boolean => {
  if (!data) return false;
  // Minimum validation - at least one field should have data
  return Object.values(data).some(value => value && value !== "0" && value !== "0.00");
};

export const validateExpenses = (data: ExpensesFormData | null): boolean => {
  if (!data) return false;
  // Minimum validation - at least one field should have data
  return Object.values(data).some(value => value && value !== "0" && value !== "0.00");
};

export const validateSalary = (data: SalaryFormData | null): boolean => {
  if (!data) return false;
  return (
    !!data.industry &&
    !!data.yearsExperience &&
    !!data.location &&
    !!data.hoursPerWeek &&
    !!data.selectedSalary
  );
};

export const isFormStepComplete = (step: number, state: TaxDataState): boolean => {
  switch (step) {
    case 1:
      return validatePersonalInfo(state.personalInfo);
    case 2:
      return validateIncome(state.income);
    case 3:
      return validateExpenses(state.expenses);
    case 4:
      return validateSalary(state.salary);
    default:
      return false;
  }
};
