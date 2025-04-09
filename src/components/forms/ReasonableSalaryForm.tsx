
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NumericFormat } from "react-number-format";
import { Info } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

// Schema definition with validation
const reasonableSalarySchema = z.object({
  industry: z.string().min(1, "Industry selection is required"),
  experience: z.string().min(1, "Years of experience is required"),
  location: z.string().min(1, "Geographic location is required"),
  hoursPerWeek: z.coerce.number().min(1, "Hours per week is required").max(80, "Hours must be 80 or less"),
  comparableSalary: z.string().min(1, "Comparable salary information is required"),
  selectedSalary: z.string().min(1, "Selected salary is required"),
  education: z.string().optional(),
  certifications: z.string().optional(),
  responsibilities: z.string().optional(),
});

export type ReasonableSalaryFormData = z.infer<typeof reasonableSalarySchema>;

// Industry options for select dropdown
const industryOptions = [
  { value: "technology", label: "Technology & Software" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "financial", label: "Financial Services" },
  { value: "construction", label: "Construction & Contracting" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting Services" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "legal", label: "Legal Services" },
  { value: "education", label: "Education & Training" },
  { value: "real-estate", label: "Real Estate" },
  { value: "food-service", label: "Food Service & Hospitality" },
  { value: "other", label: "Other" },
];

// Experience level options
const experienceOptions = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid-Level (3-5 years)" },
  { value: "senior", label: "Senior Level (6-10 years)" },
  { value: "expert", label: "Expert Level (10+ years)" },
];

// Geographic region options
const locationOptions = [
  { value: "northeast", label: "Northeast US" },
  { value: "southeast", label: "Southeast US" },
  { value: "midwest", label: "Midwest US" },
  { value: "southwest", label: "Southwest US" },
  { value: "west", label: "West Coast" },
  { value: "rural", label: "Rural Areas" },
  { value: "suburban", label: "Suburban Areas" },
  { value: "urban", label: "Major Urban Centers" },
  { value: "international", label: "International" },
];

export interface ReasonableSalaryFormProps {
  onSubmit: (data: ReasonableSalaryFormData) => void;
  onChange?: (data: Partial<ReasonableSalaryFormData>, isValid: boolean) => void;
  defaultValues?: Partial<ReasonableSalaryFormData>;
  className?: string;
}

// Helper function to calculate reasonable salary range
const calculateSalaryRange = (industry: string, experience: string, location: string, hoursPerWeek: number): [number, number] => {
  // Base salary ranges by industry (annually, in USD)
  const industrySalaries: Record<string, [number, number]> = {
    "technology": [60000, 150000],
    "healthcare": [50000, 180000],
    "financial": [65000, 160000],
    "construction": [45000, 120000],
    "retail": [40000, 100000],
    "manufacturing": [45000, 110000],
    "consulting": [70000, 170000],
    "marketing": [50000, 130000],
    "legal": [70000, 190000],
    "education": [40000, 90000],
    "real-estate": [50000, 140000],
    "food-service": [35000, 80000],
    "other": [45000, 120000],
  };

  // Experience multipliers
  const experienceMultipliers: Record<string, number> = {
    "entry": 0.8,
    "mid": 1.0,
    "senior": 1.3,
    "expert": 1.6,
  };

  // Location adjustments
  const locationMultipliers: Record<string, number> = {
    "northeast": 1.15,
    "southeast": 0.95,
    "midwest": 0.9,
    "southwest": 0.95,
    "west": 1.25,
    "rural": 0.8,
    "suburban": 1.0,
    "urban": 1.2,
    "international": 1.0,
  };

  // Hours adjustment (pro-rated for part-time)
  const hoursMultiplier = hoursPerWeek / 40;

  // Get base range or default to a middle range if not found
  const baseSalaryRange = industrySalaries[industry] || [50000, 120000];
  
  // Apply multipliers
  const expMulti = experienceMultipliers[experience] || 1.0;
  const locMulti = locationMultipliers[location] || 1.0;
  
  // Calculate final range
  const lowerBound = Math.round(baseSalaryRange[0] * expMulti * locMulti * hoursMultiplier / 1000) * 1000;
  const upperBound = Math.round(baseSalaryRange[1] * expMulti * locMulti * hoursMultiplier / 1000) * 1000;
  
  return [lowerBound, upperBound];
};

const ReasonableSalaryForm: React.FC<ReasonableSalaryFormProps> = ({
  onSubmit,
  onChange,
  defaultValues,
  className,
}) => {
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 0]);
  const [sliderValue, setSliderValue] = useState<number>(0);

  const form = useForm<ReasonableSalaryFormData>({
    resolver: zodResolver(reasonableSalarySchema),
    defaultValues: {
      industry: "",
      experience: "",
      location: "",
      hoursPerWeek: 40,
      comparableSalary: "",
      selectedSalary: "",
      education: "",
      certifications: "",
      responsibilities: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  // If onChange prop is provided, call it when form values change
  useEffect(() => {
    if (onChange) {
      const subscription = form.watch((value) => {
        onChange(value, form.formState.isValid);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  // Recalculate salary range when relevant fields change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (["industry", "experience", "location", "hoursPerWeek"].includes(name || "")) {
        const industry = value.industry || "";
        const experience = value.experience || "";
        const location = value.location || "";
        const hoursPerWeek = Number(value.hoursPerWeek) || 40;
        
        const [min, max] = calculateSalaryRange(industry, experience, location, hoursPerWeek);
        setSalaryRange([min, max]);
        
        // Set slider to middle of range by default
        const middle = Math.round((min + max) / 2);
        setSliderValue(middle);
        
        // Update the selected salary field
        form.setValue("selectedSalary", middle.toString(), { shouldValidate: true });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const selectedValue = value[0];
    setSliderValue(selectedValue);
    form.setValue("selectedSalary", selectedValue.toString(), { shouldValidate: true });
  };

  const handleFormSubmit = (data: ReasonableSalaryFormData) => {
    onSubmit(data);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={`w-full shadow-sm ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Reasonable S Corp Salary Calculator</CardTitle>
        <CardDescription>
          Determine a reasonable salary for your S Corporation based on industry standards and your specific situation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industry Field */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Industry 
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Your industry directly impacts what the IRS considers a reasonable salary for an S Corp owner-employee</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience Level Field */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Experience Level
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Your experience level affects what the IRS would consider reasonable compensation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Geographic Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Geographic Location
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Location significantly affects what's considered reasonable pay due to regional salary differences</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hours Per Week Field */}
              <FormField
                control={form.control}
                name="hoursPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Hours Per Week
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Part-time vs. full-time work affects what the IRS would consider reasonable compensation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="80"
                        placeholder="40"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional qualification fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Qualifications (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education */}
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input placeholder="Degree, Major, Institution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Certifications */}
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Certifications</FormLabel>
                      <FormControl>
                        <Input placeholder="Relevant certifications" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Responsibilities */}
              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Key Responsibilities
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>The more responsibilities you have, the more the IRS expects you to be compensated reasonably</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Key responsibilities in your role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Comparable Salary Research */}
            <FormField
              control={form.control}
              name="comparableSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Comparable Salary Research
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Document comparable salaries from sources like BLS.gov, Glassdoor, or industry surveys to strengthen your reasonable salary position</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Similar job titles pay $X according to [source]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Salary Range Calculator */}
            {salaryRange[1] > 0 && (
              <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-md font-medium">Suggested Reasonable Salary Range</h3>
                    <p className="text-sm text-muted-foreground">Based on your inputs</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-semibold">
                      {formatCurrency(salaryRange[0])} - {formatCurrency(salaryRange[1])}
                    </span>
                  </div>
                </div>

                {/* Slider for selecting salary within range */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="selectedSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span>Select Your Salary</span>
                          <span className="font-medium">{formatCurrency(sliderValue)}</span>
                        </FormLabel>
                        <FormControl>
                          <div className="pt-2">
                            <Slider 
                              defaultValue={[sliderValue]} 
                              max={salaryRange[1]} 
                              min={salaryRange[0]} 
                              step={1000}
                              onValueChange={handleSliderChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-primary/5 p-3 rounded-md border text-sm">
                  <p className="font-medium text-primary mb-1">Why Reasonable Salary Matters</p>
                  <p className="text-muted-foreground">
                    The IRS requires S Corporation owner-employees to pay themselves a reasonable salary before taking distributions. 
                    Setting your salary too low can trigger an audit and potential penalties. Document your salary rationale
                    based on industry standards, experience, and comparable positions.
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full md:w-auto">
              Save Reasonable Salary
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReasonableSalaryForm;
