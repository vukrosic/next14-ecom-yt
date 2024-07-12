import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ShoppingCart, Package, Home, Plus } from "lucide-react";

export const Header = () => {
    const { sessionClaims } = auth();

    return (
        <header className="bg-blue-950 text-blue-100 p-4 shadow-lg shadow-blue-500/50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-300 hover:text-blue-100 transition-colors">
                    <Package className="w-8 h-8" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">UniQ</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link href="/" className="text-blue-300 hover:text-blue-100 transition-colors flex items-center">
                        <Home className="w-5 h-5 mr-1" />
                        Home
                    </Link>
                    {sessionClaims?.metadata.role === "admin" && (
                        <>
                            <Link href="/admin/manage-products" className="text-blue-300 hover:text-blue-100 transition-colors flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-1" />
                                Manage Products
                            </Link>
                            <Link href="/admin/add-product" className="text-blue-300 hover:text-blue-100 transition-colors flex items-center">
                                <Plus className="w-5 h-5 mr-1" />
                                Add Product
                            </Link>
                        </>
                    )}
                    <UserButton />
                </nav>
            </div>
        </header>
    );
};