
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Circle } from "lucide-react";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import IncomeForm from "@/components/forms/IncomeForm";
import ReasonableSalaryForm from "@/components/forms/ReasonableSalaryForm";
import { cn } from "@/lib/utils";

// Import the SCorpExpensesForm component
const SCorpExpensesForm = React.lazy(() => import("@/components/forms/SCorpExpensesForm"));

// Define step interface
interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

const TaxWizard: React.FC = () => {
  // Define steps
  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Enter your personal and contact details",
      component: (
        <PersonalInfoForm
          onSubmit={() => handleNext()}
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
          onSubmit={() => handleNext()}
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
            onSubmit={() => handleNext()}
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
        <ReasonableSalaryForm
          onSubmit={() => handleComplete()}
          className="animate-fade-in"
        />
      ),
    },
  ];

  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  // Navigation handlers
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    // Mark all steps as completed
    const allStepsCompleted = Array.from(
      { length: steps.length },
      (_, i) => i + 1
    );
    setCompletedSteps(allStepsCompleted);
    console.log("Tax wizard completed!");
    // Here you could implement additional completion logic
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow clicking on completed steps or the next available step
    if (
      completedSteps.includes(stepNumber) ||
      stepNumber === currentStep ||
      stepNumber === Math.min(...completedSteps.map(step => step + 1).filter(step => step <= steps.length))
    ) {
      setCurrentStep(stepNumber);
    }
  };

  // Get current step
  const activeStep = steps.find((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          S Corp Tax Calculator
        </h2>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step indicators */}
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

      {/* Current step content */}
      <div className="mb-8">
        {activeStep && activeStep.component}
      </div>

      {/* Navigation buttons */}
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
