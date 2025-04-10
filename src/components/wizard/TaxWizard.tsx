
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import IncomeForm from "@/components/forms/IncomeForm";
import { cn } from "@/lib/utils";
import { 
  useTaxData, 
  useWizardState, 
  setPersonalInfo, 
  setIncome, 
  setExpenses, 
  setSalary,
  validatePersonalInfo,
  validateIncome,
  validateExpenses,
  validateSalary,
  ExpensesFormData,
  SalaryFormData
} from "@/context/TaxDataContext";
import SubmitTaxData from "@/components/forms/SubmitTaxData";

const SCorpExpensesForm = React.lazy(() => import("@/components/forms/SCorpExpensesForm"));
const ReasonableSalaryForm = React.lazy(() => import("@/components/forms/ReasonableSalaryForm"));

interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

const TaxWizard: React.FC = () => {
  const { state, dispatch } = useTaxData();
  const { 
    currentStep, 
    completedSteps, 
    setCurrentStep, 
    setCompletedSteps, 
    addCompletedStep 
  } = useWizardState();

  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Enter your personal and contact details",
      component: (
        <PersonalInfoForm
          onSubmit={(data) => {
            setPersonalInfo(dispatch, data);
            addCompletedStep(1);
            handleNext();
          }}
          defaultValues={state.personalInfo || undefined}
          className="animate-fade-in"
        />
      ),
    },
    {
      id: 2,
      title: "Income",
      description: "Enter your income details",
      component: (
        <IncomeForm
          onSubmit={(data) => {
            setIncome(dispatch, data);
            addCompletedStep(2);
            handleNext();
          }}
          defaultValues={state.income || undefined}
          className="animate-fade-in"
        />
      ),
    },
    {
      id: 3,
      title: "Expenses",
      description: "Enter your business expenses",
      component: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <SCorpExpensesForm
            onSubmit={(data) => {
              const expenseData: ExpensesFormData = {
                rent: data.rent || "",
                utilities: data.utilities || "",
                supplies: data.supplies || "",
                insurance: data.insurance || "",
                advertising: data.advertising || "",
                maintenance: data.maintenance || "",
                ownerWithdrawals: data.ownerWithdrawals || "",
                shareholderDistributions: data.shareholderDistributions || "",
                employeeSalaries: data.employeeSalaries || "",
                employeeBenefits: data.employeeBenefits || "",
                payrollTaxes: data.payrollTaxes || "",
                businessTravel: data.businessTravel || "",
                mileage: data.mileage || "",
                vehicleExpenses: data.vehicleExpenses || "",
                accounting: data.accounting || "",
                legal: data.legal || "",
                consulting: data.consulting || "",
                otherExpenses: data.otherExpenses || ""
              };
              
              setExpenses(dispatch, expenseData);
              addCompletedStep(3);
              handleNext();
            }}
            defaultValues={state.expenses || undefined}
            className="animate-fade-in"
          />
        </React.Suspense>
      ),
    },
    {
      id: 4,
      title: "Reasonable Salary",
      description: "Calculate your reasonable salary",
      component: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ReasonableSalaryForm
            onSubmit={(data) => {
              const salaryData: SalaryFormData = {
                industry: data.industry || "",
                yearsExperience: data.experience || "",
                location: data.location || "",
                hoursPerWeek: data.hoursPerWeek?.toString() || "",
                comparableSalary: data.comparableSalary || "",
                calculatedMinSalary: "",
                calculatedMaxSalary: "",
                selectedSalary: data.selectedSalary || ""
              };
              
              setSalary(dispatch, salaryData);
              addCompletedStep(4);
              handleComplete();
            }}
            defaultValues={state.salary ? {
              industry: state.salary.industry,
              experience: state.salary.yearsExperience,
              location: state.salary.location,
              hoursPerWeek: parseInt(state.salary.hoursPerWeek) || 40,
              comparableSalary: state.salary.comparableSalary,
              selectedSalary: state.salary.selectedSalary
            } : undefined}
            className="animate-fade-in"
          />
        </React.Suspense>
      ),
    },
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    const allStepsCompleted = Array.from(
      { length: steps.length },
      (_, i) => i + 1
    );
    setCompletedSteps(allStepsCompleted);
    console.log("Tax wizard completed!");
  };

  const handleStepClick = (stepNumber: number) => {
    if (
      completedSteps.includes(stepNumber) ||
      stepNumber === currentStep ||
      stepNumber === Math.min(...completedSteps.map(step => step + 1).filter(step => step <= steps.length))
    ) {
      setCurrentStep(stepNumber);
    }
  };

  const activeStep = steps.find((step) => step.id === currentStep);
  const allStepsCompleted = steps.every(step => completedSteps.includes(step.id));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          S Corp Tax Calculator
        </h2>

        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex justify-between items-center mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center cursor-pointer transition-colors",
                {
                  "text-primary": step.id === currentStep,
                  "text-muted-foreground": step.id !== currentStep,
                  "hover:text-primary": completedSteps.includes(step.id) || step.id === currentStep,
                }
              )}
              onClick={() => handleStepClick(step.id)}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors",
                  {
                    "border-primary bg-primary text-primary-foreground":
                      step.id === currentStep,
                    "border-primary bg-primary/10":
                      completedSteps.includes(step.id) && step.id !== currentStep,
                    "border-muted-foreground":
                      !completedSteps.includes(step.id) && step.id !== currentStep,
                  }
                )}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="text-sm font-medium hidden md:block">
                {step.title}
              </span>
              <span className="text-xs text-muted-foreground hidden lg:block">
                {step.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        {activeStep && activeStep.component}
        
        {allStepsCompleted && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold text-center mb-6">Ready to Submit Your Tax Data</h3>
            <SubmitTaxData />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={currentStep === 1 ? "invisible" : ""}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={handleNext}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete}>
            Complete <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaxWizard;
