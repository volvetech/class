'use client'

import React, { useState, useEffect } from 'react'

interface Category {
  id: number
  code: string
  name: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export default function GarmentCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ code: '', name: '', sortOrder: 0 })

  const fetchCategories = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/garment-categories')
    const data: Category[] = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async () => {
    if (!newCategory.code || !newCategory.name) return
    await fetch('/api/admin/garment-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    })
    setShowModal(false)
    setNewCategory({ code: '', name: '', sortOrder: 0 })
    fetchCategories()
  }

  const handleUpdate = async () => {
    if (!editing) return
    await fetch(`/api/admin/garment-categories/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setEditing(null)
    fetchCategories()
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/garment-categories/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      fetchCategories()
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Garment Categories</h1>
          <p className="text-gray-400 mt-1">服装类别管理</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + 新增类别
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-4 font-medium">ID</th>
                  <th className="pb-4 font-medium">Code</th>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Active</th>
                  <th className="pb-4 font-medium">Sort Order</th>
                  <th className="pb-4 font-medium">Created At</th>
                  <th className="pb-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 text-white">{category.id}</td>
                    <td className="py-4 text-gray-300 font-mono">{category.code}</td>
                    <td className="py-4 text-white">{category.name}</td>
                    <td className="py-4">
                      {editing?.id === category.id ? (
                        <input
                          type="checkbox"
                          checked={editing.isActive}
                          onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                          className="w-4 h-4"
                        />
                      ) : (
                        <span className={`inline-block w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      )}
                    </td>
                    <td className="py-4">
                      {editing?.id === category.id ? (
                        <input
                          type="number"
                          value={editing.sortOrder}
                          onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) })}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                        />
                      ) : (
                        <span className="text-gray-300">{category.sortOrder}</span>
                      )}
                    </td>
                    <td className="py-4 text-gray-400 text-sm">{new Date(category.createdAt).toLocaleString()}</td>
                    <td className="py-4">
                      {editing?.id === category.id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 mr-2"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                          >
                            取消
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditing(category)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 mr-2"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                          >
                            删除
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/10" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">新增类别</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Code</label>
                <input
                  type="text"
                  value={newCategory.code}
                  onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="top"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="上装"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Sort Order</label>
                <input
                  type="number"
                  value={newCategory.sortOrder}
                  onChange={(e) => setNewCategory({ ...newCategory, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}