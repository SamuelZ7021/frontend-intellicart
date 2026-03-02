import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/home/HomePage';
import { CartPage } from '@/pages/cart/CartPage';
import { ProductDetailPage } from '@/pages/products/ProductDetailPage';
import { CheckoutPage } from '@/pages/checkout/CheckoutPage';
import { UserListPage } from '@/pages/admin/UserListPage';
import { UserDetailPage } from '@/pages/admin/UserDetailPage';
import { UserFormPage } from '@/pages/admin/UserFormPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Layout Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="admin/users" element={<UserListPage />} />
            <Route path="admin/users/new" element={<UserFormPage />} />
            <Route path="admin/users/:id" element={<UserDetailPage />} />
            <Route path="admin/users/:id/edit" element={<UserFormPage />} />
          </Route>
        </Route>

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
