import "./globals.css";
import { HrmsProviders } from "./providers";

export const metadata = {
  title: "SPSPL",
  description: "Shri Publication and Stationary Pvt. Ltd. HR Management System",
};

export default function HrmsLayout({ children }) {
  return (
    <div className="scrollbar-hidden hrms-root">
      <HrmsProviders>
        {children}
      </HrmsProviders>
    </div>
  );
}
