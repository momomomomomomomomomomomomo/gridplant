"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { useTransition } from 'react';
import { Plus, Minus, Loader } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const AddToCart = ({ item ,cart}: { item: Omit<CartItem, "cartId">,cart?: Cart; }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const handleAddToCart = async () => {
      startTransition(async () => {
  // Execute the addItemToCart action
  const res = await addItemToCart(item);

  // Display appropriate toast message based on the result
  if (!res.success) {
    toast.error(
      res.message);
    return;
  }

  toast.success(
   `${item.name} added to the cart`,{
    action: {
        label: " Go to cart",
        onClick:() => router.push("/cart")  
    },
  });
})};
// Remove item from cart
const handleRemoveFromCart = async () => {
  startTransition(async () => {
  const res = await removeItemFromCart(item.productId);

  if (res.success) {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }

  return;
});};

  const existItem =
  cart && cart.items.find((x) => x.productId === item.productId);


  return existItem ? (
  <div>
    <Button
      type='button'
      variant='outline'
      disabled={isPending}
      onClick={handleRemoveFromCart}
    >
      {isPending ? (
        <Loader className='w-4 h-4  animate-spin' />
      ) : (
        <Minus className='w-4 h-4' />
      )}
    </Button>
    <span className='px-2'>{existItem.qty}</span>
    <Button
      type='button'
      variant='outline'
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Plus className='w-4 h-4' />
      )}
    </Button>
  </div>
) : (
  <Button
    className='w-full'
    type='button'
    disabled={isPending}
    onClick={handleAddToCart}
  >
    {isPending ? (
      <Loader className='w-4 h-4 animate-spin' />
    ) : (
      <Plus className='w-4 h-4' />
    )}
    Add to cart
  </Button>
);
};

export default AddToCart;
