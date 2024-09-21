"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import  "bootstrap/dist/css/bootstrap.min.css"
import Header from "./components/header";
import Footer from "./components/footer";
import Metadata from "../app/metadata";
import {AuthProvider} from "../lib/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Metadata 
        seoTitle="MintDeals" 
        seoDescription="MintDeals is a platform that empowers small businesses to offer exclusive tokenized deals as NFTs, while providing access to shared credit facilities backed by stablecoins and Bitcoin. Built on Tron blockchain, MintDeals allows businesses to enhance customer loyalty through unique deal clubs and secure onchain credit via JustLendDAO. Join the future of small business financing and loyalty programs with MintDeals—seamlessly integrating crypto and DeFi for real-world business growth."></Metadata>
      <head>
        {/* You can add meta tags, title, etc., here */}
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <AuthProvider>
      <body className={`bg-mintdeals ${inter.className}`}>
        <Header />
        {children}
        <Footer/>
        <ToastContainer
              position="top-center"
              autoClose={8000}
              hideProgressBar={false}
              closeOnClick
              draggable
              pauseOnHover
        />
        </body>
      </AuthProvider>  
    </html>
  );
}
