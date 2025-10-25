import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../utils/apiClient'

const DEFAULT_COLOR = '#d8b98a'

const componentToHex = (component) => {
  const hex = Number(component).toString(16).toUpperCase()
  return hex.length === 1 ? `0${hex}` : hex
}

const parseColor = (value) => {
  if (typeof value !== 'string') {
    return { hex: DEFAULT_COLOR, label: 'Цвет' }
  }

  const trimmed = value.trim()
  const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  if (hexPattern.test(trimmed)) {
    return { hex: trimmed.toUpperCase(), label: trimmed.toUpperCase() }
  }

  const rgbMatch = trimmed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i)
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch
    const hex = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
    return { hex, label: `RGB ${r}, ${g}, ${b}` }
  }

  return { hex: DEFAULT_COLOR, label: trimmed || 'Цвет' }
}

const transformGoods = (goods) =>
  (goods || []).map((good) => {
    const variants = (good.variants || []).map((variant) => {
      const { hex, label } = parseColor(variant.color)
      const images = []
      if (variant.image) {
        images.push(variant.image)
      }
      return {
        id: variant.id,
        size: variant.size ? `${variant.size} см` : '—',
        numericSize: variant.size ?? null,
        color: hex,
        colorName: label,
        cost: variant.price ?? 0,
        images,
      }
    })

    return {
      id: good.id,
      name: good.name,
      description: good.description,
      technology: good.technology || [],
      variants,
    }
  })

export const fetchGoods = createAsyncThunk(
  'goods/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const goods = await apiFetch('/api-order/catalogue/')
      return goods
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.payload?.error || 'Не удалось получить каталог',
      )
    }
  },
)

const initialState = {
  busts: [
    {
      id: 1,
      name: 'Картонный бюст',
      description: 'Один размер — 18 см. Цвет — натуральный картон.',
      technology: [
        'HDF/картон',
        'Конструктор'
      ],
      discount: false,
      variants: [
        {
          id: 76,
          color: '#A57C47',
          colorName: 'Natural Cardboard',
          type: 'Картонный бюст',
          size: '18 см',
          cost: 3500,
          images: [
            
          ],
        }
      ]
    },
    {
      id: 2,
      name: 'Пластиковый бюст',
      description: 'Размеры: 12 / 16 / 20 см. Большая карта цветов.',
      technology: [
        'PLA Matte/PETG-CF',
        'Премиум-поверхность'
      ],
      discount: false,
      variants: [
        {
          id: 1,
          color: '#FFFFFF',
          colorName: 'Ivory White',
          type: 'Пластиковый бюст',
          size: '12 см',
          image: '',
          cost: 3450,
          images: [
            
          ],
        },
        {
          id: 2,
          color: '#FFFFFF',
          colorName: 'Ivory White',
          type: 'Пластиковый бюст',
          size: '16 см',
          image: '',
          cost: 4500,
          images: [
            
          ],
        }
      ],
    }],
  certificates: [
    {
      id: 1,
      name: 'Подарочный сертификат',
      denominations: [5500, 6500, 7500, 8500, 9500],
    },
  ]
}

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {
    console: (state, action) => {
      console.log(state, action)
    }
  }
})

// const goodsSlice = createSlice({
//   name: 'goods',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGoods.pending, (state) => {
//         state.status = 'loading'
//         state.error = null
//       })
//       .addCase(fetchGoods.fulfilled, (state, action) => {
//         state.status = 'succeeded'
//         state.error = null
//         state.busts = transformGoods(action.payload)
//       })
//       .addCase(fetchGoods.rejected, (state, action) => {
//         state.status = 'failed'
//         state.error = action.payload || action.error.message
//       })
//   },
// })

export default goodsSlice.reducer
