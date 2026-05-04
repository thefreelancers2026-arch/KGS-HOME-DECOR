/* ═══════════════════════════════════════════════════════════
   KGS Home Décors — Supabase Client
   Handles auth, products, cart, wishlist, orders
═══════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://rgpkomngygapwjhnbgaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncGtvbW5neWdhcHdqaG5iZ2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjg2MDYsImV4cCI6MjA5Mjk0NDYwNn0.1996CFXZp-QdQK8I4l2GoJDyqYPQU3OrmJ7-03DtMCE';

let _supabase = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

/* ─── AUTH ──────────────────────────────────────────────── */

async function signUp(email, password, fullName) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
  localStorage.removeItem('kgs_auth_token');
}

async function getUser() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function getSession() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

/* ─── PRODUCTS ─────────────────────────────────────────── */

async function fetchProducts({ category, search, sort, limit = 50, offset = 0 } = {}) {
  const sb = getSupabase();
  let query = sb.from('products').select('*', { count: 'exact' });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (sort === 'price-asc') query = query.order('price', { ascending: true });
  else if (sort === 'price-desc') query = query.order('price', { ascending: false });
  else if (sort === 'newest') query = query.order('created_at', { ascending: false });
  else query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data || [], total: count };
}

async function fetchProductByHandle(handle) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products').select('*').eq('handle', handle).single();
  if (error) throw error;
  return data;
}

async function fetchProductById(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

async function fetchFeaturedProducts(tag = 'featured', limit = 8) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products')
    .select('*')
    .contains('tags', [tag])
    .limit(limit);
  if (error) throw error;
  return data || [];
}

async function fetchNewArrivals(limit = 8) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

async function searchProducts(query) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products')
    .select('*')
    .or(`name.ilike.%${query}%,category.ilike.%${query}%,tags.cs.{"${query}"}`)
    .limit(20);
  if (error) throw error;
  return data || [];
}

/* ─── ADMIN: Product Management ────────────────────────── */

async function adminInsertProduct(product) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
}

async function adminUpdateProduct(id, updates) {
  const sb = getSupabase();
  const { data, error } = await sb.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function adminDeleteProduct(id) {
  const sb = getSupabase();
  const { error } = await sb.from('products').update({ is_active: false }).eq('id', id);
  if (error) throw error;
}

async function adminUploadImage(file, folder = 'products') {
  const sb = getSupabase();
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const { data, error } = await sb.storage.from('product-images').upload(fileName, file);
  if (error) throw error;
  const { data: urlData } = sb.storage.from('product-images').getPublicUrl(fileName);
  return urlData.publicUrl;
}

/* ─── ADMIN: Check if current user is admin ────────────── */

async function isAdmin() {
  const sb = getSupabase();
  const user = await getUser();
  if (!user) return false;
  const { data } = await sb.from('admin_users').select('id').eq('email', user.email).single();
  return !!data;
}

/* ─── ADMIN: Orders ────────────────────────────────────── */

async function adminFetchOrders({ status, limit = 50, offset = 0 } = {}) {
  const sb = getSupabase();
  let query = sb.from('orders').select('*, order_items(*)', { count: 'exact' });
  if (status && status !== 'all') query = query.eq('status', status);
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  const { data, error, count } = await query;
  if (error) throw error;
  return { orders: data || [], total: count };
}

async function adminUpdateOrderStatus(orderId, status) {
  const sb = getSupabase();
  const { error } = await sb.from('orders').update({ status }).eq('id', orderId);
  if (error) throw error;
}

/* ─── CUSTOMER: Profile ────────────────────────────────── */

async function getProfile() {
  const sb = getSupabase();
  const user = await getUser();
  if (!user) return null;
  const { data } = await sb.from('customers').select('*').eq('id', user.id).single();
  return data;
}

async function updateProfile(updates) {
  const sb = getSupabase();
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb.from('customers').update(updates).eq('id', user.id).select().single();
  if (error) throw error;
  return data;
}

/* ─── CUSTOMER: Addresses ──────────────────────────────── */

async function getAddresses() {
  const sb = getSupabase();
  const { data, error } = await sb.from('addresses').select('*').order('is_default', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function addAddress(address) {
  const sb = getSupabase();
  const user = await getUser();
  address.customer_id = user.id;
  const { data, error } = await sb.from('addresses').insert(address).select().single();
  if (error) throw error;
  return data;
}

/* ─── CUSTOMER: Orders ─────────────────────────────────── */

async function getMyOrders() {
  const sb = getSupabase();
  const { data, error } = await sb.from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function createOrder(orderData, items) {
  const sb = getSupabase();
  
  // Insert order
  const { data: order, error: orderError } = await sb.from('orders')
    .insert(orderData)
    .select()
    .single();
  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_image: item.product_image,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price
  }));

  const { error: itemsError } = await sb.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
}

/* ─── STORE REVIEWS ────────────────────────────────────── */

async function getStoreReviews() {
  const sb = getSupabase();
  const { data, error } = await sb.from('store_reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function submitStoreReview(reviewData) {
  const sb = getSupabase();
  const user = await getUser();
  
  if (user) {
    reviewData.customer_id = user.id;
  }
  
  const { data, error } = await sb.from('store_reviews').insert(reviewData).select().single();
  if (error) throw error;
  return data;
}

async function adminGetStoreReviews({ status = 'pending' } = {}) {
  const sb = getSupabase();
  let query = sb.from('store_reviews').select('*').order('created_at', { ascending: false });
  
  if (status === 'pending') {
    query = query.eq('is_approved', false);
  } else if (status === 'approved') {
    query = query.eq('is_approved', true);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function adminApproveStoreReview(reviewId) {
  const sb = getSupabase();
  const { error } = await sb.from('store_reviews').update({ is_approved: true }).eq('id', reviewId);
  if (error) throw error;
}

async function adminDeleteStoreReview(reviewId) {
  const sb = getSupabase();
  const { error } = await sb.from('store_reviews').delete().eq('id', reviewId);
  if (error) throw error;
}
