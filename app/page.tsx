"use client"

import { useState, useEffect } from "react"
import { Star, Sparkles, Coffee, UtensilsCrossed } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Complete menu data based on your images
const menuData = {
  beef: [
    { name: "Beef Fry", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Masala", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Roast", price: 170, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Chilli Dry", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Chilli Gravy", price: 170, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pepper Beef", price: 170, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Kondattam", price: 180, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Kadai", price: 400, image: "/placeholder.svg?height=150&width=200" },
  ],
  chicken: [
    {
      name: "Chicken 65",
      price: 160,
      sizes: { quarter: 160, half: 300, full: 520 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Pepper Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Kadai Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Ginger Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Garlic Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Chilli Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Chilli Chicken Gravy",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Butter Chicken",
      price: 230,
      sizes: { quarter: 230, half: 380, full: 600 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Chicken Manchurian",
      price: 250,
      sizes: { quarter: 250, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Chicken Kondattam",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Malabar Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Chettinad Chicken",
      price: 230,
      sizes: { quarter: 230, half: 350, full: 550 },
      image: "/placeholder.svg?height=150&width=200",
    },
    { name: "Lemon Chicken", price: 300, image: "/placeholder.svg?height=150&width=200" },
    { name: "Honey Glaze", price: 300, image: "/placeholder.svg?height=150&width=200" },
    { name: "Hunan Chicken", price: 300, image: "/placeholder.svg?height=150&width=200" },
    { name: "Korean Chicken", price: 300, image: "/placeholder.svg?height=150&width=200" },
    { name: "Dragon Chicken", price: 300, image: "/placeholder.svg?height=150&width=200" },
    { name: "Schezwan Chicken", price: 270, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mugalai Chicken", price: 300, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Curry", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Masala", price: 170, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Roast", price: 170, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Dry Fry", price: 170, image: "/placeholder.svg?height=150&width=200" },
  ],
  grill: [
    {
      name: "Tandoori Alfaham",
      price: 150,
      sizes: { quarter: 150, half: 290, full: 520 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Alfaham",
      price: 130,
      sizes: { quarter: 130, half: 250, full: 500 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Kanthari Alfaham",
      price: 140,
      sizes: { quarter: 140, half: 270, full: 530 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Periperi Alfaham",
      price: 140,
      sizes: { quarter: 140, half: 270, full: 530 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Butter Alfaham",
      price: 190,
      sizes: { quarter: 190, half: 380, full: 700 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Pepper Alfaham",
      price: 140,
      sizes: { quarter: 140, half: 270, full: 530 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Honey Chilli Alfaham",
      price: 140,
      sizes: { quarter: 140, half: 340, full: 650 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Schezwan Alfaham",
      price: 140,
      sizes: { quarter: 140, half: 270, full: 530 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Shawaya",
      price: 140,
      sizes: { quarter: 140, half: 250, full: 500 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Masala Shawaya",
      price: 270,
      sizes: { quarter: 270, half: 530, full: 530 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Fired Chicken",
      price: 250,
      sizes: { quarter: 250, half: 500, full: 500 },
      image: "/placeholder.svg?height=150&width=200",
    },
  ],
  mandhi: [
    {
      name: "Alfaham",
      price: 200,
      sizes: { quarter: 200, half: 400, full: 700 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Kanthari Alfaham",
      price: 220,
      sizes: { quarter: 220, half: 430, full: 750 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Periperi Alfaham",
      price: 220,
      sizes: { quarter: 220, half: 430, full: 750 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Butter Alfaham",
      price: 240,
      sizes: { quarter: 240, half: 470, full: 820 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Pepper Alfaham",
      price: 220,
      sizes: { quarter: 220, half: 430, full: 750 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Honey Chilli Alfaham",
      price: 240,
      sizes: { quarter: 240, half: 470, full: 820 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Schezwan Alfaham",
      price: 220,
      sizes: { quarter: 220, half: 430, full: 750 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Shawaya",
      price: 400,
      sizes: { quarter: 400, half: 700, full: 700 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Masala Shawaya",
      price: 430,
      sizes: { quarter: 430, half: 750, full: 750 },
      image: "/placeholder.svg?height=150&width=200",
    },
  ],
  fish: [
    { name: "Fish Fry", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fish Thava", price: 150, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fish Pollichathu", price: 180, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fish Curry", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fish Masala", price: 140, image: "/placeholder.svg?height=150&width=200" },
    { name: "Squid Fry", price: 160, image: "/placeholder.svg?height=150&width=200" },
    { name: "Squid Masala", price: 180, image: "/placeholder.svg?height=150&width=200" },
    { name: "Prawns Fry", price: 200, image: "/placeholder.svg?height=150&width=200" },
    { name: "Prawns Masala", price: 220, image: "/placeholder.svg?height=150&width=200" },
  ],
  beverages: [
    { name: "Tea", price: 13, image: "/placeholder.svg?height=150&width=200" },
    { name: "Coffee", price: 30, image: "/placeholder.svg?height=150&width=200" },
    { name: "Boost", price: 30, image: "/placeholder.svg?height=150&width=200" },
    { name: "Horlicks", price: 30, image: "/placeholder.svg?height=150&width=200" },
    { name: "Anar Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Vanilla Milkshake", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Sharjah Milkshake", price: 110, image: "/placeholder.svg?height=150&width=200" },
    { name: "Saudi Milkshake", price: 110, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chocolate Milkshake", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Badam Milkshake", price: 110, image: "/placeholder.svg?height=150&width=200" },
    { name: "Strawberry Milkshake", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pista Milkshake", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chikku Milkshake", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pappaya Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mango Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Apple Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Butter Scotch Milkshake", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Oreo Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Kitkat Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Snickers Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Peanut Butter Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Tender Coconut Milkshake", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Robsa Milkshake", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Titanic Milkshake", price: 140, image: "/placeholder.svg?height=150&width=200" },
    { name: "Cornflakes Milkshake", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Diarymilk Milkshake", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Grape Milkshake", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fresh Lime", price: 30, image: "/placeholder.svg?height=150&width=200" },
    { name: "Ginger Lime", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mint Lime", price: 35, image: "/placeholder.svg?height=150&width=200" },
    { name: "Grape Lime", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pineapple Lime", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Blue Lime", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Avil Milk Normal", price: 50, image: "/placeholder.svg?height=150&width=200" },
    { name: "Avil Milk Special", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Avil Milk Boost", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Avil Milk Chocolate", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Avil Milk Horlicks", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chikku Juice", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pappaya Juice", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Grape Juice", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pineapple Juice", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Apple Juice", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Anar Juice", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mango Juice", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Watermelon Juice", price: 60, image: "/placeholder.svg?height=150&width=200" },
    { name: "Orange Juice", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Musambi Juice", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Shamam Juice", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Avocado Juice", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Falooda Normal", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Falooda Royal", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Falooda Mango", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mint Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Green Apple Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Passion Fruit Mojito", price: 110, image: "/placeholder.svg?height=150&width=200" },
    { name: "Strawberry Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Orange Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Black Current Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Blue Current Mojito", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Watermelon Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Guava Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pistha Mojito", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mango Mojito", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Vanilla Ice Cream", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Oreo Cookie Crunch Ice Cream", price: 90, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chocolate Ice Cream", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Strawberry Ice Cream", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Butter Scotch Ice Cream", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Tender Coconut Ice Cream", price: 50, image: "/placeholder.svg?height=150&width=200" },
  ],
  breakfast: [
    { name: "Porotta", price: 15, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chapathi", price: 15, image: "/placeholder.svg?height=150&width=200" },
    { name: "Idiyappam", price: 12, image: "/placeholder.svg?height=150&width=200" },
    { name: "Vellappam", price: 12, image: "/placeholder.svg?height=150&width=200" },
    { name: "Ghee Roast", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Masala Dosa", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Veg. Kuruma", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Egg Curry", price: 40, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fish Curry", price: 60, image: "/placeholder.svg?height=150&width=200" },
    { name: "Beef Masala", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Curry", price: 120, image: "/placeholder.svg?height=150&width=200" },
  ],
  soups: [
    { name: "Hot & Sour Chicken", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Hot & Sour Veg", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Manchow", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Veg. Manchow", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chicken Sweet Corn", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Veg. Sweet Corn", price: 80, image: "/placeholder.svg?height=150&width=200" },
  ],
  biriyani: [
    { name: "Malabar Biriyani", price: 150, image: "/placeholder.svg?height=150&width=200" },
    {
      name: "Chicken Biriyani",
      price: 140,
      sizes: { full: 140, half: 100 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Beef Biriyani",
      price: 140,
      sizes: { full: 140, half: 100 },
      image: "/placeholder.svg?height=150&width=200",
    },
    { name: "Veg. Biriyani", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Fish Biriyani", price: 130, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mutton Biriyani", price: 180, image: "/placeholder.svg?height=150&width=200" },
    { name: "Prawns Biriyani", price: 200, image: "/placeholder.svg?height=150&width=200" },
  ],
  bread: [
    { name: "Porotta", price: 15, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chappathi", price: 15, image: "/placeholder.svg?height=150&width=200" },
    { name: "Pathiri", price: 10, image: "/placeholder.svg?height=150&width=200" },
  ],
  rotti: [
    { name: "Thandoor Rotti", price: 25, image: "/placeholder.svg?height=150&width=200" },
    { name: "Butter Rotti", price: 30, image: "/placeholder.svg?height=150&width=200" },
    { name: "Plain Nan", price: 30, image: "/placeholder.svg?height=150&width=200" },
    { name: "Butter Nan", price: 35, image: "/placeholder.svg?height=150&width=200" },
  ],
  rice: [
    {
      name: "Chicken Fried Rice",
      price: 170,
      sizes: { normal: 170, schezwan: 190 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Veg. Fried Rice",
      price: 140,
      sizes: { normal: 140, schezwan: 160 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Egg Fried Rice",
      price: 150,
      sizes: { normal: 150, schezwan: 170 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Mixed Fried Rice",
      price: 200,
      sizes: { normal: 200, schezwan: 220 },
      image: "/placeholder.svg?height=150&width=200",
    },
    { name: "Ghee Rice", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Biriyani Rice", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mandhi Rice", price: 90, image: "/placeholder.svg?height=150&width=200" },
  ],
  noodles: [
    {
      name: "Chicken Noodles",
      price: 190,
      sizes: { normal: 190, schezwan: 210 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Egg Noodles",
      price: 160,
      sizes: { normal: 160, schezwan: 180 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Veg. Noodles",
      price: 150,
      sizes: { normal: 150, schezwan: 170 },
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      name: "Mixed Noodles",
      price: 200,
      sizes: { normal: 200, schezwan: 220 },
      image: "/placeholder.svg?height=150&width=200",
    },
  ],
  veggies: [
    { name: "Veg. Kuruma", price: 70, image: "/placeholder.svg?height=150&width=200" },
    { name: "Gopi Munchurian", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chilli Gopi", price: 120, image: "/placeholder.svg?height=150&width=200" },
    { name: "Gopi Masala", price: 160, image: "/placeholder.svg?height=150&width=200" },
    { name: "Chilli Gopi Dry", price: 100, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mushroom Masala", price: 170, image: "/placeholder.svg?height=150&width=200" },
    { name: "Veg. Kadai", price: 200, image: "/placeholder.svg?height=150&width=200" },
    { name: "Paneer Butter Masala", price: 220, image: "/placeholder.svg?height=150&width=200" },
    { name: "Paneer Kadai", price: 230, image: "/placeholder.svg?height=150&width=200" },
    { name: "Tomato Fry", price: 80, image: "/placeholder.svg?height=150&width=200" },
    { name: "Mushroom Chilli", price: 200, image: "/placeholder.svg?height=150&width=200" },
    { name: "Paneer Chilli", price: 220, image: "/placeholder.svg?height=150&width=200" },
  ],
}

const categories = [
  { id: "beef", name: "Beef", icon: UtensilsCrossed, color: "from-red-600 to-red-700" },
  { id: "chicken", name: "Chicken", icon: UtensilsCrossed, color: "from-orange-500 to-red-600" },
  { id: "grill", name: "Grill", icon: UtensilsCrossed, color: "from-orange-400 to-red-500" },
  { id: "mandhi", name: "Mandhi", icon: UtensilsCrossed, color: "from-yellow-500 to-orange-600" },
  { id: "fish", name: "Fish", icon: UtensilsCrossed, color: "from-blue-500 to-cyan-600" },
  { id: "beverages", name: "Beverages", icon: Coffee, color: "from-purple-500 to-pink-600" },
  { id: "breakfast", name: "Breakfast", icon: UtensilsCrossed, color: "from-green-500 to-emerald-600" },
  { id: "soups", name: "Soups", icon: UtensilsCrossed, color: "from-amber-500 to-yellow-600" },
  { id: "biriyani", name: "Biriyani", icon: UtensilsCrossed, color: "from-indigo-500 to-purple-600" },
  { id: "bread", name: "Bread", icon: UtensilsCrossed, color: "from-amber-600 to-orange-700" },
  { id: "rotti", name: "Rotti", icon: UtensilsCrossed, color: "from-yellow-600 to-amber-700" },
  { id: "rice", name: "Rice", icon: UtensilsCrossed, color: "from-green-600 to-teal-700" },
  { id: "noodles", name: "Noodles", icon: UtensilsCrossed, color: "from-pink-500 to-rose-600" },
  { id: "veggies", name: "Veggies", icon: UtensilsCrossed, color: "from-emerald-500 to-green-600" },
]

export default function SilverStarMenu() {
  const [activeCategory, setActiveCategory] = useState("beef")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const StarField = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <Star className="w-1 h-1 text-amber-400 fill-current" />
        </div>
      ))}
    </div>
  )

  const FloatingSparkles = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <Sparkles className="w-2 h-2 text-amber-300 fill-current opacity-60" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,215,0,0.05)_60deg,transparent_120deg)]" />
      </div>

      <StarField />
      <FloatingSparkles />

      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <div
          className={`transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex justify-center items-center mb-4">
            <Star
              className="w-8 h-8 text-amber-400 fill-current mr-2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent animate-pulse">
              HOTEL SILVER STAR
            </h1>
            <Star
              className="w-8 h-8 text-amber-400 fill-current ml-2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <p className="text-xl md:text-2xl text-amber-300 font-light tracking-wider">DELICIOUS MENU</p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4 animate-pulse" />
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="relative z-10 px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`
                  relative overflow-hidden group transition-all duration-300 transform hover:scale-105
                  ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-black font-bold shadow-lg shadow-amber-500/25`
                      : "bg-black/50 border-amber-400/50 text-amber-300 hover:bg-amber-400/10"
                  }
                `}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
                {activeCategory === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Menu Items */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {categories.find((cat) => cat.id === activeCategory)?.name} Menu
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {menuData[activeCategory as keyof typeof menuData]?.map((item, index) => (
                <Card
                  key={index}
                  className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 backdrop-blur-sm"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-1 right-1 md:top-2 md:right-2">
                        <Badge className="bg-amber-400 text-black font-bold text-xs">
                          ₹{item.sizes ? item.sizes.quarter || item.sizes.normal || item.sizes.full : item.price}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-2 md:p-4">
                      <h3 className="text-xs sm:text-sm md:text-lg font-bold text-amber-300 mb-1 md:mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>

                      {item.sizes ? (
                        <div className="space-y-0.5 md:space-y-1">
                          {Object.entries(item.sizes).map(([size, price]) => (
                            <div key={size} className="flex justify-between text-xs md:text-sm">
                              <span className="text-gray-300 capitalize">{size}</span>
                              <span className="text-amber-400 font-semibold">₹{price}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-lg md:text-2xl font-bold text-amber-400">₹{item.price}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-4 border-t border-amber-400/30">
        <div className="flex justify-center items-center mb-4">
          <Star className="w-6 h-6 text-amber-400 fill-current mr-2" />
          <p className="text-amber-300 text-lg font-semibold">PATTAMBI ROAD, CHERPULASSERY</p>
          <Star className="w-6 h-6 text-amber-400 fill-current ml-2" />
        </div>
        <p className="text-amber-400 font-bold">📞 0466-2281 030 | 9656 093 805</p>
      </footer>
    </div>
  )
}
