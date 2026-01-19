import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useShop } from "../context/ShopContext";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import "./CartDrawer.css";

const CartDrawer = () => {
  const { drawerType, closeDrawer } = useShop();
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    if (drawerType) {
      setActiveType(drawerType);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      const timer = setTimeout(() => {
        setActiveType(null);
        document.body.style.overflow = "auto";
      }, 350); // Matches transition time
      return () => clearTimeout(timer);
    }
  }, [drawerType]);

  return (
    <>
      <div
        className={`drawer-overlay ${drawerType ? "active" : ""}`}
        onClick={closeDrawer}
      />

      <aside className={`drawer ${drawerType ? "active" : ""}`}>
        <button className="drawer-close" onClick={closeDrawer}>
          <X size={22} />
        </button>

        <div className="drawer-content">
          {activeType === "cart" && <Cart />}
          {activeType === "wishlist" && <Wishlist />}
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
