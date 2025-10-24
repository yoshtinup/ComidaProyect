import React from 'react';
import Header from '../componets/Header';
import TopProductsDemo from '../componets/Dashboard/TopProductsDemo';

const TopProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TopProductsDemo />
      </main>
    </div>
  );
};

export default TopProductsPage;
