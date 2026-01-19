import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar /> 
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
