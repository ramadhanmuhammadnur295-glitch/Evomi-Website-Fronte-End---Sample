// src/config/constants.ts

// ============================================================
// App Metadata
// ============================================================
export const APP_NAME = "Website Super Keren";
export const GLOBAL_DESCRIPTION =
  "Ini adalah deskripsi yang dipakai di banyak halaman.";

// ============================================================
// Base URL Configuration
// ============================================================
export const BASE_URL_LOCAL = "http://127.0.0.1:8000";
export const BASE_URL_ONLINE = "https://ramadhan.alwaysdata.net";

// Base URL yang digunakan untuk API, bisa diubah sesuai kebutuhan (local atau online)
export const BASE_URL = BASE_URL_ONLINE;

// ============================================================
// Pricing Constants
// ============================================================
export const HARGA_EVOMI = 100;
export const HARGA_ONGKIR = 100;

// ============================================================
// API Route Prefix
// ============================================================
export const STRING_API = "/api";

// ============================================================
// Authentication Endpoints
// ============================================================
export const REGISTER_USER = "/register";
export const LOGIN_USER = "/login";
export const LOGIN_ADMIN = "/admin/login";

// ============================================================
// Products Endpoints
// ============================================================
export const PRODUCTS = "/products";

// ============================================================
// Cart Endpoints
// ============================================================
export const CART = "/cart";
export const CART_ADD = "/cart/add";

// ============================================================
// Orders Endpoints
// ============================================================
export const ORDER = "/orders";
export const CHECKOUT = "/orders/checkout";

// ============================================================
// Chat Endpoints
// ============================================================
export const GET_CONVERSATIONS = "/conversations";
export const GET_CHAT_MESSAGES = "/chat/messages";
export const SEND_MESSAGES = "/chat/send";

// ============================================================
// Admin & User Endpoints
// ============================================================
export const GET_ADMIN_DASHBOARD_STATS = "/admin/dashboard-stats";
export const GET_ALL_USERS = "/admin/users";
