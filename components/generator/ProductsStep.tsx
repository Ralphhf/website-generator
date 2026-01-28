'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Product } from '@/lib/types'

interface ProductsStepProps {
  products: Product[]
  onSubmit: (products: Product[]) => void
  onBack: () => void
}

export function ProductsStep({ products, onSubmit, onBack }: ProductsStepProps) {
  const [productList, setProductList] = useState<Product[]>(
    products.length > 0 ? products : [createEmptyProduct()]
  )

  function createEmptyProduct(): Product {
    return {
      id: Date.now().toString(),
      name: '',
      price: '',
      description: '',
      image: '',
    }
  }

  const addProduct = () => {
    setProductList([...productList, createEmptyProduct()])
  }

  const removeProduct = (id: string) => {
    if (productList.length > 1) {
      setProductList(productList.filter(p => p.id !== id))
    }
  }

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    setProductList(productList.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleSubmit = () => {
    // Filter out empty products
    const validProducts = productList.filter(p => p.name.trim() && p.price.trim())
    onSubmit(validProducts)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add Your Products
        </h1>
        <p className="text-gray-600">
          Add products to display on your shop page
        </p>
      </motion.div>

      <div className="space-y-6">
        {productList.map((product, index) => (
          <Card key={product.id} variant="gradient">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary-500" />
                  Product {index + 1}
                </CardTitle>
                {productList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  placeholder="e.g., Classic T-Shirt"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                />
                <Input
                  label="Price"
                  placeholder="e.g., $29.99"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                />
              </div>
              <Textarea
                label="Description (optional)"
                placeholder="Brief description of the product"
                value={product.description || ''}
                onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                className="min-h-[80px]"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Image URL (optional)
                </label>
                <Input
                  placeholder="https://example.com/product-image.jpg"
                  value={product.image || ''}
                  onChange={(e) => updateProduct(product.id, 'image', e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste a direct link to the product image
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Product Button */}
        <Button
          variant="outline"
          onClick={addProduct}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add Another Product
        </Button>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  )
}
