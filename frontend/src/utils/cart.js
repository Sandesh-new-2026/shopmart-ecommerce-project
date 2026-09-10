export const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cartItems") || "[]");
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: items }));
  return items;
};

export const addCartItem = (product) => {
  const id = product._id || product.id;
  const current = readCart();
  const next = current.some((item) => item.id === id)
    ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...current, { ...product, id, quantity: 1 }];
  return saveCart(next);
};
