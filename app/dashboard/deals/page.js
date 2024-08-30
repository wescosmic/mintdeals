'use client'
import React, { useState, useEffect } from 'react';
import DealTable from '../../components/dealTable';
import DealModal from '../../components/dealModal';
import {useAuth} from "@/lib/AuthContext";
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'

function DealManagement() {
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  if(!isAuthenticated){
    router.push('/', { scroll: false })
    // redirect('/login')
    return (<></>)
  }


  const handleNewDeal = () => {
    setSelectedDeal(null);
    setShowDealModal(true);
  };

  const handleEditDeal = (offer) => {
    setSelectedDeal(offer);
    setShowDealModal(true);
  };

  const handleDeleteDeal = (offerId) => {
    // Implement delete logic here
    console.log('Deleting offer:', offerId);
  };

  return (
        <main className="kmint col-md-6 ms-sm-auto col-lg-6 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Manage Deals</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              {/* <button type="button" className="btn btn-md btn-outline-secondary me-2">
                Export CSV
              </button> */}
              <button type="button" className="btn btn-md btn-kmint-blue" onClick={handleNewDeal}>
                New Deal
              </button>
            </div>
          </div>
          <DealTable onEdit={handleEditDeal} onDelete={handleDeleteDeal} />
          <DealModal show={showDealModal} onHide={() => setShowDealModal(false)} offer={selectedDeal} />
        </main>
  );
}

export default DealManagement;
