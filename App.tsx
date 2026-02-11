
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Catalogue } from './pages/Catalogue';
import { Dashboard } from './pages/Admin/Dashboard';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminDepartments } from './pages/Admin/AdminDepartments';
import { AdminBanners } from './pages/Admin/AdminBanners';
import { AdminStoreSettings } from './pages/Admin/AdminStoreSettings';
import { AdminLayout } from './components/Admin/AdminLayout';
import { db } from './services/dbService';
import { Product, User, UserRole } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [initialCategory, setInitialCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(db.getById<User>('users', 'user-admin') || null);

  const handleNavigate = (page: string) => {
    if (page.startsWith('catalogo')) {
      const parts = page.split('/');
      const params = new URLSearchParams(page.split('?')[1]);
      
      setInitialCategory(parts[1] || '');
      setSearchQuery(params.get('q') || '');
      setCurrentPage('catalogo');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('produto');
    window.scrollTo(0, 0);
  };

  const isAdminPage = currentPage.startsWith('admin');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onProductClick={handleProductClick} onAddToCart={() => {}} onNavigate={handleNavigate} />;
      case 'produto':
        return selectedProduct ? <ProductDetail product={selectedProduct} onNavigate={handleNavigate} /> : null;
      case 'catalogo':
        return <Catalogue 
          onProductClick={handleProductClick} 
          onNavigate={handleNavigate} 
          initialCategory={initialCategory}
          initialQuery={searchQuery}
        />;
      // Admin Sub-pages
      case 'admin':
      case 'admin-dashboard':
        return <Dashboard />;
      case 'admin-products':
        return <AdminProducts />;
      case 'admin-departments':
        return <AdminDepartments />;
      case 'admin-banners':
        return <AdminBanners />;
      case 'admin-settings':
        return <AdminStoreSettings />;
      case 'admin-orders':
        return <div className="p-12 text-center text-gray-500 italic">Módulo de Pedidos em breve...</div>;
      default:
        return <Home onProductClick={handleProductClick} onAddToCart={() => {}} onNavigate={handleNavigate} />;
    }
  };

  if (isAdminPage && currentUser?.role === UserRole.ADMIN) {
    return (
      <AdminLayout 
        activeTab={currentPage === 'admin' ? 'admin-dashboard' : currentPage} 
        onNavigate={handleNavigate}
        onExit={() => handleNavigate('home')}
      >
        {renderPage()}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onNavigate={handleNavigate}
      />
      
      <main className="flex-1 bg-gray-50">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
