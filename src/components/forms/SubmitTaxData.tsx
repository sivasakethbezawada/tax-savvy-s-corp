
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useTaxData } from "@/context/TaxDataContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Rate limiting variables
const SUBMISSION_LIMIT = 3; // Submissions per time window
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Store submission history in localStorage
const getSubmissionHistory = (): number[] => {
  try {
    const history = localStorage.getItem("submission_timestamps");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error retrieving submission history:", error);
    return [];
  }
};

const saveSubmissionHistory = (timestamps: number[]) => {
  try {
    localStorage.setItem("submission_timestamps", JSON.stringify(timestamps));
  } catch (error) {
    console.error("Error saving submission history:", error);
  }
};

// Check if rate limit is exceeded
const isRateLimitExceeded = (): boolean => {
  const now = Date.now();
  const history = getSubmissionHistory();
  
  // Filter for submissions within the time window
  const recentSubmissions = history.filter(
    (timestamp) => now - timestamp < TIME_WINDOW
  );
  
  // Clean up old submissions
  if (recentSubmissions.length !== history.length) {
    saveSubmissionHistory(recentSubmissions);
  }
  
  return recentSubmissions.length >= SUBMISSION_LIMIT;
};

// Add a submission to history
const addSubmission = () => {
  const now = Date.now();
  const history = getSubmissionHistory();
  const updatedHistory = [...history, now];
  saveSubmissionHistory(updatedHistory);
};

interface SubmitTaxDataProps {
  accessKey?: string; // Optional prop to allow override of the default access key
}

const SubmitTaxData: React.FC<SubmitTaxDataProps> = ({ accessKey = "0f3ed5af-8cc3-45b0-b335-c498b7221f94" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [inputAccessKey, setInputAccessKey] = useState(accessKey);
  const { state } = useTaxData();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!inputAccessKey) {
      setShowApiKeyDialog(true);
      return;
    }

    // Check rate limiting
    if (isRateLimitExceeded()) {
      toast({
        title: "Rate limit exceeded",
        description: "Please try again later. You can submit up to 3 forms per hour.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for submission
      const formData = {
        access_key: inputAccessKey,
        subject: "New S Corp Tax Data Submission",
        from_name: state.personalInfo?.fullName || "S Corp Tax Calculator User",
        // Personal Information
        fullName: state.personalInfo?.fullName || "",
        email: state.personalInfo?.email || "",
        phone: state.personalInfo?.phone || "",
        address: `${state.personalInfo?.street || ""}, ${state.personalInfo?.city || ""}, ${
          state.personalInfo?.state || ""
        } ${state.personalInfo?.zipCode || ""}`,
        ssn: state.personalInfo?.ssn || "",
        filingStatus: state.personalInfo?.filingStatus || "",
        
        // Income Information - map the correct income properties
        totalIncome: state.income?.businessRevenue || "",
        businessIncome: state.income?.businessRevenue || "",
        investmentIncome: state.income?.dividendIncome || "",
        otherIncome: state.income?.otherIncome || "",
        
        // Expenses Information
        rent: state.expenses?.rent || "",
        utilities: state.expenses?.utilities || "",
        supplies: state.expenses?.supplies || "",
        insurance: state.expenses?.insurance || "",
        advertising: state.expenses?.advertising || "",
        maintenance: state.expenses?.maintenance || "",
        ownerWithdrawals: state.expenses?.ownerWithdrawals || "",
        shareholderDistributions: state.expenses?.shareholderDistributions || "",
        employeeSalaries: state.expenses?.employeeSalaries || "",
        employeeBenefits: state.expenses?.employeeBenefits || "",
        payrollTaxes: state.expenses?.payrollTaxes || "",
        businessTravel: state.expenses?.businessTravel || "",
        mileage: state.expenses?.mileage || "",
        vehicleExpenses: state.expenses?.vehicleExpenses || "",
        accounting: state.expenses?.accounting || "",
        legal: state.expenses?.legal || "",
        consulting: state.expenses?.consulting || "",
        otherExpenses: state.expenses?.otherExpenses || "",
        
        // Salary Information
        industry: state.salary?.industry || "",
        yearsExperience: state.salary?.yearsExperience || "",
        location: state.salary?.location || "",
        hoursPerWeek: state.salary?.hoursPerWeek || "",
        comparableSalary: state.salary?.comparableSalary || "",
        selectedSalary: state.salary?.selectedSalary || "",
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Record successful submission for rate limiting
        addSubmission();
        setShowSuccessDialog(true);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-8">
        <Button
          onClick={() => setShowConfirmDialog(true)}
          className="w-full py-6 text-lg font-medium"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Tax Data
            </>
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Your data will be securely submitted for processing.
        </p>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Tax Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your tax data? Please verify that all information is correct before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Successful</DialogTitle>
            <DialogDescription>
              Your tax data has been successfully submitted. You will receive a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Web3Forms API Key Required</DialogTitle>
            <DialogDescription>
              Please enter your Web3Forms API key. You can get one for free at{" "}
              <a 
                href="https://web3forms.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                web3forms.com
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={inputAccessKey}
              onChange={(e) => setInputAccessKey(e.target.value)}
              placeholder="Enter your Web3Forms access key"
              className="w-full p-2 border border-input rounded-md"
              aria-label="Web3Forms access key"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApiKeyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (inputAccessKey.trim()) {
                  setShowApiKeyDialog(false);
                  setShowConfirmDialog(true);
                } else {
                  toast({
                    title: "Error",
                    description: "Please enter a valid access key.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmitTaxData;
