import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
export default function TopNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation(); const { itemCount } = useCart();
  const links = [['/store', 'Shop'], ['/creators', 'Creators'], ['/how-it-works', 'How It Works'], ['/about', 'About'], ['/training-program', 'Future Founders']];
  return <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 bg-ry-black text-ry-yellow h-32 shadow-md"><div className="max-w-[1500px] mx-auto h-full flex items-center justify-between gap-5 px-5 lg:px-8">
    <Link to="/" onClick={() => setOpen(false)} className="shrink-0"><img src="/brand/rendered-youth-logo.webp" alt="Rendered Youth" className="w-40 sm:w-44 h-auto" /></Link>
    <div className="hidden xl:flex items-center gap-6">{links.map(([url, title]) => <Link aria-current={pathname === url ? 'page' : undefined} key={url} to={url} className="text-base font-medium hover:text-white whitespace-nowrap">{title}</Link>)}</div>
    <div className="flex items-center gap-4"><Link to="/cart" aria-label={`Shopping cart, ${itemCount} items`} className="flex gap-1 items-center"><ShoppingBag size={21} />{itemCount > 0 && <span>{itemCount}</span>}</Link><Link to="/parent" className="hidden sm:block text-sm">My studio</Link><Link to="/start" className="hidden md:block bg-ry-yellow text-black px-4 py-3 rounded-lg font-semibold text-sm">Get started</Link><button className="xl:hidden p-2" aria-expanded={open} aria-controls="ry-mobile-nav" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </div>{open && <div id="ry-mobile-nav" className="xl:hidden bg-black border-t border-neutral-800 px-6 py-6 grid gap-5 shadow-xl">{[...links, ['/start', 'Get started'], ['/parent', 'My studio'], ['/schools', 'School fundraising']].map(([url, title]) => <Link key={url} to={url} onClick={() => setOpen(false)}>{title}</Link>)}</div>}</nav>;
}
