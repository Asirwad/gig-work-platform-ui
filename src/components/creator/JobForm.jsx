import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function JobForm({
  formData,
  setFormData,
  handleSave,
  handleSubmit,
  errors,
  setErrors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {["heading", "description", "task", "ustarPoints"].map((field) => (
        <div key={field} className="bg-white rounded-lg p-4 shadow-sm">
          <Label
            htmlFor={field}
            className={`text-sm font-medium ${
              errors[field] ? "text-red-500" : ""
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {errors[field] && (
              <span className="text-red-500 text-xs ml-1">Required</span>
            )}
          </Label>
          <Input
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className={`mt-1 ${
              errors[field] ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
        </div>
      ))}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={handleSave}
          variant="outline"
          className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50"
        >
          Save
        </Button>
        <Button
          type="submit"
          className="bg-teal-600 text-white hover:bg-teal-700"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
