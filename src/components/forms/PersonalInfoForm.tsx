
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Form schema definition with validation rules
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9()-.\s]+$/, "Please enter a valid phone number"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, "Please enter a valid SSN (XXX-XX-XXXX)"),
  filingStatus: z.enum([
    "single",
    "marriedJoint",
    "marriedSeparate",
    "headOfHousehold",
    "qualifyingWidow",
  ]),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoFormData) => void;
  onChange?: (data: Partial<PersonalInfoFormData>, isValid: boolean) => void;
  defaultValues?: Partial<PersonalInfoFormData>;
  className?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  onChange,
  defaultValues,
  className,
}) => {
  const [showSSN, setShowSSN] = React.useState(false);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      ssn: "",
      filingStatus: "single",
      ...defaultValues,
    },
  });

  // If onChange prop is provided, call it when form values change
  React.useEffect(() => {
    if (onChange) {
      const subscription = form.watch((value, { name, type }) => {
        onChange(value, form.formState.isValid);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  const toggleSSNVisibility = () => {
    setShowSSN(!showSSN);
  };

  const handleFormSubmit = (data: PersonalInfoFormData) => {
    onSubmit(data);
  };

  const formatSSN = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    
    // Format as XXX-XX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
    }
  };

  return (
    <Card className={`w-full shadow-sm ${className || ""}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name field */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SSN field */}
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Security Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showSSN ? "text" : "password"}
                          placeholder="XXX-XX-XXXX"
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatSSN(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={toggleSSNVisibility}
                          tabIndex={-1}
                        >
                          {showSSN ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              
              {/* Street Address */}
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ZIP Code */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Filing Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Filing Status</h3>
              <FormField
                control={form.control}
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="single" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Single
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="marriedJoint" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Married Filing Jointly
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="marriedSeparate" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Married Filing Separately
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="headOfHousehold" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Head of Household
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="qualifyingWidow" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Qualifying Widow(er)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
