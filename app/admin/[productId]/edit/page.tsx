"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileUpload } from "@/components/FileUpload";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Id } from '@/convex/_generated/dataModel';

interface ProductData {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export default function EditProduct() {
    const params = useParams();
    const router = useRouter();
    const productId = params.productId as Id<"products">;

    const [productData, setProductData] = useState<ProductData>({
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const updateProduct = useMutation(api.products.update);
    const product = useQuery(api.products.get, { id: productId });

    useEffect(() => {
        if (product) {
            setProductData({
                title: product.title,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl
            });
        }
    }, [product]);

    useEffect(() => {
        const { title, description, price, imageUrl } = productData;
        setIsFormValid(
            title.trim() !== '' &&
            description.trim() !== '' &&
            price > 0 &&
            imageUrl !== ''
        );
    }, [productData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const onUpload = (url: string) => {
        setProductData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            console.log({ id: productId, ...productData })
            await updateProduct({ id: productId, ...productData });
            alert('Product updated successfully!');
        } catch (err) {
            setError('Failed to update product. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!product) {
        return <div className="text-center text-blue-400">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-blue-950 text-blue-100 shadow-lg shadow-blue-500/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-blue-300">Edit Product</CardTitle>
                    <CardDescription className="text-center text-blue-400">Update the product details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-blue-300">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={productData.title}
                                onChange={handleInputChange}
                                required
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-blue-300">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={productData.description}
                                onChange={handleInputChange}
                                required
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-blue-300">Price</Label>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                value={productData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-blue-300">Product Image</Label>
                            <FileUpload onUpload={onUpload} />
                            {productData.imageUrl && (
                                <>
                                    <Alert variant="default" className="bg-blue-900 border-blue-500">
                                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        <AlertDescription className="text-blue-300">
                                            Image uploaded successfully
                                        </AlertDescription>
                                    </Alert>
                                    <img className='rounded-md' src={productData.imageUrl} alt={productData.title} />
                                </>
                            )}
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-900 border-red-700">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-800 disabled:text-blue-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                        >
                            {isSubmitting ? 'Updating Product...' : 'Update Product'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}