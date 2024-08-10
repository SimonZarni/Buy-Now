import { Routes, Route } from 'react-router-dom'
import MasterLayout from './components/MasterLayout'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import ScrollToTop from './components/ScrollTop'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favourites'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AboutUs from './pages/AboutUs'
import Brands from './pages/Brands'
import BrandDetail from './pages/BrandDetail'

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<MasterLayout />}>
          <Route index element={<Home />}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='products' element={<Product />}></Route>
          <Route path="/products/:id" element={<ProductDetail></ProductDetail>}></Route>
          <Route path='/cart' element={<Cart></Cart>}></Route>
          <Route path='/favourite' element={<Favorites></Favorites>}></Route>
          <Route path='/checkout' element={<Checkout></Checkout>}></Route>
          <Route path='/orders' element={<Orders></Orders>}></Route>
          <Route path='/aboutUs' element={<AboutUs></AboutUs>}></Route>
          <Route path='/brands' element={<Brands></Brands>}></Route>
          <Route path='/brands/:id' element={<BrandDetail></BrandDetail>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
