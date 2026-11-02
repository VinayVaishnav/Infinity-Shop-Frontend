import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminHomePage } from './pages/AdminHomePage'
import { AdminInventoryPage } from './pages/AdminInventoryPage'
import { AdminOrdersPage } from './pages/AdminOrdersPage'
import { LoginPage } from './pages/LoginPage'
import { RootRedirect } from './pages/RootRedirect'
import { SignInPage } from './pages/SignInPage'
import { CartPage } from './pages/CartPage'
import { MyOrdersPage } from './pages/MyOrdersPage'
import { OrderShowPage } from './pages/OrderShowPage'
import { ProductShowPage } from './pages/ProductShowPage'
import { UserHomePage } from './pages/UserHomePage'
import { UserProfilePage } from './pages/UserProfilePage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<SignInPage />} />

          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route path="/user" element={<UserHomePage />} />
            <Route path="/user/product/:name" element={<ProductShowPage />} />
            <Route path="/user/profile" element={<UserProfilePage />} />
            <Route path="/user/orders" element={<MyOrdersPage />} />
            <Route path="/user/orders/:orderId" element={<OrderShowPage />} />
            <Route path="/user/cart" element={<CartPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App
