import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';

export function JobForm({
  formData,
  setFormData,
  handleSave,
  handleSubmit,
  errors,
  setErrors,
}) {
  const uStarPointsMapping = new Map();
    uStarPointsMapping.set("1", "RisingStar");
    uStarPointsMapping.set("2", "ShiningStar");
    uStarPointsMapping.set("3", "SuperStar");
    uStarPointsMapping.set("4", "NovaStar");

    // const [formData, setFormData] = useState({
    //     heading: '',
    //     description: '',
    //     task: '',
    //     ustarPoints: '1'
    // });
    // const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // const handleSave = () => {
    //     toast.info("Job saved")
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     // Validation
    //     const newErrors = {};
    //     for (const field in formData) {
    //         if (!formData[field]) {
    //             newErrors[field] = 'This field is required';
    //         }
    //     }
    //     if (Object.keys(newErrors).length === 0) {
    //         try {
    //             const payload = {
    //                 topic: formData.heading,
    //                 description: formData.description,
    //                 title: formData.task,
    //                 ustar_category: uStarPointsMapping.get(formData.ustarPoints),
    //                 email: "admin@email.com"
    //             };
    //             await axios.post(appConfig.api.BASE_URL + "/create_gig", payload, {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     user_id: '675712e7450aead0d3a404f7'
    //                 }
    //             });
    //             toast.success("Job submitted successfully");
    //             resetForm();
                
    //             setTimeout(() => {
    //                 window.location.href = "/";
    //             }, 3000);
    //         } catch (error) {
    //             toast.error("Failed to submit job");
    //         }
    //     } else {
    //         setErrors(newErrors);
    //     }
    // };

    const resetForm = () => {
        setFormData({ heading: "", description: "", task: "", ustarPoints: "" });
        setErrors({});
    };

    return (
        <div className="w-full h-full flex items-center justify-center py-12 px-6">
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ amount: 0.3, once: true }}
                className="w-full max-w-4xl lg:max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg"
            >
                <h1 className="text-2xl font-bold mt-4 mb-4">ADD JOB</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Row: Heading and UstarPoints */}
                <div className="flex space-x-4">
                    {/* Heading Field (3/4 width) */}
                    <div className="w-3/4 bg-white rounded-lg shadow-sm">
                    <label
                        htmlFor="heading"
                        className={`text-sm font-medium ${errors.heading ? "text-red-500" : ""}`}
                    >
                        Heading
                        {errors.heading && <span className="text-red-500 text-xs ml-1">Required</span>}
                    </label>
                    <Input
                        id="heading"
                        name="heading"
                        value={formData.heading}
                        onChange={handleChange}
                        className={`mt-1 ${errors.heading ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    </div>

                    {/* UstarPoints Field (1/4 width) */}
                    <div className="w-1/4 bg-white rounded-lg shadow-sm">
                    <label
                        htmlFor="ustarPoints"
                        className={`text-sm font-medium ${errors.ustarPoints ? "text-red-500" : ""}`}
                    >
                        Ustar Points
                        {errors.ustarPoints && <span className="text-red-500 text-xs ml-1">Required</span>}
                    </label>
                    <select
                        id="ustarPoints"
                        name="ustarPoints"
                        value={formData.ustarPoints}
                        onChange={handleChange}
                        className={`mt-1 w-full p-2 border rounded-lg ${errors.ustarPoints ? "border-red-500 focus:ring-red-500" : ""}`}
                    >
                        <option value="1">RisingStar</option>
                        <option value="2">ShiningStar</option>
                        <option value="3">SuperStar</option>
                        <option value="4">NovaStar</option>
                    </select>
                    </div>
                </div>

                {/* Second Row: Description and Task */}
                <div className="flex space-x-4">
                    {/* Description Field (half width) */}
                    <div className="w-1/2 bg-white rounded-lg shadow-sm">
                    <label
                        htmlFor="description"
                        className={`text-sm font-medium ${errors.description ? "text-red-500" : ""}`}
                    >
                        Description
                        {errors.description && <span className="text-red-500 text-xs ml-1">Required</span>}
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`mt-1 w-full h-48 p-2 border rounded-lg ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    </div>

                    {/* Task Field (half width) */}
                    <div className="w-1/2 bg-white rounded-lg shadow-sm">
                    <label
                        htmlFor="task"
                        className={`text-sm font-medium ${errors.task ? "text-red-500" : ""}`}
                    >
                        Task
                        {errors.task && <span className="text-red-500 text-xs ml-1">Required</span>}
                    </label>
                    <textarea
                        id="task"
                        name="task"
                        value={formData.task}
                        onChange={handleChange}
                        className={`mt-1 w-full h-48 p-2 border rounded-lg ${errors.task ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button
                    type="button"
                    onClick={handleSave}
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
            </motion.div>

            <ToastContainer position="bottom-right" />
    </div>
    );
}
