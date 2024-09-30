"use client";
import { useEffect } from 'react';
import Sidebar from "../components/sidebar";
import { useAuth } from "@/lib/AuthContext";
import { redirect } from "next/navigation";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, jwtToken, setData } = useAuth();
  if (!isAuthenticated) {
    redirect("/login");
  }

    useEffect(() => {
      const container = document.querySelector('.kmint.container');
      if (container) {
        container.classList.add('fade-up');
      }
    }, []);

  return (
    <div className="kmint container mt-4">
      <div className="row">
        <Sidebar />
        {children}
        <div className="col-md-3"></div>
      </div>
      {/* <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        /> */}
    </div>
  );
}
