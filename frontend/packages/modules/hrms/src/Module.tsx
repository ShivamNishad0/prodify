import React from "react";
import { Route, Routes } from "react-router-dom";

// Standard UPYOG component registry init
export const initHRMSComponents = () => {
    // Component registry mock
    // window.Digit.ComponentRegistryService.setComponent("HRMSModule", HRMSModule);
};

const HRMSModule = () => {
    return (
        <div className="hrms-module-wrapper">
            <Routes>
                {/* Scaffold standard routes for the module */}
                <Route path="/" element={<div>HRMS Dashboard</div>} />
                <Route path="/employees" element={<div>Employee List</div>} />
                <Route path="/attendance" element={<div>Attendance</div>} />
            </Routes>
        </div>
    );
};

export default HRMSModule;
