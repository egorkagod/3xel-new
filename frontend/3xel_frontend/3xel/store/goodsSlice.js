import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../utils/apiClient'
import digitalCertificate from '../public/3xel_images/certificate.jpg'

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
      const images = variant.images
      return {
        id: variant.id,
        color: hex,
        type: variant.type,
        colorName: label,
        images,
      }
    })

    return {
      id: good.id,
      name: good.name,
      cost: good.cost,
      size: good.size,
      box_sizes: good.box_sizes,
      weight: good.weight,
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
  busts: [],
  certificates: [
    {
      id: 1,
      name: 'Подарочный сертификат на персональный бюст',
      type: 'physical',
      denominations: [4000, 5000, 7500, 7900, 8500, 11400, 12300, 15800],
      boxLength: 17,
      width: 12,
      height: 1,
      weight: 100,
      images: [
        '/media/images/certificates/1.png',
        '/media/images/certificates/2.png',
      ],
      description: 'Карточный сертификат — это осязаемый знак внимания. Его приятно держать в руках, дарить лично и открывать как маленький секрет. Получатель сам определит, какое видео станет основой для бюста и какой вариант исполнения ему ближе. Такой подарок запоминается надолго.',
    },
    {
      id: 2,
      name: 'Электронный подарочный сертификат',
      type: 'digital',
      denominations: [4000, 5000, 7500, 7900, 8500, 11400, 12300, 15800],
      images: [
        '/media/images/certificates/digital-cert.jpg',
      ],
      description: 'Цифровой сертификат экономит время и расширяет возможности: отправьте его онлайн, и получатель тут же приступит к созданию персонального бюста. Выбор видео, настройка параметров — всё в одном клике. Практичный вариант для современных реалий.',
    }
  ]
}

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoods.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchGoods.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.busts = transformGoods(action.payload)
      })
      .addCase(fetchGoods.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export default goodsSlice.reducer
