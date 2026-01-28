'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  UtensilsCrossed,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Leaf,
  FileText
} from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { MenuConfig, MenuCategory, MenuItem, DietaryOption } from '@/lib/types'

interface MenuStepProps {
  menu?: MenuConfig
  onSubmit: (menu: MenuConfig) => void
  onBack: () => void
}

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'nut-free', label: 'Nut-Free', icon: '🥜' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
] as const

const DEFAULT_CATEGORIES = [
  'Appetizers',
  'Main Courses',
  'Desserts',
  'Beverages',
  'Sides',
  'Specials',
]

export function MenuStep({ menu, onSubmit, onBack }: MenuStepProps) {
  const [menuConfig, setMenuConfig] = useState<MenuConfig>(
    menu || {
      categories: [createEmptyCategory('Appetizers')],
      showPrices: true,
      currency: '$',
      note: '',
    }
  )
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(menuConfig.categories.map(c => c.id))
  )
  const [menuMode, setMenuMode] = useState<'manual' | 'pdf'>(
    menu?.menuPdfUrl ? 'pdf' : 'manual'
  )

  function createEmptyCategory(name: string = ''): MenuCategory {
    return {
      id: Date.now().toString(),
      name,
      description: '',
      items: [createEmptyItem()],
    }
  }

  function createEmptyItem(): MenuItem {
    return {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: '',
      description: '',
      price: '',
      dietary: [],
      isPopular: false,
    }
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const addCategory = (name?: string) => {
    const newCategory = createEmptyCategory(name || '')
    setMenuConfig({
      ...menuConfig,
      categories: [...menuConfig.categories, newCategory],
    })
    setExpandedCategories(new Set([...Array.from(expandedCategories), newCategory.id]))
  }

  const removeCategory = (categoryId: string) => {
    if (menuConfig.categories.length > 1) {
      setMenuConfig({
        ...menuConfig,
        categories: menuConfig.categories.filter(c => c.id !== categoryId),
      })
    }
  }

  const updateCategory = (categoryId: string, field: keyof MenuCategory, value: string) => {
    setMenuConfig({
      ...menuConfig,
      categories: menuConfig.categories.map(c =>
        c.id === categoryId ? { ...c, [field]: value } : c
      ),
    })
  }

  const addItem = (categoryId: string) => {
    setMenuConfig({
      ...menuConfig,
      categories: menuConfig.categories.map(c =>
        c.id === categoryId
          ? { ...c, items: [...c.items, createEmptyItem()] }
          : c
      ),
    })
  }

  const removeItem = (categoryId: string, itemId: string) => {
    setMenuConfig({
      ...menuConfig,
      categories: menuConfig.categories.map(c =>
        c.id === categoryId
          ? { ...c, items: c.items.filter(i => i.id !== itemId) }
          : c
      ),
    })
  }

  const updateItem = (
    categoryId: string,
    itemId: string,
    field: keyof MenuItem,
    value: MenuItem[keyof MenuItem]
  ) => {
    setMenuConfig({
      ...menuConfig,
      categories: menuConfig.categories.map(c =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map(i =>
                i.id === itemId ? { ...i, [field]: value } : i
              ),
            }
          : c
      ),
    })
  }

  const toggleDietary = (
    categoryId: string,
    itemId: string,
    dietary: DietaryOption
  ) => {
    const category = menuConfig.categories.find(c => c.id === categoryId)
    const item = category?.items.find(i => i.id === itemId)
    if (!item) return

    const currentDietary = item.dietary || []
    const newDietary = currentDietary.includes(dietary)
      ? currentDietary.filter(d => d !== dietary)
      : [...currentDietary, dietary]

    updateItem(categoryId, itemId, 'dietary', newDietary)
  }

  const handleSubmit = () => {
    if (menuMode === 'pdf') {
      onSubmit({
        ...menuConfig,
        categories: [],
      })
    } else {
      // Filter out empty items and categories
      const filteredCategories = menuConfig.categories
        .map(c => ({
          ...c,
          items: c.items.filter(i => i.name.trim()),
        }))
        .filter(c => c.name.trim() && c.items.length > 0)

      onSubmit({
        ...menuConfig,
        categories: filteredCategories,
        menuPdfUrl: undefined,
      })
    }
  }

  const unusedCategories = DEFAULT_CATEGORIES.filter(
    name => !menuConfig.categories.some(c => c.name.toLowerCase() === name.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Menu
        </h1>
        <p className="text-gray-600">
          Add your menu items or upload a PDF menu
        </p>
      </motion.div>

      {/* Menu Mode Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMenuMode('manual')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            menuMode === 'manual'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <UtensilsCrossed className={`w-6 h-6 mx-auto mb-2 ${
            menuMode === 'manual' ? 'text-primary-500' : 'text-gray-400'
          }`} />
          <p className={`font-medium ${
            menuMode === 'manual' ? 'text-primary-700' : 'text-gray-700'
          }`}>
            Build Menu Manually
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Add categories and items one by one
          </p>
        </button>
        <button
          onClick={() => setMenuMode('pdf')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            menuMode === 'pdf'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <FileText className={`w-6 h-6 mx-auto mb-2 ${
            menuMode === 'pdf' ? 'text-primary-500' : 'text-gray-400'
          }`} />
          <p className={`font-medium ${
            menuMode === 'pdf' ? 'text-primary-700' : 'text-gray-700'
          }`}>
            Link PDF Menu
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Link to an existing PDF menu
          </p>
        </button>
      </div>

      {menuMode === 'pdf' ? (
        <Card variant="gradient" className="mb-6">
          <CardContent className="pt-6">
            <Input
              label="PDF Menu URL"
              placeholder="https://example.com/menu.pdf"
              value={menuConfig.menuPdfUrl || ''}
              onChange={(e) => setMenuConfig({ ...menuConfig, menuPdfUrl: e.target.value })}
            />
            <p className="mt-2 text-sm text-gray-500">
              Paste a direct link to your PDF menu file
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Menu Settings */}
          <Card variant="default" className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-24">
                  <Input
                    label="Currency"
                    value={menuConfig.currency}
                    onChange={(e) => setMenuConfig({ ...menuConfig, currency: e.target.value })}
                    placeholder="$"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuConfig.showPrices}
                    onChange={(e) => setMenuConfig({ ...menuConfig, showPrices: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Show prices on menu</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="space-y-4">
            {menuConfig.categories.map((category, catIndex) => (
              <Card key={category.id} variant="gradient">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <UtensilsCrossed className="w-5 h-5 text-primary-500" />
                      {expandedCategories.has(category.id) ? (
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            e.stopPropagation()
                            updateCategory(category.id, 'name', e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Category name (e.g., Appetizers)"
                          className="font-semibold"
                        />
                      ) : (
                        <CardTitle>{category.name || `Category ${catIndex + 1}`}</CardTitle>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {category.items.filter(i => i.name.trim()).length} items
                      </span>
                      {menuConfig.categories.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCategory(category.id)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {expandedCategories.has(category.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedCategories.has(category.id) && (
                  <CardContent className="space-y-4">
                    <Textarea
                      label="Category Description (optional)"
                      placeholder="Brief description of this category"
                      value={category.description || ''}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                      className="min-h-[60px]"
                    />

                    {/* Menu Items */}
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white rounded-lg border border-gray-200 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 grid sm:grid-cols-3 gap-3">
                              <Input
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, 'name', e.target.value)
                                }
                                className="sm:col-span-2"
                              />
                              <Input
                                placeholder={`${menuConfig.currency}0.00`}
                                value={item.price}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, 'price', e.target.value)
                                }
                              />
                            </div>
                            {category.items.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(category.id, item.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <Textarea
                            placeholder="Item description (optional)"
                            value={item.description || ''}
                            onChange={(e) =>
                              updateItem(category.id, item.id, 'description', e.target.value)
                            }
                            className="min-h-[50px] text-sm"
                          />

                          {/* Dietary Tags */}
                          <div className="flex flex-wrap gap-2">
                            {DIETARY_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() =>
                                  toggleDietary(
                                    category.id,
                                    item.id,
                                    option.id as DietaryOption
                                  )
                                }
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                  item.dietary?.includes(option.id as DietaryOption)
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(category.id, item.id, 'isPopular', !item.isPopular)
                              }
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                item.isPopular
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              <span>⭐</span>
                              <span>Popular</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(category.id)}
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      Add Menu Item
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Add Category */}
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant="outline"
                onClick={() => addCategory()}
                className="border-dashed"
              >
                <Plus className="mr-2 w-4 h-4" />
                Add Category
              </Button>
              {unusedCategories.length > 0 && (
                <>
                  <span className="text-sm text-gray-500">Quick add:</span>
                  {unusedCategories.slice(0, 4).map((name) => (
                    <button
                      key={name}
                      onClick={() => addCategory(name)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                    >
                      + {name}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Menu Note */}
          <Card variant="default" className="mt-6">
            <CardContent className="pt-6">
              <Input
                label="Menu Note (optional)"
                placeholder="e.g., Prices subject to change. Ask about daily specials."
                value={menuConfig.note || ''}
                onChange={(e) => setMenuConfig({ ...menuConfig, note: e.target.value })}
              />
            </CardContent>
          </Card>
        </>
      )}

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
