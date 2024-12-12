"use client"

import { useState, useCallback, forwardRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Edit, Plus } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"
import Select, { StylesConfig, SingleValue } from 'react-select'

const categories = [
  "Main PA / Monitors",
  "Vocal Mics",
  "Instrument Mics",
  "Mic Stands",
  "Cables",
]

interface CategoryOption {
  value: string
  label: string
}

const categoryOptions: CategoryOption[] = categories.map(cat => ({ value: cat, label: cat }))

interface InventoryFormData {
  category: string
  quantity: number
  model: string
}

interface InventoryFormProps {
  onSubmit: (data: InventoryFormData) => void
  initialData?: Partial<InventoryFormData>
  isLoading: boolean
  onCancel: () => void
}

const customSelectStyles: StylesConfig<CategoryOption, false> = {
  control: (base, state) => ({
    ...base,
    background: 'rgb(2, 6, 23)',
    borderColor: 'rgb(55, 65, 81)',
    boxShadow: state.isFocused ? '0 0 0 1px rgb(55, 65, 81)' : 'none',
    '&:hover': {
      borderColor: 'rgb(75, 85, 101)'
    }
  }),
  menu: (base) => ({
    ...base,
    background: 'rgb(2, 6, 23)',
    border: '1px solid rgb(55, 65, 81)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgb(55, 65, 81)' : 'transparent',
    color: 'white',
    '&:active': {
      backgroundColor: 'rgb(75, 85, 101)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white'
  }),
  input: (base) => ({
    ...base,
    color: 'white'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgb(156, 163, 175)'
  }),
}

const InventoryForm = forwardRef<HTMLFormElement, InventoryFormProps>(({ 
  onSubmit, 
  initialData, 
  isLoading, 
  onCancel 
}, ref) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.category 
      ? { value: initialData.category, label: initialData.category }
      : null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      category: selectedCategory?.value || '',
      quantity: Number(formData.get('quantity')),
      model: formData.get('model') as string,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          inputId="category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={(newValue: SingleValue<CategoryOption>) => setSelectedCategory(newValue)}
          placeholder="Select category"
          isClearable
          styles={customSelectStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'rgb(55, 65, 81)',
              primary25: 'rgb(55, 65, 81)',
              neutral0: 'rgb(2, 6, 23)',
              neutral20: 'rgb(55, 65, 81)',
              neutral30: 'rgb(75, 85, 101)',
              neutral40: 'rgb(156, 163, 175)',
              neutral50: 'rgb(156, 163, 175)',
              neutral60: 'white',
              neutral80: 'white',
            },
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input 
          id="quantity" 
          name="quantity"
          type="number" 
          min="1" 
          defaultValue={initialData?.quantity}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input 
          id="model" 
          name="model"
          defaultValue={initialData?.model}
          placeholder="Enter model name" 
          required 
        />
      </div>
      <div className="flex space-x-2 justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "bg-green-600 hover:bg-green-500 text-white",
            "flex-1 md:flex-none md:min-w-[100px]"
          )}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update' : 'Submit'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className={cn(
            "bg-red-600 hover:bg-red-500 text-white",
            "flex-1 md:flex-none md:min-w-[100px]"
          )}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
})

InventoryForm.displayName = 'InventoryForm'

const inventoryItems = [
  { category: "Main PA / Monitors", items: [
    { quantity: 2, model: "JBL SRX835P" },
    { quantity: 4, model: "QSC K12.2" },
  ]},
  { category: "Vocal Mics", items: [
    { quantity: 4, model: "Shure SM58" },
    { quantity: 2, model: "Sennheiser e935" },
  ]},
  { category: "Instrument Mics", items: [
    { quantity: 2, model: "Shure SM57" },
    { quantity: 1, model: "AKG C414" },
  ]},
  { category: "Mic Stands", items: [
    { quantity: 6, model: "K&M 210/9" },
    { quantity: 2, model: "Atlas MS-12C" },
  ]},
  { category: "Cables", items: [
    { quantity: 20, model: "XLR 25ft" },
    { quantity: 10, model: "1/4\" TS 15ft" },
  ]},
]

export function InventoryGrid() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<{ category: string, item: { quantity: number, model: string } } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (data: InventoryFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingItem(null)
    }
  }, [])

  const handleAdd = useCallback(() => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((category: string, item: { quantity: number, model: string }) => {
    setEditingItem({ category, item })
    setIsDialogOpen(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setEditingItem(null)
            setIsDialogOpen(true)
          }}
          className="bg-orange-600 hover:bg-orange-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventoryItems.map((item) => (
          <Card key={item.category} className="bg-orange-tint text-white">
            <CardHeader>
              <CardTitle>{item.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {item.items.map((equipment, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{equipment.quantity}x {equipment.model}</span>
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(item.category, equipment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <InventoryForm
            onSubmit={handleSubmit}
            initialData={editingItem ? {
              category: editingItem.category,
              quantity: editingItem.item.quantity,
              model: editingItem.item.model,
            } : undefined}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

