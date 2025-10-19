import { createSlice } from "@reduxjs/toolkit"
import ivory1 from '/3xel_images/ivory_white1.png'
import ivory2 from '/3xel_images/ivory_white2.png'
import bone_white1 from '/3xel_images/bone_white1.png'
import bone_white2 from '/3xel_images/bone_white2.png'
import desert_tan1 from '/3xel_images/desert_tan1.png'
import desert_tan2 from '/3xel_images/desert_tan2.png'
import latte_brown1 from '/3xel_images/latte_brown1.png'
import latte_brown2 from '/3xel_images/latte_brown2.png'
import caramel1 from '/3xel_images/caramel1.png'
import dark_brown1 from '/3xel_images/dark_brown1.png'
import dark_brown2 from '/3xel_images/dark_brown2.png'
import dark_chocolate1 from '/3xel_images/dark_chocolate1.png'
import sakura_pink1 from '/3xel_images/sakura_pink1.png'
import sakura_pink2 from '/3xel_images/sakura_pink2.png'
import dark_red1 from '/3xel_images/dark_red1.png'
import dark_red2 from '/3xel_images/dark_red2.png'
import scarlet_red1 from '/3xel_images/scarlet_red1.png'
import lilac_purple1 from '/3xel_images/lilac_purple1.png'
import plum1 from '/3xel_images/plum1.png'
import plum2 from '/3xel_images/plum2.png'
import mandarin_orange1 from '/3xel_images/mandarin_orange1.png'
import lemon_yellow1 from '/3xel_images/lemon_yellow1.png'
import lemon_yellow2 from '/3xel_images/lemon_yellow2.png'
import grass_green1 from '/3xel_images/grass_green1.png'
import grass_green2 from '/3xel_images/grass_green2.png'
import apple_green1 from '/3xel_images/apple_green1.png'
import dark_green1 from '/3xel_images/dark_green1.png'
import dark_green2 from '/3xel_images/dark_green2.png'
import ice_blue1 from '/3xel_images/ice_blue1.png'
import sky_blue1 from '/3xel_images/sky_blue1.png'
import sky_blue2 from '/3xel_images/sky_blue2.png'
import dark_blue1 from '/3xel_images/dark_blue1.png'
import marine_blue1 from '/3xel_images/marine_blue1.png'
import marine_blue2 from '/3xel_images/marine_blue2.png'
import marine_blue3 from '/3xel_images/marine_blue3.png'
import ash_gray1 from '/3xel_images/ash_gray1.png'
import nardo_gray1 from '/3xel_images/nardo_gray1.png'
import charcoal1 from '/3xel_images/charcoal1.png'
import natural_cardboard1 from '/3xel_images/natural_cardboard1.png'
import natural_cardboard2 from '/3xel_images/natural_cardboard2.png'
import natural_cardboard3 from '/3xel_images/natural_cardboard3.png'
import natural_cardboard4 from '/3xel_images/natural_cardboard4.png'

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
            variants: [
                {
                    id: 76,
                    color: '#A57C47',
                    colorName: 'Natural Cardboard',
                    size: '18 см',
                    cost: 3500,
                    images: [
                        natural_cardboard1,
                        natural_cardboard2,
                        natural_cardboard3,
                        natural_cardboard4,
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
            variants: [
                {
                    id: 1,
                    color: '#FFFFFF',
                    colorName: 'Ivory White',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        ivory1,
                        ivory2,
                    ],
                },
                {
                    id: 2,
                    color: '#FFFFFF',
                    colorName: 'Ivory White',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        ivory1,
                        ivory2,
                    ],
                },
                {
                    id: 3,
                    color: '#FFFFFF',
                    colorName: 'Ivory White',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        ivory1,
                        ivory2,
                    ],
                },
                {
                    id: 4,
                    color: '#CBC6B8',
                    colorName: 'Bone White',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        bone_white1,
                        bone_white2,
                    ],
                },
                {
                    id: 5,
                    color: '#CBC6B8',
                    colorName: 'Bone White',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        bone_white1,
                        bone_white2,
                    ],
                },
                {
                    id: 6,
                    color: '#CBC6B8',
                    colorName: 'Bone White',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        bone_white1,
                        bone_white2,
                    ],
                },
                {
                    id: 7,
                    color: '#E8DBB7',
                    colorName: 'Desert Tan',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        desert_tan1,
                        desert_tan2,
                    ],
                },
                {
                    id: 8,
                    color: '#E8DBB7',
                    colorName: 'Desert Tan',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        desert_tan1,
                        desert_tan2,
                    ],
                },
                {
                    id: 9,
                    color: '#E8DBB7',
                    colorName: 'Desert Tan',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        desert_tan1,
                        desert_tan2,
                    ],
                },
                {
                    id: 10,
                    color: '#D3B7A7',
                    colorName: 'Latte Brown',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        latte_brown1,
                        latte_brown2,
                    ],
                },
                {
                    id: 11,
                    color: '#D3B7A7',
                    colorName: 'Latte Brown',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        latte_brown1,
                        latte_brown2,
                    ],
                },
                {
                    id: 12,
                    color: '#D3B7A7',
                    colorName: 'Latte Brown',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        latte_brown1,
                        latte_brown2,
                    ],
                },
                {
                    id: 13,
                    color: '#AE835B',
                    colorName: 'Caramel',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        caramel1,
                    ],
                },
                {
                    id: 14,
                    color: '#AE835B',
                    colorName: 'Caramel',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        caramel1,
                    ],
                },
                {
                    id: 15,
                    color: '#AE835B',
                    colorName: 'Caramel',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        caramel1,
                    ],
                },
                {
                    id: 16,
                    color: '#B15533',
                    colorName: 'Terracotta',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        ivory1,
                        ivory2,
                    ],
                },
                {
                    id: 17,
                    color: '#B15533',
                    colorName: 'Terracotta',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        ivory1,
                        ivory2,
                    ],
                },
                {
                    id: 18,
                    color: '#B15533',
                    colorName: 'Terracotta',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        ivory1,
                        ivory2,
                    ],
                },
                {
                    id: 19,
                    color: '#7D6556',
                    colorName: 'Dark Brown',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        dark_brown1,
                        dark_brown2,
                    ],
                },
                {
                    id: 20,
                    color: '#7D6556',
                    colorName: 'Dark Brown',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        dark_brown1,
                        dark_brown2,
                    ],
                },
                {
                    id: 21,
                    color: '#7D6556',
                    colorName: 'Dark Brown',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        dark_brown1,
                        dark_brown2,
                    ],
                },
                {
                    id: 22,
                    color: '#4D3324',
                    colorName: 'Dark Chocolate',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        dark_chocolate1,
                    ],
                },
                {
                    id: 23,
                    color: '#4D3324',
                    colorName: 'Dark Chocolate',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        dark_chocolate1,
                    ],
                },
                {
                    id: 24,
                    color: '#4D3324',
                    colorName: 'Dark Chocolate',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        dark_chocolate1,
                    ],
                },
                {
                    id: 25,
                    color: '#AE96D4',
                    colorName: 'Lilac Purple',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        lilac_purple1,
                    ],
                },
                {
                    id: 26,
                    color: '#AE96D4',
                    colorName: 'Lilac Purple',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        lilac_purple1,
                    ],
                },
                {
                    id: 27,
                    color: '#AE96D4',
                    colorName: 'Lilac Purple',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        lilac_purple1,
                    ],
                },
                {
                    id: 28,
                    color: '#E8AFCF',
                    colorName: 'Sakura Pink',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        sakura_pink1,
                        sakura_pink2,
                    ],
                },
                {
                    id: 29,
                    color: '#E8AFCF',
                    colorName: 'Sakura Pink',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        sakura_pink1,
                        sakura_pink2,
                    ],
                },
                {
                    id: 30,
                    color: '#E8AFCF',
                    colorName: 'Sakura Pink',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        sakura_pink1,
                        sakura_pink2,
                    ],
                },
                {
                    id: 31,
                    color: '#F99963',
                    colorName: 'Mandarin Orange',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        mandarin_orange1,
                    ],
                },
                {
                    id: 32,
                    color: '#F99963',
                    colorName: 'Mandarin Orange',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        mandarin_orange1,
                    ],
                },
                {
                    id: 33,
                    color: '#F99963',
                    colorName: 'Mandarin Orange',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        mandarin_orange1,
                    ],
                },
                {
                    id: 34,
                    color: '#F7D959',
                    colorName: 'Lemon Yellow',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        lemon_yellow1,
                        lemon_yellow2,
                    ],
                },
                {
                    id: 35,
                    color: '#F7D959',
                    colorName: 'Lemon Yellow',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        lemon_yellow1,
                        lemon_yellow2,
                    ],
                },
                {
                    id: 36,
                    color: '#F7D959',
                    colorName: 'Lemon Yellow',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        lemon_yellow1,
                        lemon_yellow2,
                    ],
                },
                {
                    id: 37,
                    color: '#950051',
                    colorName: 'Plum',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        plum1,
                        plum2,
                    ],
                },
                {
                    id: 38,
                    color: '#950051',
                    colorName: 'Plum',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        plum1,
                        plum2,
                    ],
                },
                {
                    id: 39,
                    color: '#950051',
                    colorName: 'Plum',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        plum1,
                        plum2,
                    ],
                },
                {
                    id: 40,
                    color: '#DE4343',
                    colorName: 'Scarlet Red',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        scarlet_red1,
                    ],
                },
                {
                    id: 41,
                    color: '#DE4343',
                    colorName: 'Scarlet Red',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        scarlet_red1,
                    ],
                },
                {
                    id: 42,
                    color: '#DE4343',
                    colorName: 'Scarlet Red',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        scarlet_red1,
                    ],
                },
                {
                    id: 43,
                    color: '#BB3D43',
                    colorName: 'Dark Red',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        dark_red1,
                        dark_red2,
                    ],
                },
                {
                    id: 44,
                    color: '#BB3D43',
                    colorName: 'Dark Red',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        dark_red1,
                        dark_red2,
                    ],
                },
                {
                    id: 45,
                    color: '#BB3D43',
                    colorName: 'Dark Red',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        dark_red1,
                        dark_red2,
                    ],
                },
                {
                    id: 46,
                    color: '#68724D',
                    colorName: 'Dark Green',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        dark_green1,
                        dark_green2,
                    ],
                },
                {
                    id: 47,
                    color: '#68724D',
                    colorName: 'Dark Green',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        dark_green1,
                        dark_green2,
                    ],
                },
                {
                    id: 48,
                    color: '#68724D',
                    colorName: 'Dark Green',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        dark_green1,
                        dark_green2,
                    ],
                },
                {
                    id: 49,
                    color: '#61C680',
                    colorName: 'Grass Green',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        grass_green1,
                        grass_green2,
                    ],
                },
                {
                    id: 50,
                    color: '#61C680',
                    colorName: 'Grass Green',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        grass_green1,
                        grass_green2,
                    ],
                },
                {
                    id: 51,
                    color: '#61C680',
                    colorName: 'Grass Green',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        grass_green1,
                        grass_green2,
                    ],
                },
                {
                    id: 52,
                    color: '#C2E189',
                    colorName: 'Apple Green',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        apple_green1,
                    ],
                },
                {
                    id: 53,
                    color: '#C2E189',
                    colorName: 'Apple Green',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        apple_green1,
                    ],
                },
                {
                    id: 54,
                    color: '#C2E189',
                    colorName: 'Apple Green',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        apple_green1,
                    ],
                },
                {
                    id: 55,
                    color: '#A3D8E1',
                    colorName: 'Ice Blue',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        ice_blue1,
                    ],
                },
                {
                    id: 56,
                    color: '#A3D8E1',
                    colorName: 'Ice Blue',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        ice_blue1,
                    ],
                },
                {
                    id: 57,
                    color: '#A3D8E1',
                    colorName: 'Ice Blue',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        ice_blue1,
                    ],
                },
                {
                    id: 58,
                    color: '#56B7E6',
                    colorName: 'Sky Blue',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        sky_blue1,
                        sky_blue2,
                    ],
                },
                {
                    id: 59,
                    color: '#56B7E6',
                    colorName: 'Sky Blue',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        sky_blue1,
                        sky_blue2,
                    ],
                },
                {
                    id: 60,
                    color: '#56B7E6',
                    colorName: 'Sky Blue',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        sky_blue1,
                        sky_blue2,
                    ],
                },
                {
                    id: 61,
                    color: '#0078BF',
                    colorName: 'Marine Blue',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        marine_blue1,
                        marine_blue2,
                        marine_blue3,
                    ],
                },
                {
                    id: 62,
                    color: '#0078BF',
                    colorName: 'Marine Blue',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        marine_blue1,
                        marine_blue2,
                        marine_blue3,
                    ],
                },
                {
                    id: 63,
                    color: '#0078BF',
                    colorName: 'Marine Blue',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        marine_blue1,
                        marine_blue2,
                        marine_blue3,
                    ],
                },
                {
                    id: 64,
                    color: '#042F56',
                    colorName: 'Dark Blue',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        dark_blue1,
                    ],
                },
                {
                    id: 65,
                    color: '#042F56',
                    colorName: 'Dark Blue',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        dark_blue1,
                    ],
                },
                {
                    id: 66,
                    color: '#042F56',
                    colorName: 'Dark Blue',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        dark_blue1,
                    ],
                },
                {
                    id: 67,
                    color: '#9B9EA0',
                    colorName: 'Ash Gray',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        ash_gray1,
                    ],
                },
                {
                    id: 68,
                    color: '#9B9EA0',
                    colorName: 'Ash Gray',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        ash_gray1,
                    ],
                },
                {
                    id: 69,
                    color: '#9B9EA0',
                    colorName: 'Ash Gray',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        ash_gray1,
                    ],
                },
                {
                    id: 70,
                    color: '#757575',
                    colorName: 'Nardo Gray',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        nardo_gray1,
                    ],
                },
                {
                    id: 71,
                    color: '#757575',
                    colorName: 'Nardo Gray',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        nardo_gray1,
                    ],
                },
                {
                    id: 72,
                    color: '#757575',
                    colorName: 'Nardo Gray',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        nardo_gray1,
                    ],
                },
                {
                    id: 73,
                    color: '#000000',
                    colorName: 'Charcoal',
                    size: '12 см',
                    image: '',
                    cost: 3450,
                    images: [
                        charcoal1,
                    ],
                },
                {
                    id: 74,
                    color: '#000000',
                    colorName: 'Charcoal',
                    size: '16 см',
                    image: '',
                    cost: 4500,
                    images: [
                        charcoal1,
                    ],
                },
                {
                    id: 75,
                    color: '#000000',
                    colorName: 'Charcoal',
                    size: '20 см',
                    image: '',
                    cost: 5200,
                    images: [
                        charcoal1,
                    ],
                },

            ]
        }
    ],
    cerificates: [
        {
            id: 3,
            name: 'Подарочный сертификат',
            denominations: [
                5500,
                6500,
                7500,
                8500,
                9500,
            ]
        }
    ]
}

const goodsSlice = createSlice({
    name: 'goods',
    initialState,
    reducers: {
        console: (state) => {
            console.log(state)
        }
    }
})

export const { console } = goodsSlice.actions
export default goodsSlice.reducer